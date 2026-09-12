import type { Sql } from "../db";
import type { Producto } from "../types";
import { decimal, entero, mexicanizar, tokensBusqueda } from "./texto";

export function mapProducto(row: Record<string, unknown>): Producto | null {
  const sku = String(row.sku ?? "").trim();
  const nombre = mexicanizar(String(row.nombre_pieza ?? row.nombre ?? "").trim());
  if (!sku || !nombre) return null;
  return {
    sku,
    nombre,
    categoria: String(row.categoria ?? "otro").trim() || "otro",
    precio: decimal(row.precio),
    stock: entero(row.stock_disponible ?? row.stock),
    descripcion: String(row.descripcion_tecnica ?? row.descripcion ?? "").trim(),
    urlImagen: String(row.url_imagen ?? "").trim(),
    ubicacion: String(row.ubicacion_tienda ?? "").trim(),
  };
}

const SELECT_BASE = `
  SELECT sku, nombre_pieza, categoria, stock_disponible, precio, ubicacion_tienda, url_imagen, descripcion_tecnica
  FROM inventario_local
`;

const NOMBRE_PLANO = `translate(lower(nombre_pieza), 'áàäéèëíìïóòöúùüñÁÀÄÉÈËÍÌÏÓÒÖÚÙÜÑ', 'aaaeeeiiiooouuunAAAEEEIIIOOOUUUN')`;
const DESC_PLANO = `translate(lower(coalesce(descripcion_tecnica, '')), 'áàäéèëíìïóòöúùüñÁÀÄÉÈËÍÌÏÓÒÖÚÙÜÑ', 'aaaeeeiiiooouuunAAAEEEIIIOOOUUUN')`;
const SKU_PLANO = `translate(lower(sku), 'áàäéèëíìïóòöúùüñÁÀÄÉÈËÍÌÏÓÒÖÚÙÜÑ', 'aaaeeeiiiooouuunAAAEEEIIIOOOUUUN')`;

export async function listarCategorias(sql: Sql): Promise<{ categoria: string; total: number }[]> {
  const rows = await sql`
    SELECT categoria, COUNT(*)::int AS total
    FROM inventario_local
    GROUP BY categoria
    ORDER BY categoria
  `;
  return rows
    .map((row) => ({
      categoria: String(row.categoria ?? "").trim(),
      total: entero(row.total),
    }))
    .filter((item) => item.categoria);
}

export async function obtenerProducto(sql: Sql, sku: string): Promise<Producto | null> {
  const codigo = sku.trim();
  if (!codigo) return null;
  const rows = await sql`
    SELECT sku, nombre_pieza, categoria, stock_disponible, precio, ubicacion_tienda, url_imagen, descripcion_tecnica
    FROM inventario_local
    WHERE sku = ${codigo}
    LIMIT 1
  `;
  return mapProducto((rows[0] ?? {}) as Record<string, unknown>);
}

export async function buscarProductos(
  sql: Sql,
  opciones: { q?: string; categoria?: string; limit?: number; offset?: number }
): Promise<{ productos: Producto[]; total: number }> {
  const limit = Math.min(Math.max(opciones.limit ?? 24, 1), 60);
  const offset = Math.max(opciones.offset ?? 0, 0);
  const categoria = opciones.categoria?.trim().toLowerCase() ?? "";
  const tokens = tokensBusqueda(opciones.q ?? "");

  if (!tokens.length && !categoria) {
    const countRows = await sql`SELECT COUNT(*)::int AS total FROM inventario_local`;
    const rows = await sql.query(`${SELECT_BASE} ORDER BY nombre_pieza LIMIT $1 OFFSET $2`, [limit, offset]);
    return {
      total: entero(countRows[0]?.total),
      productos: rows.map((row) => mapProducto(row)).filter((item): item is Producto => Boolean(item)),
    };
  }

  const likeParts = tokens.map((token) => `%${token}%`);
  const params: unknown[] = [];
  const where: string[] = [];

  if (categoria) {
    params.push(categoria);
    where.push(`lower(categoria) = $${params.length}`);
  }

  if (likeParts.length) {
    const grupos = likeParts.map((like) => {
      params.push(like);
      const i = params.length;
      return `(${NOMBRE_PLANO} ILIKE $${i} OR ${SKU_PLANO} ILIKE $${i} OR ${DESC_PLANO} ILIKE $${i})`;
    });
    where.push(`(${grupos.join(" AND ")})`);
  }

  const filtro = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const count = await sql.query(`SELECT COUNT(*)::int AS total FROM inventario_local ${filtro}`, params);
  params.push(limit, offset);
  const rows = await sql.query(
    `${SELECT_BASE} ${filtro} ORDER BY stock_disponible DESC NULLS LAST, nombre_pieza LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    total: entero(count[0]?.total),
    productos: rows.map((row) => mapProducto(row)).filter((item): item is Producto => Boolean(item)),
  };
}
