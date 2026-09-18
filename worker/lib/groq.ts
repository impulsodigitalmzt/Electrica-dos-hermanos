import { AppError } from "./errors";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export function claveApiGroq(env: Env): string {
  return String(env.GROQ_API_KEY ?? "").trim();
}

export function modeloGroq(env: Env): string {
  return String(env.GROQ_MODEL ?? "").trim() || DEFAULT_MODEL;
}

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function groqChat(
  env: Env,
  messages: GroqMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  if (!claveApiGroq(env)) {
    throw new AppError(503, "GROQ_API_KEY no está configurada.", "GROQ_NOT_CONFIGURED");
  }
  const model = modeloGroq(env);
  const body: Record<string, unknown> = {
    model,
    temperature: options?.temperature ?? 0.2,
    max_completion_tokens: Math.min(Math.max(options?.maxTokens ?? 512, 128), 1024),
    messages,
    stream: false,
  };
  if (/gpt-oss/i.test(model)) {
    body.reasoning_effort = "low";
    body.include_reasoning = false;
  }
  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${claveApiGroq(env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const detalle = (await res.text()).replace(/\s+/g, " ").slice(0, 180);
    throw new AppError(502, `Groq no respondió: ${detalle || res.status}`, "GROQ_ERROR");
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return String(data.choices?.[0]?.message?.content ?? "").trim();
}

export async function groqVisionQuery(env: Env, imageDataUrl: string): Promise<string> {
  if (!claveApiGroq(env)) {
    throw new AppError(503, "GROQ_API_KEY no está configurada.", "GROQ_NOT_CONFIGURED");
  }
  const model = "meta-llama/llama-4-scout-17b-16e-instruct";
  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${claveApiGroq(env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_completion_tokens: 80,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Eres mostrador de material eléctrico en México. Mira la foto y responde SOLO 3 a 8 palabras clave para buscar el producto en el catálogo (ejemplo: contacto duplex blanco, foco led 9w, tubo conduit pvc). Sin oraciones ni puntuación extra.",
            },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const detalle = (await res.text()).replace(/\s+/g, " ").slice(0, 180);
    throw new AppError(502, `No se pudo leer la foto: ${detalle || res.status}`, "GROQ_VISION_ERROR");
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const texto = String(data.choices?.[0]?.message?.content ?? "")
    .replace(/[".]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!texto) throw new AppError(502, "No reconocí el material de la foto.", "GROQ_VISION_EMPTY");
  return texto.slice(0, 120);
}

export function parseJsonObject(texto: string): Record<string, unknown> {
  const limpio = texto.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const inicio = limpio.indexOf("{");
  const fin = limpio.lastIndexOf("}");
  if (inicio < 0 || fin <= inicio) return {};
  try {
    const parsed = JSON.parse(limpio.slice(inicio, fin + 1)) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
