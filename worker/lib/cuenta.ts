import type { LineaCuenta, PaqueteBom } from "../types";
import { plano } from "./texto";

export function fusionarLineas(prev: LineaCuenta[], extra: LineaCuenta[]): LineaCuenta[] {
  const out: LineaCuenta[] = [];
  const indice = new Map<string, number>();
  const meter = (item: LineaCuenta) => {
    const sku = item.sku.trim();
    if (!sku || !item.nombre.trim()) return;
    const clave = `${item.paqueteId ?? "suelta"}:${sku.toLowerCase()}`;
    const cantidad = Math.max(1, Math.min(999, Math.trunc(item.cantidad) || 1));
    const i = indice.get(clave);
    if (i == null) {
      indice.set(clave, out.length);
      out.push({ ...item, sku, cantidad });
      return;
    }
    const actual = out[i];
    if (!actual) return;
    actual.cantidad = Math.min(999, actual.cantidad + cantidad);
    if (!actual.urlImagen && item.urlImagen) actual.urlImagen = item.urlImagen;
  };
  for (const item of prev) meter(item);
  for (const item of extra) meter(item);
  return out.slice(0, 40);
}

export function reemplazarPaquete(prev: LineaCuenta[], paquete: PaqueteBom): LineaCuenta[] {
  const kept = prev.filter((linea) => linea.paqueteId !== paquete.id && linea.origen !== "paquete");
  const nuevas: LineaCuenta[] = paquete.lineas.map((linea) => ({
    sku: linea.sku,
    nombre: linea.nombre,
    cantidad: linea.cantidad,
    precio: linea.precio,
    urlImagen: linea.urlImagen || undefined,
    origen: "paquete" as const,
    paqueteId: paquete.id,
    paqueteTitulo: paquete.titulo,
    grupo: linea.grupo,
  }));
  return fusionarLineas(kept, nuevas);
}

export function esNegociacion(texto: string): boolean {
  const t = plano(texto);
  return (
    /\b(demasiado|es mucho|muy (grande|largo|caro)|solo ocupo|nomas ocupo|por metro|cambia(?:me|lo|r)?|quita(?:me)?|recalcula|ajusta)\b/.test(t) ||
    Boolean(/\bpero\b/.test(t) && /\b(rollo|cable|metros?|calibre|paquete|cantidad)\b/.test(t))
  );
}

export function pideCerrar(texto: string): boolean {
  const t = plano(texto);
  if (!t || /\?/.test(texto) || esNegociacion(texto)) return false;
  if (/^(eso|listo|ya|nada mas|nomas)\s*[.!]?\s*$/.test(t)) return true;
  return /\b(es todo|eso es todo|con esto cerramos|ya no( quiero)? nada|cerramos|asi quedamos|solo eso)\b/.test(t);
}

export function cantidadDesdeConsulta(texto: string): number {
  const t = plano(texto)
    .replace(/\b\d{2,4}\s*v(olts?)?\b/g, " ")
    .replace(/\bcalibre\s+\d+\b/g, " ");
  const pal: Record<string, number> = {
    un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  };
  const num = t.match(/\b(\d{1,2})\s*(pza|piezas|unidades|rollos?)?\b/);
  if (num) {
    const n = Number.parseInt(num[1] ?? "", 10);
    if (n >= 1 && n <= 48) return n;
  }
  for (const [palabra, valor] of Object.entries(pal)) {
    if (new RegExp(`\\b${palabra}\\b`).test(t)) return valor;
  }
  return 1;
}

export function totalPedido(lineas: LineaCuenta[]): number {
  return lineas.reduce((acc, linea) => acc + linea.precio * linea.cantidad, 0);
}
