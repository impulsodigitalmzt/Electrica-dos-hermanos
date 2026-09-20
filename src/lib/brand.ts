import { FOTO } from "@/lib/imagenes-locales";

export const WHATSAPP_URL = "https://wa.me/526699407077";
export const MAIN_EMAIL = "cotizaciones.mzt@electricadoshermanos.com";
export const ENVIO_GRATIS_DESDE = 1000;
export const LOGO_SRC = "/logo.png";
export const HERO_HOME = "/brand/lumi-hero-home.jpg";
export const HERO_INDUSTRIAL = "/brand/lumi-hero-industrial.jpg";
export const HERO_PROMO = "/brand/sala-minim-ilum.jpg";
export const HERO_ILUMINACION = "/brand/iluminacion-sala-reducida.jpeg";
export const HERO_CONTACTOS = "/brand/apagador%20wifi.JPG";
export const PRODUCT_SHEET = "/brand/lumi-products-sheet.jpg";
export const PROMO_TEMPORADA = "/promocion/promocion.jpg";
export const PROMO_TEMPORADA_VIDEO = "/videos/promocion-dos-hnos.mp4";

export const VIDEOS = {
  sucursal: {
    src: "/videos/anuncio.mp4",
    title: "Recorrido por sucursal Eléctrica dos Hermanos",
    kicker: "En sucursal",
    heading: "Recorre nuestra sucursal",
    text: "Más de 10,000 productos para obra, casa y negocio. Te armamos la lista el mismo día.",
    cta: "Ver sucursales",
    to: "/#sucursales",
  },
  marca: {
    src: "/videos/anuncio-dos-hnos.mp4",
    title: "Eléctrica dos Hermanos, material eléctrico de confianza",
    kicker: "Nuestra casa",
    heading: "Seis sucursales para tu proyecto",
    text: "Mazatlán, Culiacán, San José del Cabo y Cabo San Lucas, con envío a todo México.",
    cta: "Cómo llegar",
    to: "/#sucursales",
  },
  makita: {
    src: "/videos/anuncio-makita.mp4",
    title: "Herramientas Makita en sucursal",
    kicker: "Makita",
    heading: "Herramientas profesionales Makita",
    text: "Taladros, rotomartillos y equipo profesional listo para recoger en sucursal.",
    cta: "Ver Makita",
    to: "/buscar?q=makita",
  },
  promocion: {
    src: "/videos/tecnolite.mp4",
    title: "Promoción Tecnolite en Eléctrica dos Hermanos",
    kicker: "Tecnolite",
    heading: "Iluminación Tecnolite",
    text: "Luminarios Tecnolite en promoción, con existencias para recoger en sucursal o envío a todo México.",
    cta: "Ver Tecnolite",
    to: "/buscar?q=tecnolite",
  },
} as const;

export function videoDeConsulta(q: string) {
  const texto = q.toLowerCase();
  if (/\bmakita\b/.test(texto)) return VIDEOS.makita;
  if (/\b(contacto|placa|apagador|interruptor)\b/.test(texto)) return VIDEOS.promocion;
  return null;
}

export function imagenDeConsulta(q: string, iluminacion = false) {
  const texto = q.toLowerCase();
  if (iluminacion) {
    return { src: HERO_ILUMINACION, alt: "Sala iluminada con luminarios LED" };
  }
  if (/\b(contacto|placa|apagador|interruptor)\b/.test(texto)) {
    return { src: HERO_CONTACTOS, alt: "Apagador inteligente en cocina iluminada" };
  }
  if (/\bmakita\b/.test(texto)) {
    return { src: HERO_INDUSTRIAL, alt: "Nave industrial lista para herramientas y material eléctrico" };
  }
  if (/\b(tubo|tuberia|conduit|pvc)\b/.test(texto)) {
    return { src: "/brand/iluminacion-industrial.jpg", alt: "Espacio industrial para tubería e instalación" };
  }
  if (/\b(cable|conductor|thw)\b/.test(texto)) {
    return { src: HERO_INDUSTRIAL, alt: "Obra e industria para conductores eléctricos" };
  }
  return { src: "/brand/iluminacion-oficinas.jpg", alt: "Oficina iluminada con material eléctrico" };
}

