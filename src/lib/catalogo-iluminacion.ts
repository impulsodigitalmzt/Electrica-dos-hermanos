import { marcaDe } from "@/lib/brand";
import type { Producto } from "@/types";

export const TIPOS_LUMINARIO = [
  { id: "todas", label: "Todas" },
  { id: "Lámparas de techo", label: "Lámparas de techo" },
  { id: "Focos LED", label: "Focos LED" },
  { id: "Empotrados", label: "Empotrados" },
  { id: "Arbotantes", label: "Arbotantes" },
  { id: "Reflectores", label: "Reflectores" },
  { id: "Tiras LED", label: "Tiras LED" },
] as const;

export const MARCAS_ILUMINACION = ["LEDVANCE", "MAGG", "PHILIPS", "TECNOLITE", "VOLTECK"] as const;
export const TEMPERATURAS = ["Cálida 3000K", "Neutra 4000K", "Fría 6500K"] as const;
export const USOS = ["Interior", "Exterior"] as const;

export const ORDEN_CATALOGO = [
  { id: "relevancia", label: "Relevancia" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
  { id: "descuento", label: "Mayor descuento" },
  { id: "calificacion", label: "Mejor calificados" },
] as const;

type LightingSeed = {
  id: number;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  pos: string;
  subcategory: string;
  temperature: Producto["temperatura"];
  watts: number;
  use: Producto["uso"];
  rating: number;
  description: string;
};

const SEEDS: LightingSeed[] = [
  { id: 101, brand: "TECNOLITE", name: "Lámpara colgante decorativa Niza", price: 1299, oldPrice: 1499, pos: "0% 0%", subcategory: "Lámparas de techo", temperature: "Cálida 3000K", watts: 24, use: "Interior", rating: 4.8, description: "Colgante decorativo de metal y vidrio ideal para comedor o barra de cocina." },
  { id: 102, brand: "MAGG", name: "Plafón LED cuadrado 24W luz neutra", price: 749, oldPrice: 869, pos: "0% 0%", subcategory: "Lámparas de techo", temperature: "Neutra 4000K", watts: 24, use: "Interior", rating: 4.6, description: "Plafón de sobreponer con difusor opalino para salas y pasillos." },
  { id: 103, brand: "PHILIPS", name: "Candil moderno 5 luces acabado negro", price: 2390, pos: "0% 0%", subcategory: "Lámparas de techo", temperature: "Cálida 3000K", watts: 45, use: "Interior", rating: 4.7, description: "Candil de líneas rectas para espacios de doble altura." },
  { id: 104, brand: "PHILIPS", name: "Foco LED Essential 9W luz cálida", price: 89, pos: "50% 0%", subcategory: "Focos LED", temperature: "Cálida 3000K", watts: 9, use: "Interior", rating: 4.9, description: "Foco de bajo consumo con base E27, equivalente a 60W incandescentes." },
  { id: 105, brand: "TECNOLITE", name: "Paquete 4 focos LED 12W luz fría", price: 299, oldPrice: 359, pos: "50% 0%", subcategory: "Focos LED", temperature: "Fría 6500K", watts: 12, use: "Interior", rating: 4.5, description: "Paquete ahorrador para iluminación general de casa o negocio." },
  { id: 106, brand: "LEDVANCE", name: "Foco inteligente WiFi RGB 10W", price: 389, pos: "50% 0%", subcategory: "Focos LED", temperature: "Cálida 3000K", watts: 10, use: "Interior", rating: 4.4, description: "Control por app y voz, 16 millones de colores y escenas programables." },
  { id: 107, brand: "MAGG", name: "Downlight Luna Flat 13W luz neutra", price: 385.12, pos: "100% 0%", subcategory: "Empotrados", temperature: "Neutra 4000K", watts: 13, use: "Interior", rating: 4.7, description: "Empotrado ultra delgado para plafón, instalación rápida a presión." },
  { id: 108, brand: "TECNOLITE", name: "Empotrado dirigible 7W blanco", price: 279, oldPrice: 320, pos: "100% 0%", subcategory: "Empotrados", temperature: "Cálida 3000K", watts: 7, use: "Interior", rating: 4.6, description: "Luminario direccionable para acentuar muros, cuadros o estanterías." },
  { id: 109, brand: "VOLTECK", name: "Empotrado exterior IP65 18W", price: 529, pos: "100% 0%", subcategory: "Empotrados", temperature: "Neutra 4000K", watts: 18, use: "Exterior", rating: 4.3, description: "Resistente a lluvia y polvo, apto para terrazas y cocheras." },
  { id: 110, brand: "TECNOLITE", name: "Arbotante LED arquitectónico 12W", price: 629, oldPrice: 715, pos: "0% 50%", subcategory: "Arbotantes", temperature: "Cálida 3000K", watts: 12, use: "Exterior", rating: 4.8, description: "Doble haz de luz para fachadas, muros y accesos." },
  { id: 111, brand: "MAGG", name: "Arbotante de pared tipo farol", price: 459, pos: "0% 50%", subcategory: "Arbotantes", temperature: "Cálida 3000K", watts: 9, use: "Exterior", rating: 4.2, description: "Estilo clásico en aluminio con vidrio templado." },
  { id: 112, brand: "VOLTECK", name: "Reflector LED exterior 50W IP65", price: 419, oldPrice: 499, pos: "50% 50%", subcategory: "Reflectores", temperature: "Fría 6500K", watts: 50, use: "Exterior", rating: 4.7, description: "Alta potencia para patios, bodegas y estacionamientos." },
  { id: 113, brand: "TECNOLITE", name: "Reflector LED 100W con sensor", price: 1189, oldPrice: 1349, pos: "50% 50%", subcategory: "Reflectores", temperature: "Fría 6500K", watts: 100, use: "Exterior", rating: 4.6, description: "Sensor de movimiento integrado y carcasa de aluminio inyectado." },
  { id: 114, brand: "PHILIPS", name: "Reflector solar 30W recargable", price: 899, pos: "50% 50%", subcategory: "Reflectores", temperature: "Neutra 4000K", watts: 30, use: "Exterior", rating: 4.1, description: "Panel solar incluido, autonomía de hasta 10 horas." },
  { id: 115, brand: "LEDVANCE", name: "Tira LED 5 m luz cálida con driver", price: 559, pos: "100% 50%", subcategory: "Tiras LED", temperature: "Cálida 3000K", watts: 36, use: "Interior", rating: 4.8, description: "Rollo de 5 metros con adhesivo 3M y fuente de poder incluida." },
  { id: 116, brand: "VOLTECK", name: "Tira LED RGB 5 m con control remoto", price: 429, oldPrice: 499, pos: "100% 50%", subcategory: "Tiras LED", temperature: "Fría 6500K", watts: 30, use: "Interior", rating: 4.4, description: "Cambio de color, modos dinámicos y control remoto infrarrojo." },
  { id: 117, brand: "MAGG", name: "Tira LED exterior IP67 10 m", price: 1099, pos: "100% 50%", subcategory: "Tiras LED", temperature: "Neutra 4000K", watts: 72, use: "Exterior", rating: 4.5, description: "Encapsulado resistente al agua para jardines y albercas." },
  { id: 118, brand: "TECNOLITE", name: "Luminario suspendido lineal 40W", price: 1849, oldPrice: 2090, pos: "0% 0%", subcategory: "Lámparas de techo", temperature: "Neutra 4000K", watts: 40, use: "Interior", rating: 4.9, description: "Perfil lineal de 1.20 m para oficinas, locales y showrooms." },
];

const FOTOS_REALES: Record<string, string> = {
  "Lámpara colgante decorativa Niza": "/productos/colgante-niza.jpg",
  "Foco LED Essential 9W luz cálida": "/productos/focos-pack.jpg",
  "Downlight Luna Flat 13W luz neutra": "/productos/downlight-luna.jpg",
  "Reflector solar 30W recargable": "/productos/reflector-solar.jpg",
};

export const CATALOGO_ILUMINACION: Producto[] = SEEDS.map((item) => ({
  sku: `LUM-${item.id}`,
  nombre: item.name,
  categoria: "iluminacion",
  marca: item.brand,
  precio: item.price,
  precioAnterior: item.oldPrice,
  stock: 20,
  descripcion: item.description,
  urlImagen: FOTOS_REALES[item.name] ?? "",
  ubicacion: "Iluminación",
  pos: item.pos,
  tipoLuminario: item.subcategory,
  temperatura: item.temperature,
  uso: item.use,
  watts: item.watts,
  rating: item.rating,
}));

function plano(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function tipoDe(producto: Producto): string {
  if (producto.tipoLuminario) return producto.tipoLuminario;
  const t = plano(`${producto.nombre} ${producto.descripcion} ${producto.categoria}`);
  if (/\b(tira led|tira de led)\b/.test(t)) return "Tiras LED";
  if (/\breflector/.test(t)) return "Reflectores";
  if (/\barbotante/.test(t)) return "Arbotantes";
  if (/\b(downlight|empotrado)/.test(t)) return "Empotrados";
  if (/\bfoco/.test(t)) return "Focos LED";
  if (/\b(lampara|plafon|candil|colgante|luminario|iluminacion)\b/.test(t)) return "Lámparas de techo";
  return "";
}

export function temperaturaDe(producto: Producto): Producto["temperatura"] | "" {
  if (producto.temperatura) return producto.temperatura;
  const t = plano(`${producto.nombre} ${producto.descripcion}`);
  if (/3000|calida/.test(t)) return "Cálida 3000K";
  if (/6500|fria/.test(t)) return "Fría 6500K";
  if (/4000|neutra/.test(t)) return "Neutra 4000K";
  return "";
}

export function usoDe(producto: Producto): Producto["uso"] | "" {
  if (producto.uso) return producto.uso;
  const t = plano(`${producto.nombre} ${producto.descripcion}`);
  if (/\b(exterior|ip65|ip67|solar|jardin|fachada|intemperie|terraza)\b/.test(t)) return "Exterior";
  if (tipoDe(producto)) return "Interior";
  return "";
}

export function descuentoDeProducto(producto: Producto): number {
  if (!producto.precioAnterior || producto.precioAnterior <= producto.precio) return 0;
  return Math.round((1 - producto.precio / producto.precioAnterior) * 100);
}

export type FiltrosCatalogo = {
  tipo: string;
  marcas: string[];
  temperaturas: string[];
  uso: string;
  maxPrice: number;
  onlyOffers: boolean;
  q: string;
  sort: string;
};

export function aplicarFiltros(productos: Producto[], filtros: FiltrosCatalogo): Producto[] {
  const texto = plano(filtros.q);
  const filtrados = productos.filter((item) => {
    const tipo = tipoDe(item);
    const marca = marcaDe(item.nombre, item.marca);
    const temp = temperaturaDe(item);
    const uso = usoDe(item);
    if (filtros.tipo !== "todas" && tipo !== filtros.tipo) return false;
    if (filtros.marcas.length && !filtros.marcas.includes(marca)) return false;
    if (filtros.temperaturas.length && (!temp || !filtros.temperaturas.includes(temp))) return false;
    if (filtros.uso !== "todos" && uso !== filtros.uso) return false;
    if (item.precio > filtros.maxPrice) return false;
    if (filtros.onlyOffers && descuentoDeProducto(item) <= 0) return false;
    if (texto && !plano(`${item.nombre} ${marca} ${item.categoria} ${tipo} ${item.descripcion}`).includes(texto)) return false;
    return true;
  });

  const sorted = [...filtrados];
  if (filtros.sort === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
  if (filtros.sort === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
  if (filtros.sort === "descuento") sorted.sort((a, b) => descuentoDeProducto(b) - descuentoDeProducto(a));
  if (filtros.sort === "calificacion") sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return sorted;
}

export function conteoTipo(productos: Producto[], tipoId: string): number {
  if (tipoId === "todas") return productos.length;
  return productos.filter((item) => tipoDe(item) === tipoId).length;
}

export function encontrarProductoLocal(sku: string): Producto | undefined {
  return CATALOGO_ILUMINACION.find((item) => item.sku.toLowerCase() === sku.toLowerCase());
}

export function mezclarCatalogo(principal: Producto[], extra: Producto[]): Producto[] {
  const vistos = new Set(principal.map((item) => item.sku.toLowerCase()));
  const nombres = new Set(principal.map((item) => plano(item.nombre)));
  const out = [...principal];
  for (const item of extra) {
    const sku = item.sku.toLowerCase();
    const nombre = plano(item.nombre);
    if (vistos.has(sku) || nombres.has(nombre)) continue;
    vistos.add(sku);
    nombres.add(nombre);
    out.push(item);
  }
  return out;
}
