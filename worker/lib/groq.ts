import { AppError } from "./errors";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";
const DEFAULT_VISION_MODEL = "qwen/qwen3.8-27b";

export function claveApiGroq(env: Env): string {
  return String(env.GROQ_API_KEY ?? "").trim();
}

export function modeloGroq(env: Env): string {
  return String(env.GROQ_MODEL ?? "").trim() || DEFAULT_MODEL;
}

export function modeloVisionGroq(env: Env): string {
  return String(env.GROQ_VISION_MODEL ?? "").trim() || DEFAULT_VISION_MODEL;
}

function limpiarConsultaVision(texto: string): string {
  return texto
    .replace(/<think>[\s\S]*?<\/think>/gi, " ")
    .replace(/<\/?think>/gi, " ")
    .replace(/["“”'`.;:!?¡¿]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join(" ")
    .slice(0, 120);
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

function textoDeMensajeVision(message: {
  content?: unknown;
  reasoning?: unknown;
} | undefined): string {
  if (!message) return "";
  const parts: string[] = [];
  const content = message.content;
  if (typeof content === "string") parts.push(content);
  else if (Array.isArray(content)) {
    for (const part of content) {
      if (typeof part === "string") parts.push(part);
      else if (part && typeof part === "object" && "text" in part) parts.push(String((part as { text?: string }).text ?? ""));
    }
  }
  if (typeof message.reasoning === "string") parts.push(message.reasoning);
  return parts.join(" ").trim();
}

export async function groqVisionQuery(env: Env, imageDataUrl: string): Promise<string> {
  if (!claveApiGroq(env)) {
    throw new AppError(503, "GROQ_API_KEY no está configurada.", "GROQ_NOT_CONFIGURED");
  }
  const model = modeloVisionGroq(env);
  const body: Record<string, unknown> = {
    model,
    temperature: 0.2,
    max_completion_tokens: 256,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Qué material eléctrico aparece en esta foto. Contesta solo con palabras clave cortas en español, por ejemplo: contacto duplex blanco. Máximo 8 palabras.",
          },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ],
      },
    ],
  };
  const res = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${claveApiGroq(env)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) {
    const detalle = (await res.text()).replace(/\s+/g, " ").slice(0, 180);
    throw new AppError(502, `No se pudo leer la foto: ${detalle || res.status}`, "GROQ_VISION_ERROR");
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: unknown; reasoning?: unknown } }[];
  };
  const crudo = textoDeMensajeVision(data.choices?.[0]?.message);
  const json = parseJsonObject(crudo);
  const desdeJson = limpiarConsultaVision(String(json.q ?? json.query ?? json.keywords ?? ""));
  const texto = desdeJson || limpiarConsultaVision(crudo);
  if (!texto) {
    throw new AppError(502, "No reconocí el material de la foto.", "GROQ_VISION_EMPTY");
  }
  return texto;
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