export const HERO_SLIDES = [
  {
    image: "/brand/lumi-hero-home.jpg",
    kicker: "Iluminación",
    title: "La primavera se ilumina",
    text: "Luminarias decorativas para transformar tu hogar, oficina y cada espacio que imaginas.",
    cta: "Ver iluminación",
    to: "/iluminacion",
    alt: "Sala moderna con lámparas colgantes y arbotantes",
  },
  {
    image: "/brand/sala-minim-ilum1.jpg",
    kicker: "Hogar",
    title: "Luz cálida para cada rincón",
    text: "Plafones, tiras LED y empotrados para salas, recámaras y pasillos.",
    cta: "Ver todo",
    to: "/iluminacion",
    alt: "Sala minimalista con plafón LED y tira perimetral",
  },
  {
    image: "/brand/sala-minim-ilum.jpg",
    kicker: "Decoración",
    title: "Diseño que ilumina",
    text: "Candiles y luminarios decorativos para comedor, sala y áreas sociales.",
    cta: "Ver lámparas",
    to: "/iluminacion?q=lampara",
    alt: "Sala con candil decorativo y downlights empotrados",
  },
  {
    image: "/brand/iluminacion-oficinas.jpg",
    kicker: "Oficinas",
    title: "Productividad con buena luz",
    text: "Plafones y luminarios LED para oficinas, locales y áreas de trabajo.",
    cta: "Ver catálogo",
    to: "/iluminacion?q=plafon",
    alt: "Oficina iluminada con plafones LED de techo",
  },
  {
    image: "/brand/lumi-hero-industrial.jpg",
    kicker: "Industrial",
    title: "Potencia cada proyecto",
    text: "Iluminación LED y material eléctrico confiable para naves, bodegas y obra.",
    cta: "Ver soluciones",
    to: "/buscar",
    alt: "Nave industrial iluminada con luminarios LED",
  },
  {
    image: "/brand/iluminacion-industrial.jpg",
    kicker: "Obra e industria",
    title: "Listos para tu instalación",
    text: "Reflectores, tubería, conductores y existencias para recoger en sucursal.",
    cta: "Ver ofertas",
    to: "/buscar",
    alt: "Espacio industrial con iluminación de alto rendimiento",
  },
  {
    image: "/brand/iluminacion-sala-reducida.jpeg",
    kicker: "Placas, apagadores y",
    title: "Contactos Residenciales",
    text: "Pequeños cambios que transforman grandes espacios.",
    cta: "Ver todo",
    to: "/buscar?q=contacto",
    alt: "Interior residencial listo para contactos y placas",
  },
] as const;

export const NAV_ITEMS = [
  { id: "iluminacion", label: "Iluminación", to: "/iluminacion" },
  { id: "contactos", label: "Contactos Residenciales", to: "/buscar?q=contacto" },
  { id: "placas", label: "Placas e Interruptores", to: "/buscar?q=apagador+placa+interruptor" },
  { id: "tuberia", label: "Tubería", to: "/buscar?q=tubo+pvc+conduit" },
  { id: "conductores", label: "Conductores", to: "/buscar?q=cable+thw" },
  { id: "marcas", label: "Marcas", to: "/#marcas" },
  { id: "ofertas", label: "Ofertas", to: "/buscar", sale: true },
] as const;

export const CATEGORY_TILES = [
  { label: "Lámparas de techo", q: "lampara", pos: "0% 0%", image: FOTO.colgante },
  { label: "Focos LED", q: "foco led", pos: "50% 0%", image: FOTO.foco },
  { label: "Empotrados", q: "downlight empotrado", pos: "100% 0%", image: FOTO.downlight },
  { label: "Arbotantes", q: "arbotante", pos: "0% 50%", image: FOTO.arbotante3 },
  { label: "Reflectores", q: "reflector", pos: "50% 50%", image: FOTO.reflector },
  { label: "Tiras LED", q: "tira led", pos: "100% 50%", image: FOTO.tira },
] as const;

export const PROMO_TILES = [
  { label: "Tiras LED", to: "/iluminacion?q=tira", image: FOTO.promoTira },
  { label: "Plafones ultra delgados", to: "/iluminacion?q=plafon", image: FOTO.promoPlafones },
  { label: "Luminario solar", to: "/iluminacion?q=solar", image: FOTO.promoSolar },
  { label: "Empotrados", to: "/iluminacion?q=downlight", image: FOTO.promoSpot },
] as const;

