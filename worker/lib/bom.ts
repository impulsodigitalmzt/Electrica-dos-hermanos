import type { Sql } from "../db";
import type { FaltanteBom, LineaBom, PaqueteBom, Producto } from "../types";
import { buscarProductos } from "./catalog";
import { claveApiGroq, groqChat, parseJsonObject } from "./groq";

type Borrador = {
  query: string;
  cantidad: number;
  grupo: string;
};

function parseLineas(valor: unknown): Borrador[] {
  if (!Array.isArray(valor)) return [];
  const out: Borrador[] = [];
  for (const item of valor) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const query = String(row.query ?? row.nombre ?? "").trim();
    if (query.length < 3) continue;
    out.push({
      query: query.slice(0, 80),
      cantidad: Math.max(1, Math.trunc(Number(row.cantidad) || 1)),
      grupo: String(row.grupo ?? "materiales").trim().slice(0, 40) || "materiales",
    });
  }
  return out.slice(0, 8);
}

function productoALinea(hit: Producto, cantidad: number, grupo: string): LineaBom {
  return {
    sku: hit.sku,
    nombre: hit.nombre,
    cantidad: Math.min(Math.max(1, cantidad), Math.max(1, hit.stock || 1)),
    precio: hit.precio,
    existencia: hit.stock,
    grupo,
    urlImagen: hit.urlImagen,
  };
}

function queryAnaquel(query: string): string {
  return query
    .replace(/\bmagnetot[eé]rmico\b/gi, "termomagnetico")
    .replace(/\bcaja de fusibles\b/gi, "centro de carga")
    .replace(/\bthhn\b/gi, "thw")
    .replace(/\bcinta aislante\b/gi, "cinta de aislar")
    .replace(/\b[øØ]\s?\d+\s?mm\b/gi, "1/2")
    .replace(/\b\d+\s?mm²\b/gi, "")
    .replace(/\b(bobina|rollo) de \d+\s?m\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function buscarHit(sql: Sql, query: string): Promise<Producto | null> {
  const intentos = [queryAnaquel(query), query.split(/\s+/).slice(0, 3).join(" ")];
  for (const q of intentos) {
    if (q.length < 3) continue;
    const { productos } = await buscarProductos(sql, { q, limit: 6 });
    const conStock = productos.filter((item) => item.stock > 0);
    const hit = conStock[0] ?? productos[0] ?? null;
    if (hit) return hit;
  }
  return null;
}

async function validarLineas(
  sql: Sql,
  borradores: Borrador[]
): Promise<{ lineas: LineaBom[]; faltantes: FaltanteBom[] }> {
  const vistos = new Set<string>();
  const lineas: LineaBom[] = [];
  const faltantes: FaltanteBom[] = [];
  const hallados = await Promise.all(
    borradores.map(async (linea) => ({
      linea,
      hit: await buscarHit(sql, linea.query),
    }))
  );
  for (const { linea, hit } of hallados) {
    if (!hit) {
      faltantes.push({ query: linea.query, grupo: linea.grupo });
      continue;
    }
    const clave = hit.sku.toLowerCase();
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    lineas.push(productoALinea(hit, linea.cantidad, linea.grupo));
  }
  return { lineas, faltantes };
}

export async function armarPaquete(
  sql: Sql,
  env: Env,
  texto: string,
  historial: { rol: string; texto: string }[],
  paquetePrevio: PaqueteBom | null,
  ajuste: boolean
): Promise<PaqueteBom> {
  const vacio: PaqueteBom = {
    id: paquetePrevio?.id ?? crypto.randomUUID(),
    titulo: "Paquete sugerido",
    resumen: "Para armarte el paquete necesito el detalle del trabajo. ¿Acometida, cableado o instalación?",
    lineas: [],
    faltantes: [],
  };
  if (!claveApiGroq(env)) {
    return paquetePrevio?.lineas.length ? paquetePrevio : vacio;
  }

  const partes: string[] = [];
  if (paquetePrevio?.lineas.length) {
    partes.push(
      `Paquete actual:\n${JSON.stringify({
        titulo: paquetePrevio.titulo,
        lineas: paquetePrevio.lineas.map((l) => ({ sku: l.sku, nombre: l.nombre, cantidad: l.cantidad, grupo: l.grupo })),
      })}`
    );
  }
  if (historial.length) {
    partes.push(
      `Historial:\n${historial
        .slice(-10)
        .map((m) => `${m.rol === "user" ? "cliente" : "mostrador"}: ${m.texto}`)
        .join("\n")}`
    );
  }
  partes.push(`Último mensaje:\n${texto.slice(0, 500)}`);
  if (ajuste) partes.push("El cliente objeta cantidades. Conserva lo que no objetó.");

  try {
    const crudo = await groqChat(
      env,
      [
        {
          role: "system",
          content: `Eres el mostrador experto de Eléctrica Dos Hermanos en México. Descompones el pedido en materiales del anaquel local.
Responde SOLO JSON:
{"titulo":"nombre corto","mensaje":"1 a 3 frases","lineas":[{"query":"término de anaquel","cantidad":1,"grupo":"protección"}]}
query DEBE ser corto y de mostrador mexicano: interruptor termomagnetico 2 polos, cable thw 10, tubo conduit 1/2, cinta de aislar, centro de carga, contacto duplex.
PROHIBIDO: magnetotérmico, THHN, mm², fusibles tipo C, bobinas de 100 m, anglicismos.
Máximo 8 líneas. cantidad = unidades de venta (1 pieza, 1 rollo). No inventes SKUs ni precios.
grupos: protección, conductores, canalización, control, salidas, acabados.`,
        },
        { role: "user", content: partes.join("\n\n").slice(0, 3800) },
      ],
      { temperature: 0.2, maxTokens: 700 }
    );
    const parsed = parseJsonObject(crudo);
    const borradores = parseLineas(parsed.lineas);
    if (!borradores.length) return paquetePrevio?.lineas.length ? paquetePrevio : vacio;
    const { lineas, faltantes } = await validarLineas(sql, borradores);
    return {
      id: paquetePrevio?.id ?? crypto.randomUUID(),
      titulo: String(parsed.titulo ?? "Paquete sugerido").trim().slice(0, 80) || "Paquete sugerido",
      resumen: String(parsed.mensaje ?? "").trim().slice(0, 500),
      lineas,
      faltantes,
    };
  } catch {
    return paquetePrevio?.lineas.length ? paquetePrevio : vacio;
  }
}
