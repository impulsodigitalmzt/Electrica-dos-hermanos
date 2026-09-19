export const WHATSAPP_URL = "https://wa.me/526699407077";
export const MAIN_EMAIL = "cotizaciones.mzt@electricadoshermanos.com";
export const ENVIO_GRATIS_DESDE = 1000;
export const LOGO_SRC = "/logo.png";
export const HERO_HOME = "/brand/lumi-hero-home.jpg";
export const HERO_INDUSTRIAL = "/brand/lumi-hero-industrial.jpg";
export const HERO_PROMO = "/brand/lumi-hero-septiembre.jpg";
export const HERO_ILUMINACION = "/brand/lumi-hero-iluminacion.png";
export const HERO_CONTACTOS = "/brand/lumi-hero-contactos.jpg";
export const PRODUCT_SHEET = "/brand/lumi-products-sheet.jpg";

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
  { label: "Lámparas de techo", q: "lampara", pos: "0% 0%" },
  { label: "Focos LED", q: "foco led", pos: "50% 0%" },
  { label: "Empotrados", q: "downlight empotrado", pos: "100% 0%" },
  { label: "Arbotantes", q: "arbotante", pos: "0% 50%" },
  { label: "Reflectores", q: "reflector", pos: "50% 50%" },
  { label: "Tiras LED", q: "tira led", pos: "100% 50%" },
] as const;

export const COLLECTION_CARDS = [
  { label: "Iluminación", to: "/iluminacion", image: HERO_ILUMINACION },
  { label: "Contactos Residenciales", to: "/buscar?q=contacto", image: HERO_CONTACTOS },
  { label: "Placas e Interruptores", to: "/buscar?q=apagador+placa+interruptor", image: "/demo/placa.svg" },
  { label: "Tubería", to: "/buscar?q=tubo+pvc+conduit", image: "/demo/tubo.svg" },
  { label: "Conductores", to: "/buscar?q=cable+thw", image: "/demo/cable.svg" },
  { label: "Ofertas", to: "/buscar", image: HERO_PROMO },
] as const;

export const MARCAS = ["TECNOLITE", "SIEMENS", "bticino", "PHILIPS", "VOLTECK", "MAGG", "CONDULAC"] as const;

const MARCAS_DETECT = ["TECNOLITE", "PHILIPS", "SIEMENS", "BTICINO", "VOLTECK", "MAGG", "CONDULAC", "LEDVANCE", "IUSA"];

export function marcaDe(nombre: string, marca?: string): string {
  if (marca?.trim()) return marca.trim();
  const upper = nombre.toUpperCase();
  return MARCAS_DETECT.find((item) => upper.includes(item)) ?? "E2H";
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
