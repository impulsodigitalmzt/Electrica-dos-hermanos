export function plano(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function entero(value: unknown): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export function decimal(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Number.parseFloat(String(value ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function mexicanizar(texto: string): string {
  if (!texto) return texto;
  return texto
    .replace(/\bdoble ganga\b/gi, "apagador doble")
    .replace(/\b(\d+)\s*gangas\b/gi, "$1 módulos")
    .replace(/\bganga\b/gi, "módulo")
    .replace(/\brocker\b/gi, "tecla")
    .replace(/\b3-ways?\b/gi, "apagador de escalera")
    .replace(/\boutlets?\b/gi, "contacto");
}

export const RELLENO = new Set([
  "a", "al", "de", "del", "el", "la", "los", "las", "un", "una", "unos", "unas",
  "me", "te", "le", "lo", "se", "ya", "hay", "tiene", "tienen", "tienes",
  "tenemos", "tengo", "traen", "trae", "manejan", "venden", "vende", "busco",
  "necesito", "quiero", "quisiera", "por", "favor", "hola", "buenas", "buen",
  "dia", "tarde", "noche", "si", "o", "y", "que", "como", "cual", "este",
  "esta", "esto", "para", "con", "en", "mas", "pieza", "producto", "articulo",
]);

export function tokensBusqueda(texto: string): string[] {
  return plano(texto)
    .replace(/[^a-z0-9./]+/g, " ")
    .split(" ")
    .filter((t) => t.length >= 2 && !RELLENO.has(t))
    .slice(0, 8);
}
