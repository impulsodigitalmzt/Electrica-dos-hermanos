export const WHATSAPP_URL = "https://wa.me/526699407077";
export const MAIN_EMAIL = "cotizaciones.mzt@electricadoshermanos.com";
export const ENVIO_GRATIS_DESDE = 1000;
export const LOGO_SRC = "/logo.png";
export const HERO_HOME = "/brand/lumi-hero-home.jpg";
export const HERO_INDUSTRIAL = "/brand/lumi-hero-industrial.jpg";
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
};

export const BRANCHES: Branch[] = [
  {
    id: "mzt-villa",
    name: "Mazatlán · Francisco Villa (Matriz)",
    city: "Mazatlán, Sin.",
    address: "División Norte 1900, Col. Francisco Villa, CP 82127, Mazatlán, Sin.",
    phones: ["(669) 940-70-77", "(669) 940-70-88"],
    email: "cotizaciones.mzt@electricadoshermanos.com",
  },
  {
    id: "mzt-valle",
    name: "Mazatlán · Valle del Ejido",
    city: "Mazatlán, Sin.",
    address: "Av. Óscar Pérez Escobosa 2600, Col. Ampliación Valle del Ejido, CP 82134, Mazatlán, Sin.",
    phones: ["(669) 917-00-11", "(669) 917-00-12"],
    email: "administracion.valle@electricadoshermanos.com",
  },
  {
    id: "mzt-real",
    name: "Mazatlán · Real Pacífico",
    city: "Mazatlán, Sin.",
    address: "Óscar Pérez Escobosa #6079, Real Pacífico, CP 82124, Mazatlán, Sin.",
    phones: ["(669) 442-0708"],
    email: "administracion.atl@electricadoshermanos.com",
  },
  {
    id: "culiacan",
    name: "Culiacán",
    city: "Culiacán, Sin.",
    address: "Blvd. Lola Beltrán 4396, Ejido Humaya, CP 80058, Culiacán, Sin.",
    phones: ["(667) 723-32-71", "(667) 723-31-68"],
    email: "administracion.cln@electricadoshermanos.com",
  },
  {
    id: "sjc",
    name: "San José del Cabo",
    city: "San José del Cabo, BCS",
    address: "Carr. Transpeninsular vado Santa Rosa s/n, Santa Rosa, CP 23400, San José del Cabo, BCS.",
    phones: ["(624) 120-14-99", "(624) 120-13-99"],
    email: "administracion.sjc@electricadoshermanos.com",
  },
  {
    id: "csl",
    name: "Cabo San Lucas",
    city: "Cabo San Lucas, BCS",
    address: "C. Adolfo López Mateos, El Arenal, CP 23460, Cabo San Lucas, BCS.",
    phones: ["(624) 143-78-51", "(624) 143-78-52"],
    email: "administracion.csl@electricadoshermanos.com",
  },
];
