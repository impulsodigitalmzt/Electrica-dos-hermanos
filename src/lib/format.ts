export function precioMx(valor: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(valor);
}

export function etiquetaCategoria(categoria: string): string {
  const mapa: Record<string, string> = {
    electricidad: "Electricidad",
    ferreteria: "Ferretería",
    plomeria: "Plomería",
    herramientas: "Herramientas",
    otro: "Más materiales",
    iluminacion: "Iluminación",
    contactos: "Contactos Residenciales",
    placas: "Placas e Interruptores",
    conductores: "Conductores",
  };
  return mapa[categoria.toLowerCase()] ?? categoria;
}

export const NAV_CATEGORIAS = [
  { id: "iluminacion", label: "Iluminación", q: "foco led lampara" },
  { id: "contactos", label: "Contactos Residenciales", q: "contacto" },
  { id: "placas", label: "Placas e Interruptores", q: "apagador placa interruptor" },
  { id: "tuberia", label: "Tubería", q: "tubo pvc conduit" },
  { id: "conductores", label: "Conductores", q: "cable thw" },
  { id: "marcas", label: "Marcas", href: "#marcas" },
  { id: "ofertas", label: "Ofertas", href: "#catalogo" },
] as const;

export const ESPACIOS = [
  {
    id: "techo",
    label: "Lámparas de techo",
    q: "lampara",
    imagen:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "focos",
    label: "Focos LED",
    q: "foco led",
    imagen:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "empotrados",
    label: "Empotrados",
    q: "lampara foco",
    imagen:
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "arbotantes",
    label: "Arbotantes",
    q: "apagador placa",
    imagen:
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "reflectores",
    label: "Reflectores",
    q: "cable",
    imagen:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=70",
  },
  {
    id: "tiras",
    label: "Tiras LED",
    q: "foco",
    imagen:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=70",
  },
] as const;

export const MARCAS = ["TECNOLITE", "SIEMENS", "bticino", "PHILIPS", "VOLTECK", "MAGG", "CONDULAC"] as const;

export const SUCURSALES = [
  {
    id: "matriz",
    ciudad: "Mazatlán, Sin.",
    titulo: "Mazatlán · Francisco Villa (Matriz)",
    direccion: "División Norte 1900, Col. Francisco Villa, CP 82127, Mazatlán, Sin.",
    tels: ["(669) 940-70-77", "(669) 940-70-88"],
    email: "cotizaciones.mzt@electricadoshermanos.com",
  },
  {
    id: "valle",
    ciudad: "Mazatlán, Sin.",
    titulo: "Mazatlán · Valle del Ejido",
    direccion: "Av. Óscar Pérez Escobosa 2600, Col. Ampliación Valle del Ejido, CP 82134, Mazatlán, Sin.",
    tels: ["(669) 917-00-11", "(669) 917-00-12"],
    email: "administracion.valle@electricadoshermanos.com",
  },
  {
    id: "pacifico",
    ciudad: "Mazatlán, Sin.",
    titulo: "Mazatlán · Real Pacífico",
    direccion: "Sucursal Real Pacífico, Mazatlán, Sin.",
    tels: ["(669) 940-70-77"],
    email: "cotizaciones.mzt@electricadoshermanos.com",
  },
  {
    id: "culiacan",
    ciudad: "Culiacán, Sin.",
    titulo: "Culiacán",
    direccion: "Blvd. Lola Beltrán 4396, Ejido Humaya, CP 80058, Culiacán, Sin.",
    tels: ["(667) 723-32-71", "(667) 723-31-68"],
    email: "administracion.cln@electricadoshermanos.com",
  },
  {
    id: "sjc",
    ciudad: "San José del Cabo, B.C.S.",
    titulo: "San José del Cabo",
    direccion: "Carretera Transpeninsular vado Santa Rosa s/n, Santa Rosa, CP 23400, San José del Cabo, B.C.S.",
    tels: ["(624) 120-14-99", "(624) 120-13-99"],
    email: "administracion.sjc@electricadoshermanos.com",
  },
  {
    id: "csl",
    ciudad: "Cabo San Lucas, B.C.S.",
    titulo: "Cabo San Lucas",
    direccion: "C. Adolfo López Mateos, El Arenal, CP 23460, Cabo San Lucas, B.C.S.",
    tels: ["(624) 143-78-51", "(624) 143-78-52"],
    email: "administracion.csl@electricadoshermanos.com",
  },
] as const;

export function sessionId(): string {
  const key = "edh-session";
  const actual = localStorage.getItem(key);
  if (actual) return actual;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}
