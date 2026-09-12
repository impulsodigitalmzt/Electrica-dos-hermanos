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
