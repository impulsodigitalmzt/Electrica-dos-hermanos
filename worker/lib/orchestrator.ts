import { plano } from "./texto";
import { claveApiGroq, groqChat, parseJsonObject } from "./groq";
import { esNegociacion } from "./cuenta";

export type RutaIntencion = "producto" | "proyecto" | "cuenta";

export type Clasificacion = {
  ruta: RutaIntencion;
  certeza: "alta" | "baja";
  origen: "heuristica" | "llm";
};

const PROYECTO_RE =
  /\b(acometida|instalaci[oó]n|instalar|armar|armado|cableado|lista de materiales|lo necesario|todo lo (que ocupo|necesario)|para (hacer|montar|conectar|alimentar)|paquete (de|para)|hidroneum[aá]tic|cisterna|ba[nñ]o completo)\b/i;

const CUENTA_RE = /\b(pedido|carrito|cuenta|total|cuanto (va|sale)|que llevo|mi lista)\b/i;

export function clasificarHeuristica(texto: string): Clasificacion {
  const t = plano(texto);
  if (CUENTA_RE.test(t) && !PROYECTO_RE.test(t)) {
    return { ruta: "cuenta", certeza: "alta", origen: "heuristica" };
  }
  if (PROYECTO_RE.test(t)) {
    const palabras = t.split(" ").filter(Boolean).length;
    return { ruta: "proyecto", certeza: palabras >= 4 ? "alta" : "baja", origen: "heuristica" };
  }
  return { ruta: "producto", certeza: "alta", origen: "heuristica" };
}

export async function clasificarIntencion(texto: string, env: Env, tienePaquete: boolean): Promise<Clasificacion> {
  if (esNegociacion(texto) && tienePaquete) {
    return { ruta: "proyecto", certeza: "alta", origen: "heuristica" };
  }
  const heuristica = clasificarHeuristica(texto);
  if (heuristica.certeza === "alta" || !claveApiGroq(env)) return heuristica;
  try {
    const crudo = await groqChat(
      env,
      [
        {
          role: "system",
          content:
            'Eres el router invisible del mostrador de Eléctrica Dos Hermanos. Responde SOLO JSON: {"ruta":"producto"|"proyecto"|"cuenta"}. producto = un artículo concreto. proyecto = armado o lista de materiales. cuenta = total, carrito o cierre. Si dudas, producto.',
        },
        { role: "user", content: texto.slice(0, 400) },
      ],
      { temperature: 0, maxTokens: 80 }
    );
    const parsed = parseJsonObject(crudo);
    const ruta =
      parsed.ruta === "proyecto" || parsed.ruta === "cuenta" || parsed.ruta === "producto"
        ? parsed.ruta
        : heuristica.ruta;
    return { ruta, certeza: "alta", origen: "llm" };
  } catch {
    return heuristica;
  }
}
