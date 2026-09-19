function foto(path: string): string {
  return encodeURI(path);
}

export const FOTO = {
  foco: foto("/demo/foco.jpg"),
  downlight: foto("/demo/downlight.jpg"),
  colgante: foto("/demo/lampara colgante.jpg"),
  lampara: foto("/demo/lampara.jpg"),
  lamparaPie: foto("/demo/lampara niz.jpg"),
  lamparasMesa: foto("/demo/images (1).jpg"),
  lamparaPiso: foto("/demo/images.jpg"),
  arbotante: foto("/demo/arbotante.jpg"),
  arbotante2: foto("/demo/arbotante II.jpg"),
  arbotante3: foto("/demo/arbotante III.jpg"),
  reflector: foto("/demo/reflector.jpg"),
  tira: foto("/demo/tira-led.jpg"),
  emergencia: foto("/demo/lampara de emergancia.jpg"),
  emergencia2: foto("/demo/lampara de emergancia i.jpg"),
  contacto: foto("/demo/contacto duplex.png"),
  placaPlata: foto("/demo/1 apagador plata.jpg"),
  tresApagadores: foto("/demo/3 apagadores.jpg"),
  apagadorContacto: foto("/demo/apagador 1 contacto.png"),
  dobleApagador: foto("/demo/doble apagador.jpg"),
  cableNegro: foto("/demo/cable-negro.JPG"),
  cables: foto("/demo/cables.JPG"),
  tubo: foto("/demo/tubo.jpg"),
  timbre: foto("/demo/timbre plata.jpg"),
  promoTira: foto("/productos/promocion/465732141_9065803090125985_4322128941655574743_n.jpg"),
  promoPlafones: foto("/productos/promocion/480803278_1112951620629872_27433666322856304_n.jpg"),
  promoLineal: foto("/productos/promocion/480831954_1112951537296547_953551635700852146_n.jpg"),
  promoSolar: foto("/productos/promocion/481101059_1112951223963245_5515214858787212966_n.jpg"),
  promoEspiral: foto("/productos/promocion/481102483_1112951443963223_894009272852193027_n.jpg"),
  promoSpot: foto("/productos/promocion/482244484_1126648815926819_2677906875062650258_n.jpg"),
  promoOferta: foto("/productos/promocion/483100014_1124103099514724_2181633230517873023_n.jpg"),
  promoQuinzi: foto("/productos/promocion/socket.jpg"),
} as const;

function plano(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function imagenLocalDe(nombre: string, categoria = ""): string {
  const t = plano(`${nombre} ${categoria}`);
  if (/\b(apagador|interruptor).*(contacto)|contacto.*apagador/.test(t)) return FOTO.apagadorContacto;
  if (/\b(3 apagador|triple|tres apagador)\b/.test(t)) return FOTO.tresApagadores;
  if (/\b(timbre)\b/.test(t)) return FOTO.timbre;
  if (/\b(contacto|tomacorriente|duplex|enchufe)\b/.test(t)) return FOTO.contacto;
  if (/\b(apagador|interruptor|placa)\b/.test(t)) {
    if (/\b(plata|acero|inox|negro|quinzi)\b/.test(t)) return FOTO.placaPlata;
    return FOTO.dobleApagador;
  }
  if (/\b(tira).*(rgb)|rgb/.test(t)) return FOTO.promoTira;
  if (/\b(tira led|tira de led)\b/.test(t)) return FOTO.tira;
  if (/\bsolar\b/.test(t)) return FOTO.promoSolar;
  if (/\breflector\b/.test(t)) return FOTO.reflector;
  if (/\b(arbotante|farol)\b/.test(t)) return /farol|clasic/.test(t) ? FOTO.arbotante3 : FOTO.arbotante;
  if (/\b(downlight|luna flat)\b/.test(t)) return FOTO.downlight;
  if (/\b(dirigible|yd360)\b/.test(t)) return FOTO.promoSpot;
  if (/\bempotrado\b/.test(t)) return FOTO.downlight;
  if (/\b(espiral|ahorrador)\b/.test(t)) return FOTO.promoEspiral;
  if (/\b(foco|essential)\b/.test(t)) return FOTO.foco;
  if (/\b(emergenc)\b/.test(t)) return FOTO.emergencia;
  if (/\b(de pie|piso)\b/.test(t)) return FOTO.lamparaPie;
  if (/\b(lineal|suspendido|hermetico)\b/.test(t)) return FOTO.promoLineal;
  if (/\b(plafon|ultra delgad)\b/.test(t)) return FOTO.promoPlafones;
  if (/\b(colgante|niza)\b/.test(t)) return FOTO.colgante;
  if (/\b(candil|lampara)\b/.test(t)) return FOTO.lamparasMesa;
  if (/\b(cable|thw|conductor)\b/.test(t)) return FOTO.cableNegro;
  if (/\b(tubo|conduit|pvc)\b/.test(t)) return FOTO.tubo;
  if (/\b(socket|portalamp|base e27)\b/.test(t)) return FOTO.foco;
  if (/\b(fotocelda|sensor)\b/.test(t)) return FOTO.reflector;
  if (/\b(extension)\b/.test(t)) return FOTO.cables;
  if (/\biluminacion\b/.test(t)) return FOTO.colgante;
  return "";
}

export function esImagenDebil(url?: string): boolean {
  if (!url) return true;
  return url.endsWith(".svg") || url.startsWith("data:");
}
