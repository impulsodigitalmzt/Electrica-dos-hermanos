import { FOTO } from "@/lib/imagenes-locales";
import type { Producto } from "../types";

export const DEMO_PRODUCTOS: Producto[] = [
  {
    sku: "TEC-NIZA-01",
    nombre: "Lámpara colgante decorativa Niza",
    marca: "TECNOLITE",
    categoria: "iluminacion",
    precio: 1299,
    precioAnterior: 1499,
    stock: 18,
    descripcion: "Luminaria colgante decorativa para sala y comedor.",
    urlImagen: FOTO.colgante,
    ubicacion: "Anaquel A1",
  },
  {
    sku: "PHI-ESS-9W",
    nombre: "Foco LED Essential 9W luz cálida",
    marca: "PHILIPS",
    categoria: "iluminacion",
    precio: 89,
    stock: 120,
    descripcion: "Foco LED de 9W equivalente a 60W, luz cálida 3000K.",
    urlImagen: FOTO.foco,
    ubicacion: "Anaquel A2",
  },
  {
    sku: "MAGG-LUNA-13",
    nombre: "Downlight Luna Flat 13W luz neutra",
    marca: "MAGG",
    categoria: "iluminacion",
    precio: 385.12,
    stock: 42,
    descripcion: "Empotrado LED ultra plano para plafón.",
    urlImagen: FOTO.downlight,
    ubicacion: "Anaquel A3",
  },
  {
    sku: "TEC-ARB-12W",
    nombre: "Arbotante LED arquitectónico 12W",
    marca: "TECNOLITE",
    categoria: "iluminacion",
    precio: 629,
    precioAnterior: 715,
    stock: 24,
    descripcion: "Arbotante de muro para interiores y terrazas.",
    urlImagen: FOTO.arbotante,
    ubicacion: "Anaquel A4",
  },
  {
    sku: "VOL-REF-50",
    nombre: "Reflector LED exterior 50W IP65",
    marca: "VOLTECK",
    categoria: "iluminacion",
    precio: 419,
    precioAnterior: 499,
    stock: 36,
    descripcion: "Reflector para áreas exteriores, protección IP65.",
    urlImagen: FOTO.reflector,
    ubicacion: "Anaquel B1",
  },
  {
    sku: "LED-TIRA-5M",
    nombre: "Tira LED 5 m luz cálida con driver",
    marca: "LEDVANCE",
    categoria: "iluminacion",
    precio: 559,
    stock: 28,
    descripcion: "Tira LED de 5 metros con fuente incluida.",
    urlImagen: FOTO.tira,
    ubicacion: "Anaquel B2",
  },
  {
    sku: "BTI-LNOW-01",
    nombre: "Placa e interruptor Living Now blanco",
    marca: "BTICINO",
    categoria: "placas",
    precio: 247,
    stock: 55,
    descripcion: "Placa e interruptor sencillo línea Living Now.",
    urlImagen: FOTO.dobleApagador,
    ubicacion: "Anaquel C1",
  },
  {
    sku: "CON-THW-12",
    nombre: "Cable THW-LS calibre 12, rollo 100 m",
    marca: "CONDULAC",
    categoria: "conductores",
    precio: 1899,
    precioAnterior: 2110,
    stock: 14,
    descripcion: "Conductor THW-LS calibre 12 AWG en rollo de 100 m.",
    urlImagen: FOTO.cableNegro,
    ubicacion: "Anaquel D1",
  },
  {
    sku: "VOL-DUP-127",
    nombre: "Contacto dúplex aterrizado 127V blanco",
    marca: "VOLTECK",
    categoria: "contactos",
    precio: 46,
    stock: 80,
    descripcion: "Contacto residencial dúplex con tierra.",
    urlImagen: FOTO.contacto,
    ubicacion: "Anaquel C2",
  },
  {
    sku: "PVC-CON-12",
    nombre: "Tubo conduit PVC 1/2 pulgada",
    marca: "IUSA",
    categoria: "tuberia",
    precio: 38,
    stock: 200,
    descripcion: "Tubería conduit de PVC para instalaciones visibles.",
    urlImagen: FOTO.tubo,
    ubicacion: "Anaquel E1",
  },
  {
    sku: "BTI-3G-01",
    nombre: "Placa de 3 apagadores acabado acero",
    marca: "BTICINO",
    categoria: "placas",
    precio: 289,
    stock: 32,
    descripcion: "Placa triple para control de circuitos independientes.",
    urlImagen: FOTO.tresApagadores,
    ubicacion: "Anaquel C1",
  },
  {
    sku: "BTI-COMBO-01",
    nombre: "Placa con apagador y contacto",
    marca: "BTICINO",
    categoria: "placas",
    precio: 168,
    stock: 40,
    descripcion: "Combinación de interruptor y tomacorriente en una sola placa.",
    urlImagen: FOTO.apagadorContacto,
    ubicacion: "Anaquel C1",
  },
  {
    sku: "EMG-LED-01",
    nombre: "Lámpara de emergencia LED",
    marca: "VOLTECK",
    categoria: "iluminacion",
    precio: 349,
    stock: 22,
    descripcion: "Iluminación de respaldo para pasillos, comercios y áreas comunes.",
    urlImagen: FOTO.emergencia,
    ubicacion: "Anaquel B3",
  },
  {
    sku: "PIE-NIZA-01",
    nombre: "Lámpara de pie Niza",
    marca: "TECNOLITE",
    categoria: "iluminacion",
    precio: 1590,
    stock: 8,
    descripcion: "Lámpara de piso con pantalla de fibras naturales para sala o lectura.",
    urlImagen: FOTO.lamparaPie,
    ubicacion: "Anaquel A1",
  },
  {
    sku: "BTI-QNZ-01",
    nombre: "Kit placa negra con apagador y contacto",
    marca: "BTICINO",
    categoria: "placas",
    precio: 198,
    stock: 26,
    descripcion: "Línea de color negro: placa de 2 ventanas, 1 apagador y 1 contacto.",
    urlImagen: FOTO.promoQuinzi,
    ubicacion: "Anaquel C1",
  },
  {
    sku: "ROC-ESP-65",
    nombre: "Foco espiral ahorrador 65W",
    marca: "ROCE",
    categoria: "iluminacion",
    precio: 42,
    stock: 90,
    descripcion: "Foco espiral de 65W para iluminación general de alto rendimiento.",
    urlImagen: FOTO.promoEspiral,
    ubicacion: "Anaquel A2",
  },
];

function normalizar(valor: string): string {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filtrarDemo(productos: Producto[], q: string, categoria = ""): Producto[] {
  const cat = normalizar(categoria);
  const tokens = normalizar(q)
    .split(/\s+/)
    .filter(Boolean);

  const filtrados = productos.filter((producto) => {
    if (cat && normalizar(producto.categoria) !== cat) return false;
    if (!tokens.length) return true;
    const haystack = normalizar(
      [producto.nombre, producto.marca, producto.categoria, producto.descripcion, producto.sku].join(" ")
    );
    return tokens.some((token) => haystack.includes(token));
  });

  return filtrados.length ? filtrados : productos;
}

/** Coincidencias para el autocompletado. Vacío si no hay match (no rellena el catálogo entero). */
export function sugerenciasLocales(q: string, limite = 6): Producto[] {
  const n = normalizar(q);
  if (n.length < 2) return [];
  return DEMO_PRODUCTOS.filter((producto) =>
    normalizar(
      [producto.nombre, producto.marca, producto.categoria, producto.descripcion, producto.sku].join(" ")
    ).includes(n)
  ).slice(0, limite);
}
