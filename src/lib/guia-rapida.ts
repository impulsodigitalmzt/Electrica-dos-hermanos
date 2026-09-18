export type GuiaCatalogo = {
  id: string;
  tema: string;
  titulo: string;
  descripcion: string;
  mensajeWhatsapp: string;
  preguntas: { pregunta: string; respuesta: string }[];
};

function plano(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

const GUIAS: Record<string, GuiaCatalogo> = {
  iluminacion: {
    id: "iluminacion",
    tema: "iluminación",
    titulo: "¿Cómo elegir tu iluminación?",
    descripcion:
      "Nuestro equipo técnico te ayuda a calcular potencia, temperatura de color y cantidad de luminarios por espacio.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir iluminación (potencia, temperatura de color y cantidad de luminarios).",
    preguntas: [
      {
        pregunta: "¿Qué temperatura de color me conviene?",
        respuesta:
          "La luz cálida (3000K) es ideal para recámaras y salas; la neutra (4000K) para cocinas y oficinas; la fría (6500K) para talleres, bodegas y exteriores.",
      },
      {
        pregunta: "¿Cuántos watts necesito por espacio?",
        respuesta:
          "Como referencia, 20 W LED por cada 10 m² en interiores generales y 50 W o más en exteriores amplios. Te ayudamos con el cálculo exacto.",
      },
      {
        pregunta: "¿Qué significa el grado IP?",
        respuesta:
          "Indica la resistencia al polvo y al agua. Para exteriores recomendamos IP65 o superior; para jardín y albercas, IP67.",
      },
      {
        pregunta: "¿Los luminarios tienen garantía?",
        respuesta:
          "Sí, todos los productos cuentan con garantía directa de fabricante; el plazo varía entre 1 y 5 años según la marca.",
      },
    ],
  },
  contactos: {
    id: "contactos",
    tema: "contactos residenciales",
    titulo: "¿Cómo elegir tus contactos residenciales?",
    descripcion:
      "Te orientamos para elegir amperaje, polo a tierra y tipo de caja según el uso de cada espacio en casa o negocio.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir contactos residenciales (amperaje, tierra física y tipo de instalación).",
    preguntas: [
      {
        pregunta: "¿Qué diferencia hay entre un contacto sencillo y uno dúplex?",
        respuesta:
          "El sencillo tiene una sola salida; el dúplex (el más común en casa) tiene dos. Para barras de cocina, estudios o talleres conviene un dúplex o un contacto doble con tierra.",
      },
      {
        pregunta: "¿Qué amperaje debo usar en casa?",
        respuesta:
          "En circuitos generales se usan contactos de 15 A. Para aires, hornos o herramientas pesadas se recomienda 20 A y cable del calibre adecuado.",
      },
      {
        pregunta: "¿Necesito contactos con tierra física?",
        respuesta:
          "Sí. La tierra física reduce el riesgo de descarga. En baños, cocina y exteriores combina tierra con protección GFCI cuando la instalación lo permita.",
      },
      {
        pregunta: "¿Los contactos tienen garantía?",
        respuesta:
          "Sí. Las líneas residenciales que manejamos incluyen garantía de fabricante. Conserva tu ticket o factura para el seguimiento.",
      },
    ],
  },
  placas: {
    id: "placas",
    tema: "placas e interruptores",
    titulo: "¿Cómo elegir placas e interruptores?",
    descripcion:
      "Te ayudamos a combinar módulos, color, número de vías y tipo de montaje para que la placa coincida con apagadores y contactos.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir placas e interruptores (módulos, vías y compatibilidad de línea).",
    preguntas: [
      {
        pregunta: "¿Qué es un módulo y cuántos necesito?",
        respuesta:
          "Cada apagador, dimmer o contacto ocupa uno o más módulos. Una placa de 1, 2 o 3 módulos debe coincidir con la composición que vas a instalar.",
      },
      {
        pregunta: "¿Interruptor sencillo o de 3 vías?",
        respuesta:
          "El sencillo controla un punto de luz desde un solo lugar. El de 3 vías (escalera) permite encender y apagar desde dos puntos, por ejemplo pasillo y recámara.",
      },
      {
        pregunta: "¿Puedo mezclar marcas en la misma placa?",
        respuesta:
          "Lo recomendable es usar la misma línea (Livinglight, Alpha, etc.) para que el marco, el mecanismo y el color encajen. Si tienes duda, envíanos foto de lo instalado.",
      },
      {
        pregunta: "¿Las placas e interruptores tienen garantía?",
        respuesta:
          "Sí, cuentan con garantía de fabricante. Evita forzar mecanismos y usa la caja de empotrar del tamaño indicado.",
      },
    ],
  },
  tuberia: {
    id: "tuberia",
    tema: "tubería y conduit",
    titulo: "¿Cómo elegir tubería y conduit?",
    descripcion:
      "Te indicamos el tipo de tubo, cédula y accesorios según si la instalación va empotrada, aparente o a la intemperie.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir tubería y conduit (tipo, cédula e instalación).",
    preguntas: [
      {
        pregunta: "¿PVC, poliducto o conduit metálico?",
        respuesta:
          "El PVC liviano es común en residencial empotrado. El poliducto sirve para recorridos cortos. El conduit metálico se usa en aparente, industrial o donde se pide mayor protección mecánica.",
      },
      {
        pregunta: "¿Qué cédula o diámetro debo pedir?",
        respuesta:
          "Depende del calibre y la cantidad de conductores. Un exceso de cables en un tubo pequeño sobrecalienta el circuito; te ayudamos a dimensionarlo.",
      },
      {
        pregunta: "¿Qué tubo sirve para exterior?",
        respuesta:
          "Usa conduit para intemperie, uniones selladas y prensaestopas. El PVC común de interior no es la mejor opción a sol y lluvia.",
      },
      {
        pregunta: "¿La tubería tiene garantía?",
        respuesta:
          "Sí. Los tubos y accesorios de línea cuentan con garantía de fabricante. Conserva el comprobante de compra.",
      },
    ],
  },
  conductores: {
    id: "conductores",
    tema: "conductores eléctricos",
    titulo: "¿Cómo elegir tus conductores?",
    descripcion:
      "Te orientamos en calibre, tipo de aislamiento y color según la carga, la distancia y la norma de tu instalación.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir conductores (calibre, aislamiento y aplicación).",
    preguntas: [
      {
        pregunta: "¿Qué calibre de cable necesito?",
        respuesta:
          "El calibre depende de la carga y la longitud del circuito. En residencial es común 12 AWG para contactos y 10 AWG o mayor para cargas altas. Confírmalo con la carga en amperes.",
      },
      {
        pregunta: "¿THW, THHW o THHN?",
        respuesta:
          "THW y THHW son habituales en instalaciones fijas en México. THHN/THWN se usa mucho en conduit. La letra extra indica resistencia a humedad o temperatura; te indicamos el adecuado al tablero.",
      },
      {
        pregunta: "¿Para qué sirve el color del aislamiento?",
        respuesta:
          "Identifica la función: negro o rojo en fases, blanco o azul en neutro (según norma y marca) y verde o desnudo en tierra. No mezcles funciones en un mismo color.",
      },
      {
        pregunta: "¿Los cables tienen garantía?",
        respuesta:
          "Sí, las marcas que manejamos ofrecen garantía de fabricante. Evita dobleces bruscos y respeta el radio de curvatura al instalar.",
      },
    ],
  },
  catalogo: {
    id: "catalogo",
    tema: "material eléctrico",
    titulo: "¿Cómo elegir el material correcto?",
    descripcion:
      "Nuestro equipo técnico te ayuda a armar la lista de materiales según tu proyecto: iluminación, contactos, placas, tubería o conductores.",
    mensajeWhatsapp: "Hola, necesito asesoría para elegir material eléctrico para mi proyecto.",
    preguntas: [
      {
        pregunta: "¿Por dónde empiezo si no soy electricista?",
        respuesta:
          "Describe el espacio (casa, local o obra), lo que quieres instalar y si ya hay tablero. Con eso te armamos una lista de materiales y cantidades.",
      },
      {
        pregunta: "¿Puedo recoger en sucursal?",
        respuesta:
          "Sí. Puedes recoger en Matriz Mazatlán y en el resto de sucursales. El material de piso suele estar listo en unas horas; el de pedido se confirma al cotizar.",
      },
      {
        pregunta: "¿Hacen envíos a todo México?",
        respuesta:
          "Sí. El envío se calcula al pagar. En compras mayores a $1,000 MXN aplican condiciones de envío gratis según peso, volumen y destino.",
      },
      {
        pregunta: "¿Los productos tienen garantía?",
        respuesta:
          "Sí. Todo el catálogo cuenta con garantía de fabricante. El plazo depende de cada marca; conserva tu factura o ticket.",
      },
    ],
  },
};

export function guiaDeCatalogo(opts: { iluminacion?: boolean; q?: string; categoria?: string }): GuiaCatalogo {
  if (opts.iluminacion) return GUIAS.iluminacion;
  const t = plano(`${opts.categoria ?? ""} ${opts.q ?? ""}`);
  if (/\b(iluminacion|foco|lampara|luminario|plafon|candil|tira led|reflector|arbotante|downlight)\b/.test(t)) {
    return GUIAS.iluminacion;
  }
  if (/\b(contacto|tomacorriente)\b/.test(t)) return GUIAS.contactos;
  if (/\b(placa|apagador|interruptor|dimmer)\b/.test(t)) return GUIAS.placas;
  if (/\b(tubo|tuberia|pvc|conduit|poliducto)\b/.test(t)) return GUIAS.tuberia;
  if (/\b(cable|conductor|thw|thhn|thhw|awg)\b/.test(t)) return GUIAS.conductores;
  return GUIAS.catalogo;
}
