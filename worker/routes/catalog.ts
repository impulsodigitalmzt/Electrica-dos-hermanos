import { Hono } from "hono";
import { createSql } from "../db";
import { AppError } from "../lib/errors";
import { buscarProductos, listarCategorias, obtenerProducto } from "../lib/catalog";
import { groqVisionQuery } from "../lib/groq";

type AppEnv = { Bindings: Env };

export const catalogRoutes = new Hono<AppEnv>();

catalogRoutes.get("/", async (c) => {
  if (!c.env.DATABASE_URL) throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  const q = String(c.req.query("q") ?? "").trim();
  const categoria = String(c.req.query("categoria") ?? "").trim();
  const page = Math.max(Number.parseInt(String(c.req.query("page") ?? "1"), 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(String(c.req.query("limit") ?? "24"), 10) || 24, 1), 60);
  const sql = createSql(c.env.DATABASE_URL);
  const { productos, total } = await buscarProductos(sql, {
    q,
    categoria,
    limit,
    offset: (page - 1) * limit,
  });
  return c.json({
    ok: true,
    q,
    categoria,
    page,
    limit,
    total,
    productos,
  });
});

catalogRoutes.post("/imagen", async (c) => {
  if (!c.env.DATABASE_URL) throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  const body = (await c.req.json().catch(() => ({}))) as { image?: string };
  const image = String(body.image ?? "").trim();
  if (!image.startsWith("data:image/")) {
    throw new AppError(400, "Sube una foto del material.", "BAD_IMAGE");
  }
  if (image.length > 1_400_000) {
    throw new AppError(400, "La foto es demasiado pesada. Prueba con otra más cercana.", "IMAGE_TOO_LARGE");
  }
  const q = await groqVisionQuery(c.env, image);
  const sql = createSql(c.env.DATABASE_URL);
  const { productos, total } = await buscarProductos(sql, { q, limit: 16, offset: 0 });
  return c.json({ ok: true, q, total, productos });
});

catalogRoutes.get("/categorias", async (c) => {
  if (!c.env.DATABASE_URL) throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  const sql = createSql(c.env.DATABASE_URL);
  const categorias = await listarCategorias(sql);
  return c.json({ ok: true, categorias });
});

catalogRoutes.get("/:sku", async (c) => {
  if (!c.env.DATABASE_URL) throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  const sql = createSql(c.env.DATABASE_URL);
  const producto = await obtenerProducto(sql, c.req.param("sku"));
  if (!producto) throw new AppError(404, "Producto no encontrado.", "NOT_FOUND");
  return c.json({ ok: true, producto });
});
