import type { CatalogoResponse, LineaCuenta, Producto, RespuestaAsistente } from "../types";

export async function fetchCatalogo(params: {
  q?: string;
  categoria?: string;
  page?: number;
  limit?: number;
}): Promise<CatalogoResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.categoria) search.set("categoria", params.categoria);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const res = await fetch(`/api/catalogo?${search.toString()}`);
  if (!res.ok) throw new Error("No se pudo cargar el catálogo.");
  return (await res.json()) as CatalogoResponse;
}

export async function fetchCategorias(): Promise<{ categoria: string; total: number }[]> {
  const res = await fetch("/api/catalogo/categorias");
  if (!res.ok) return [];
  const data = (await res.json()) as { categorias?: { categoria: string; total: number }[] };
  return data.categorias ?? [];
}

export async function preguntarAsistente(
  mensaje: string,
  sessionId: string,
  pedido?: LineaCuenta[]
): Promise<RespuestaAsistente> {
  const res = await fetch("/api/asistente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, mensaje, pedido }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(body.detail || "El mostrador no pudo responder.");
  }
  return (await res.json()) as RespuestaAsistente;
}

export function placeholderProducto(producto: Pick<Producto, "nombre" | "categoria">): string {
  const letra = (producto.nombre[0] ?? "E").toUpperCase();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="#f3efe8" width="400" height="400"/><text x="50%" y="48%" text-anchor="middle" font-size="92" font-family="DM Sans, sans-serif" fill="#1a4fb8">${letra}</text><text x="50%" y="68%" text-anchor="middle" font-size="18" font-family="DM Sans, sans-serif" fill="#102033">${producto.categoria}</text></svg>`
  )}`;
}