export const COLLECTION_CARDS = [
  { label: "Iluminación", to: "/iluminacion", image: FOTO.colgante },
  { label: "Contactos Residenciales", to: "/buscar?q=contacto", image: FOTO.contacto },
  { label: "Placas e Interruptores", to: "/buscar?q=apagador+placa+interruptor", image: FOTO.tresApagadores },
  { label: "Tubería", to: "/buscar?q=tubo+pvc+conduit", image: FOTO.tubo },
  { label: "Conductores", to: "/buscar?q=cable+thw", image: FOTO.cables },
  { label: "Ofertas", to: "/buscar", image: FOTO.promoOferta },
] as const;

export const MARCAS_CATALOGO = [
  { label: "TECNOLITE", q: "tecnolite", logo: "/brands/tecnolite.png" },
  { label: "BTICINO", q: "bticino", logo: "/brands/bticino.png" },
  { label: "CONDULAC", q: "condulac", logo: "/brands/condulac.png" },
  { label: "CONDUMEX", q: "condumex", logo: "/brands/condumex.png" },
  { label: "PHILIPS", q: "philips", logo: "/brands/phillips.png" },
  { label: "OSRAM", q: "osram", logo: "/brands/osram.png" },
  { label: "SIEMENS", q: "siemens", logo: "/brands/siemens.png" },
  { label: "VOLTECK", q: "volteck", logo: "/brands/volteck.png" },
  { label: "MAGG", q: "magg", logo: "/brands/magg.png" },
  { label: "IUSA", q: "iusa", logo: "/brands/iusa.png" },
  { label: "ANCLO", q: "anclo", logo: "/brands/anclo.png" },
  { label: "ARROW HART", q: "arrow hart", logo: "/brands/arrow-hart.png" },
  { label: "EMMSA", q: "emmsa", logo: "/brands/emmsa.png" },
  { label: "VIAKON", q: "viakon", logo: "/brands/viacon.png" },
  { label: "3M", q: "3M", logo: "/brands/3M.png" },
  { label: "MAKITA", q: "makita", logo: "/brands/makita.png" },
  { label: "TULMEX", q: "tulmex", logo: "/brands/tulmex.png" },
  { label: "POLIFLEX", q: "poliflex", logo: "/brands/poliflex.png" },
  { label: "RAWELT", q: "rawelt", logo: "/brands/rawelt.png" },
  { label: "SQUARE D", q: "square d", logo: "/brands/squared.png" },
  { label: "SOLA BASIC", q: "sola basic", logo: "/brands/solabasic.png" },
  { label: "TORK", q: "tork", logo: "/brands/tork.png" },
  { label: "TRUPER", q: "truper", logo: "/brands/trupper.png" },
] as const;

export const MARCAS = MARCAS_CATALOGO.map((item) => item.label);

const MARCAS_DETECT = [
  "ARROW HART",
  "SQUARE D",
  "SOLA BASIC",
  "TECNOLITE",
  "BTICINO",
  "CONDULAC",
  "CONDUMEX",
  "PHILIPS",
  "SIEMENS",
  "VOLTECK",
  "LEDVANCE",
  "VIAKON",
  "EMMSA",
  "TULMEX",
  "MAKITA",
  "POLIFLEX",
  "RAWELT",
  "TRUPER",
  "ANCLO",
  "OSRAM",
  "TORK",
  "MAGG",
  "IUSA",
  "3M",
] as const;

export function marcaDe(nombre: string, marca?: string): string {
  if (marca?.trim()) {
    const pedida = marca.trim().toUpperCase();
    if (pedida === "ISB" || pedida === "ISB SOLA BASIC") return "SOLA BASIC";
    const conocida = MARCAS_CATALOGO.find((item) => item.label.toUpperCase() === pedida);
    if (pedida === "LEDVANCE") return "LEDVANCE";
    return conocida?.label ?? marca.trim();
  }
  const upper = nombre.toUpperCase();
  return MARCAS_DETECT.find((item) => upper.includes(item)) ?? "E2H";
}

export function logoDeMarca(nombre: string, marca?: string): string {
  const key = marcaDe(nombre, marca).toUpperCase();
  if (key === "LEDVANCE") {
    return MARCAS_CATALOGO.find((item) => item.label === "OSRAM")?.logo ?? "";
  }
  return MARCAS_CATALOGO.find((item) => item.label.toUpperCase() === key)?.logo ?? "";
}

