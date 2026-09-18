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

export async function fetchProducto(sku: string): Promise<Producto> {
  const res = await fetch(`/api/catalogo/${encodeURIComponent(sku)}`);
  if (!res.ok) throw new Error("Producto no encontrado.");
  const data = (await res.json()) as { producto?: Producto };
  if (!data.producto) throw new Error("Producto no encontrado.");
  return data.producto;
}

export async function fetchCategorias(): Promise<{ categoria: string; total: number }[]> {
  const res = await fetch("/api/catalogo/categorias");
  if (!res.ok) return [];
  const data = (await res.json()) as { categorias?: { categoria: string; total: number }[] };
  return data.categorias ?? [];
}

export async function buscarPorImagen(image: string): Promise<CatalogoResponse & { q: string }> {
  const res = await fetch("/api/catalogo/imagen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(body.detail || "No se pudo leer la foto.");
  }
  return (await res.json()) as CatalogoResponse & { q: string };
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="#f1f3f7" width="400" height="400"/><text x="50%" y="48%" text-anchor="middle" font-size="92" font-family="Barlow, sans-serif" fill="#1d4ed8">${letra}</text><text x="50%" y="68%" text-anchor="middle" font-size="18" font-family="Barlow, sans-serif" fill="#1e293b">${producto.categoria}</text></svg>`
  )}`;
}

export async function compactarImagen(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 768;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la foto.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}
