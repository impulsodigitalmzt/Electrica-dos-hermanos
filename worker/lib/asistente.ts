import type { Sql } from "../db";
import type { LineaCuenta, Producto, SesionMostrador } from "../types";
import { armarPaquete } from "./bom";
import { buscarProductos } from "./catalog";
import { cantidadDesdeConsulta, esNegociacion, fusionarLineas, pideCerrar, reemplazarPaquete, totalPedido } from "./cuenta";
import { claveApiGroq, groqChat } from "./groq";
import { anexarMensajes, recordarProductos } from "./memory";
import { clasificarIntencion } from "./orchestrator";

const CIERRE = "¿Se te ofrece algo más o con esto cerramos?";

function precioMx(valor: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(valor);
}

function productoALinea(producto: Producto, cantidad: number): LineaCuenta | null {
  if (producto.stock <= 0) return null;
  return {
    sku: producto.sku,
    nombre: producto.nombre,
    cantidad: Math.min(Math.max(1, cantidad), producto.stock),
    precio: producto.precio,
    urlImagen: producto.urlImagen || undefined,
    origen: "asistente",
  };
}

function redactarProducto(texto: string, productos: Producto[], agregados: LineaCuenta[]): string {
  if (!productos.length) {
    return `De eso no topé coincidencia en anaquel. Si me das el nombre de mostrador o el SKU lo busco de nuevo. ${CIERRE}`;
  }
  const primero = productos[0];
  if (!primero) return `Dime qué pieza ocupas y la localizo en anaquel. ${CIERRE}`;
  if (agregados.length) {
    return `Claro, de ${primero.nombre} traemos este en anaquel. Hay existencia (${primero.stock} pza) a ${precioMx(primero.precio)}. Ya lo sumé a tu cuenta. ${CIERRE}`;
  }
  return `Esto es lo más cercano a “${texto.slice(0, 60)}” que traemos hoy. ¿Eso es lo que buscas o quieres ver otras opciones?`;
}

function redactarPaquete(sesion: SesionMostrador): string {
  const paquete = sesion.paquete;
  if (!paquete) return `Para armarte el paquete cuéntame el trabajo: acometida, cableado o instalación.`;
  if (!paquete.lineas.length) {
    return paquete.resumen || "Para armarte el paquete necesito más detalle del trabajo.";
  }
  const aviso = paquete.faltantes.length
    ? ` Hoy no topé en anaquel: ${paquete.faltantes.map((f) => f.query).join(", ")}.`
    : "";
  const intro =
    paquete.resumen ||
    `Claro, para ${paquete.titulo} vas a ocupar lo siguiente. Te armé el paquete con lo que tenemos en existencia y ya lo sumé a tu cuenta.`;
  return `${intro}${aviso} ¿Así te queda o le movemos otra línea?`;
}

function redactarCuenta(sesion: SesionMostrador): string {
  if (!sesion.pedido.length) return "Tu cuenta de mostrador está vacía. Dime qué ocupas y la empezamos.";
  const lineas = sesion.pedido
    .map((l) => `• ${l.nombre} × ${l.cantidad} — ${precioMx(l.precio * l.cantidad)}`)
    .join("\n");
  return `Así va tu cuenta:\n${lineas}\nTotal: ${precioMx(totalPedido(sesion.pedido))}. ${CIERRE}`;
}

