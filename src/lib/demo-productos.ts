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
    urlImagen: "/productos/colgante-niza.jpg",
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
    urlImagen: "/productos/focos-pack.jpg",
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
    urlImagen: "/productos/downlight-luna.jpg",
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
    urlImagen: "/demo/arbotante.svg",
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
    urlImagen: "/demo/reflector.svg",
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
    urlImagen: "/demo/tira-led.svg",
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
    urlImagen: "/demo/placa.svg",
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
    urlImagen: "/demo/cable.svg",
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
    urlImagen: "/demo/contacto.svg",
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
    urlImagen: "/demo/tubo.svg",
    ubicacion: "Anaquel E1",
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
