import { Hono } from "hono";
import { AppError } from "../lib/errors";
import { atenderMostrador } from "../lib/asistente";
import { cargarSesion, guardarSesion, sqlDesdeEnv } from "../lib/memory";
import type { LineaCuenta } from "../types";

type AppEnv = { Bindings: Env };

export const assistantRoutes = new Hono<AppEnv>();

assistantRoutes.post("/", async (c) => {
  if (!c.env.DATABASE_URL) throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  const body = (await c.req.json().catch(() => ({}))) as {
    sessionId?: string;
    mensaje?: string;
    pedido?: LineaCuenta[];
  };
  const mensaje = String(body.mensaje ?? "").trim();
  if (mensaje.length < 1) throw new AppError(400, "Escribe qué ocupas.", "EMPTY_MESSAGE");

  const sessionId = String(body.sessionId ?? "").trim() || crypto.randomUUID();
  const sql = sqlDesdeEnv(c.env);
  const sesion = await cargarSesion(sql, sessionId);
  const resultado = await atenderMostrador(sql, c.env, sesion, mensaje, body.pedido);
  await guardarSesion(sql, resultado.sesion);

  const ultimo = resultado.sesion.mensajes.at(-1)?.texto ?? "";
  return c.json({
    ok: true,
    sessionId: resultado.sesion.id,
    ruta: resultado.ruta,
    respuesta: ultimo,
    productos: resultado.productos,
    paquete: resultado.sesion.paquete,
    pedido: resultado.sesion.pedido,
    memoria: resultado.sesion.memoria,
  });
});