export function descuentoDe(precio: number, anterior?: number): number {
  if (!anterior || anterior <= precio) return 0;
  return Math.round((1 - precio / anterior) * 100);
}

export function telHref(phone: string): string {
  return `tel:+52${phone.replace(/\D/g, "")}`;
}

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phones: string[];
  email: string;
  mapEmbed: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "mzt-villa",
    name: "Mazatlán · Francisco Villa (Matriz)",
    city: "Mazatlán, Sin.",
    address: "División del Nte. 1900, Francisco Villa, 82127 Mazatlán, Sin.",
    phones: ["(669) 940-70-77", "(669) 940-70-88"],
    email: "cotizaciones.mzt@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d58660.99104331006!2d-106.4612011!3d23.2317331!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869f535b6da8dc49%3A0x144b3fb47cd3ec77!2sEl%C3%A9ctrica%20Dos%20Hermanos!5e0!3m2!1ses-419!2smx!4v1789776076985!5m2!1ses-419!2smx",
  },
  {
    id: "mzt-valle",
    name: "Mazatlán · Valle del Ejido",
    city: "Mazatlán, Sin.",
    address: "Av. Lib. Núm. 2 Pte., Amp Valle del Ejido, 82129 Mazatlán, Sin.",
    phones: ["(669) 917-00-11", "(669) 917-00-12"],
    email: "administracion.valle@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d58660.99104331006!2d-106.4612011!3d23.2317331!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8698ad060be2bf17%3A0x3aba638579b372df!2sElectrica%20Dos%20Hermanos!5e0!3m2!1ses-419!2smx!4v1789776151189!5m2!1ses-419!2smx",
  },
  {
    id: "mzt-real",
    name: "Mazatlán · Real Pacífico",
    city: "Mazatlán, Sin.",
    address: "Av Óscar Pérez Escobosa 6078, 82124 Mazatlán, Sin.",
    phones: ["(669) 442-0708"],
    email: "administracion.atl@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d58660.99104331006!2d-106.4612011!3d23.2317331!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8698ad43d3ac21a9%3A0xcdfa3fa1bb7e6e8c!2sElectrica%20Dos%20Hermanos!5e0!3m2!1ses-419!2smx!4v1789776212031!5m2!1ses-419!2smx",
  },
  {
    id: "culiacan",
    name: "Culiacán",
    city: "Culiacán, Sin.",
    address: "Lola Beltrán 4396, 80058 Culiacán Rosales, Sin.",
    phones: ["(667) 723-32-71", "(667) 723-31-68"],
    email: "administracion.cln@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.564804172909!2d-107.44477410321042!3d24.810351400000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86bcda826e7a06ad%3A0x37e60c6596b37a38!2sEl%C3%A9ctrica%20Dos%20Hermanos%20-%20Culiac%C3%A1n!5e0!3m2!1ses-419!2smx!4v1789776271623!5m2!1ses-419!2smx",
  },
  {
    id: "sjc",
    name: "San José del Cabo",
    city: "San José del Cabo, B.C.S.",
    address: "Carr. Transpeninsular SN, Sta Rosa, 23428 San José del Cabo, B.C.S.",
    phones: ["(624) 120-14-99", "(624) 120-13-99"],
    email: "administracion.sjc@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.3218937772526!2d-109.71230340321041!3d23.085309499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86af5a5e3afbf699%3A0xe46911109dc6645e!2sEl%C3%A9ctrica%20Dos%20Hermanos!5e0!3m2!1ses-419!2smx!4v1789776361181!5m2!1ses-419!2smx",
  },
  {
    id: "csl",
    name: "Cabo San Lucas",
    city: "Cabo San Lucas, B.C.S.",
    address: "C. Adolfo López Mateos 2517, El Arenal, 23460 Cabo San Lucas, B.C.S.",
    phones: ["(624) 143-78-51", "(624) 143-78-52"],
    email: "administracion.csl@electricadoshermanos.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.338044348545!2d-109.91919020321043!3d22.900899100000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86af4af5fa04c497%3A0xfb48b5f8b1354f42!2sEl%C3%A9ctrica%202%20Hermanos!5e0!3m2!1ses-419!2smx!4v1789776419452!5m2!1ses-419!2smx",
  },
];

export function mapsDirHref(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