async function redactarConLlm(env: Env, sesion: SesionMostrador, texto: string, productos: Producto[]): Promise<string | null> {
  if (!claveApiGroq(env)) return null;
  try {
    return await groqChat(
      env,
      [
        {
          role: "system",
          content: `Eres el vendedor veterano de Eléctrica Dos Hermanos (ferretería, electricidad y plomería en México).
La cuenta queda ABIERTA hasta que el cliente cierre. Recuerdas TODO lo pedido en este hilo.
PROHIBIDO inventar SKUs, precios o existencias. Solo cita lo que viene en el JSON.
PROHIBIDO escribir marcadores [[...]]. Español de mostrador: apagador, contacto, módulos.
Si sesion.negociacion=true confirma el ajuste y pregunta si así le queda.
Si no hay negociación ni cierre, cierra con: ${CIERRE}
Nunca preguntes «¿de qué estábamos hablando?».`,
        },
        {
          role: "user",
          content: JSON.stringify({
            mensaje: texto,
            sesion: sesion.memoria,
            pedido: {
              lineas: sesion.pedido,
              total: totalPedido(sesion.pedido),
            },
            paquete: sesion.paquete,
            productos: productos.slice(0, 6).map((p) => ({
              sku: p.sku,
              nombre: p.nombre,
              precio: p.precio,
              stock: p.stock,
            })),
          }).slice(0, 4000),
        },
      ],
      { temperature: 0.25, maxTokens: 420 }
    );
  } catch {
    return null;
  }
}

export async function atenderMostrador(
  sql: Sql,
  env: Env,
  sesion: SesionMostrador,
  mensaje: string,
  pedidoCliente?: LineaCuenta[]
): Promise<{
  sesion: SesionMostrador;
  productos: Producto[];
  ruta: string;
}> {
  if (pedidoCliente?.length) {
    sesion.pedido = fusionarLineas(sesion.pedido, pedidoCliente);
  }

  const negociacion = esNegociacion(mensaje);
  const cierre = pideCerrar(mensaje);
  sesion.memoria.negociacion = negociacion;
  sesion.memoria.cierreSolicitado = cierre && !negociacion;

  const clasificacion = await clasificarIntencion(mensaje, env, Boolean(sesion.paquete?.lineas.length));
  let productos: Producto[] = [];
  let respuesta = "";

  if (clasificacion.ruta === "cuenta" || cierre) {
    respuesta = redactarCuenta(sesion);
  } else if (clasificacion.ruta === "proyecto") {
    const paquete = await armarPaquete(sql, env, mensaje, sesion.mensajes, sesion.paquete, negociacion);
    sesion.paquete = paquete;
    if (paquete.lineas.length) {
      sesion.pedido = reemplazarPaquete(sesion.pedido, paquete);
      recordarProductos(sesion, paquete.lineas.map((l) => l.nombre));
      productos = paquete.lineas.map((l) => ({
        sku: l.sku,
        nombre: l.nombre,
        categoria: l.grupo,
        precio: l.precio,
        stock: l.existencia,
        descripcion: "",
        urlImagen: l.urlImagen,
        ubicacion: "",
      }));
    }
    respuesta = redactarPaquete(sesion);
  } else {
    const busqueda = await buscarProductos(sql, { q: mensaje, limit: 8 });
    productos = busqueda.productos;
    const cantidad = cantidadDesdeConsulta(mensaje);
    const top = productos[0];
    const linea = top && top.stock > 0 && tokensClaros(mensaje) ? productoALinea(top, cantidad) : null;
    if (linea) {
      sesion.pedido = fusionarLineas(sesion.pedido, [linea]);
      recordarProductos(sesion, [linea.nombre]);
    }
    respuesta = redactarProducto(mensaje, productos, linea ? [linea] : []);
  }

  const permitirLlm =
    clasificacion.ruta !== "proyecto" || Boolean(sesion.paquete?.lineas.length);
  const conLlm = permitirLlm ? await redactarConLlm(env, sesion, mensaje, productos) : null;
  if (conLlm && !conLlm.includes("|---")) respuesta = conLlm;
  anexarMensajes(sesion, mensaje, respuesta);
  return { sesion, productos, ruta: clasificacion.ruta };
}

function tokensClaros(texto: string): boolean {
  const limpio = texto.trim();
  return limpio.length >= 3 && !/^(hola|buenas|buenos dias|qué tal)[.!]?$/i.test(limpio);
}
