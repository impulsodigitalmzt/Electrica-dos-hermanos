import { CATALOGO_ILUMINACION } from "@/lib/catalogo-iluminacion";
import { DEMO_PRODUCTOS } from "@/lib/demo-productos";
import { FOTO } from "@/lib/imagenes-locales";
import type { LineaCuenta, Producto } from "@/types";

export const ACCESORIOS_COMPLEMENTO: Producto[] = [
  {
    sku: "ACC-FOTO-LEDV",
    nombre: "Fotocelda para uso exterior LEDVANCE 120/277V 3 pines azul",
    marca: "LEDVANCE",
    categoria: "electricidad",
    precio: 82.48,
    stock: 40,
    descripcion: "Fotocelda para encendido automático de luminarios y focos exteriores.",
    urlImagen: FOTO.reflector,
    ubicacion: "Accesorios",
  },
  {
    sku: "ACC-SOCK-E27",
    nombre: "Socket / portalámpara E27 de porcelana para foco LED",
    marca: "VOLTECK",
    categoria: "electricidad",
    precio: 28.5,
    stock: 80,
    descripcion: "Base E27 compatible con focos y lámparas de uso general.",
    urlImagen: FOTO.foco,
    ubicacion: "Accesorios",
  },
  {
    sku: "ACC-BASE-E27",
    nombre: "Base para foco LED E27 con orejas de montaje",
    marca: "VOLTECK",
    categoria: "electricidad",
    precio: 34.9,
    stock: 60,
    descripcion: "Soporte para instalar focos LED en plafón o luminario.",
    urlImagen: FOTO.placaPlata,
    ubicacion: "Accesorios",
  },
  {
    sku: "ACC-EXT-POL",
    nombre: "Extensión polarizada 1.8 m para luminario",
    marca: "IUSA",
    categoria: "electricidad",
    precio: 49,
    stock: 35,
    descripcion: "Extensión para conectar lámparas, focos y arbotantes.",
    urlImagen: FOTO.cables,
    ubicacion: "Accesorios",
  },
];

function plano(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function textoCarrito(lineas: LineaCuenta[]): string {
  return plano(lineas.map((linea) => linea.nombre).join(" "));
}

export function consultaComplemento(lineas: LineaCuenta[]): string {
  const t = textoCarrito(lineas);
  if (/\b(reflector|arbotante|exterior|ip65)\b/.test(t)) return "fotocelda sensor contacto";
  if (/\b(tira led|tira de led)\b/.test(t)) return "fuente driver contacto";
  if (/\b(foco|lampara|luminario|plafon|candil|downlight)\b/.test(t)) return "contacto socket placa";
  if (/\b(contacto|tomacorriente)\b/.test(t)) return "placa apagador";
  if (/\b(apagador|interruptor)\b/.test(t)) return "placa contacto";
  return "contacto cinta";
}

function puntuarComplemento(producto: Producto, carrito: string): number {
  const t = plano(`${producto.nombre} ${producto.descripcion} ${producto.categoria} ${producto.marca ?? ""}`);
  let score = 0;
  if (/\b(foco|lampara|luminario|plafon|candil|downlight)\b/.test(carrito)) {
    if (/\b(fotocelda|socket|portalamp|base e27|contacto|placa)\b/.test(t)) score += 24;
    if (/\b(cinta|clavija|extension)\b/.test(t)) score += 10;
  }
  if (/\b(reflector|arbotante|exterior|ip65|ip67)\b/.test(carrito)) {
    if (/\b(fotocelda|sensor|exterior|ip65)\b/.test(t)) score += 26;
  }
  if (/\b(tira led|tira de led)\b/.test(carrito)) {
    if (/\b(driver|fuente|conector|tira)\b/.test(t)) score += 22;
  }
  if (/\b(contacto|tomacorriente)\b/.test(carrito)) {
    if (/\b(placa|apagador|interruptor)\b/.test(t)) score += 20;
  }
  if (/\b(apagador|interruptor)\b/.test(carrito)) {
    if (/\b(placa|contacto)\b/.test(t)) score += 20;
  }
  if (score === 0 && /\b(electricidad|iluminacion|accesorios)\b/.test(t)) score += 4;
  return score;
}

export function sugerirComplementos(lineas: LineaCuenta[], extra: Producto[] = []): Producto[] {
  if (!lineas.length) return [];
  const enCarrito = new Set(lineas.map((linea) => linea.sku.toLowerCase()));
  const nombres = new Set(lineas.map((linea) => plano(linea.nombre)));
  const carrito = textoCarrito(lineas);
  const pool = [...ACCESORIOS_COMPLEMENTO, ...CATALOGO_ILUMINACION, ...DEMO_PRODUCTOS, ...extra];
  const vistos = new Set<string>();
  const candidatos: Producto[] = [];
  for (const item of pool) {
    const sku = item.sku.toLowerCase();
    const nombre = plano(item.nombre);
    if (enCarrito.has(sku) || nombres.has(nombre) || vistos.has(sku)) continue;
    vistos.add(sku);
    const score = puntuarComplemento(item, carrito);
    if (score <= 0) continue;
    candidatos.push(item);
  }
  return candidatos
    .sort((a, b) => puntuarComplemento(b, carrito) - puntuarComplemento(a, carrito) || a.precio - b.precio)
    .slice(0, 6);
}

export function relacionadosDeProducto(producto: Producto, extra: Producto[] = []): Producto[] {
  const vistos = new Set([producto.sku.toLowerCase()]);
  const out: Producto[] = [];
  const push = (item: Producto) => {
    const sku = item.sku.toLowerCase();
    if (vistos.has(sku)) return;
    vistos.add(sku);
    out.push(item);
  };
  const pool = [...extra, ...CATALOGO_ILUMINACION, ...DEMO_PRODUCTOS, ...ACCESORIOS_COMPLEMENTO];
  for (const item of pool) {
    if (producto.tipoLuminario && item.tipoLuminario === producto.tipoLuminario) push(item);
  }
  for (const item of pool) {
    if (item.categoria === producto.categoria) push(item);
  }
  sugerirComplementos(
    [{ sku: producto.sku, nombre: producto.nombre, cantidad: 1, precio: producto.precio, origen: "catalogo" }],
    extra,
  ).forEach(push);
  extra.forEach(push);
  return out.slice(0, 4);
}
