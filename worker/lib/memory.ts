import { createSql, toJsonbParam, type Sql } from "../db";
import type { LineaCuenta, MensajeHilo, PaqueteBom, SesionMostrador } from "../types";

const MAX_MENSAJES = 20;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function mapSesion(row: Record<string, unknown>): SesionMostrador {
  const memoria = (row.memoria && typeof row.memoria === "object" ? row.memoria : {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? ""),
    mensajes: asArray<MensajeHilo>(row.mensajes),
    pedido: asArray<LineaCuenta>(row.pedido),
    paquete: (row.paquete as PaqueteBom | null) ?? null,
    memoria: {
      mencionados: asArray<string>(memoria.mencionados),
      cierreSolicitado: Boolean(memoria.cierreSolicitado),
      negociacion: Boolean(memoria.negociacion),
    },
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function ensureSesionesSchema(sql: Sql): Promise<void> {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS sesiones_tienda (
      id TEXT PRIMARY KEY,
      mensajes JSONB NOT NULL DEFAULT '[]'::jsonb,
      pedido JSONB NOT NULL DEFAULT '[]'::jsonb,
      paquete JSONB,
      memoria JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export function nuevaSesion(id: string): SesionMostrador {
  return {
    id,
    mensajes: [],
    pedido: [],
    paquete: null,
    memoria: { mencionados: [], cierreSolicitado: false, negociacion: false },
    updatedAt: new Date().toISOString(),
  };
}

export async function cargarSesion(sql: Sql, id: string): Promise<SesionMostrador> {
  await ensureSesionesSchema(sql);
  const rows = await sql`SELECT id, mensajes, pedido, paquete, memoria, updated_at FROM sesiones_tienda WHERE id = ${id} LIMIT 1`;
  if (!rows[0]) return nuevaSesion(id);
  return mapSesion(rows[0] as Record<string, unknown>);
}

export async function guardarSesion(sql: Sql, sesion: SesionMostrador): Promise<void> {
  await ensureSesionesSchema(sql);
  const mensajes = toJsonbParam(sesion.mensajes.slice(-MAX_MENSAJES));
  const pedido = toJsonbParam(sesion.pedido);
  const paquete = sesion.paquete ? toJsonbParam(sesion.paquete) : null;
  const memoria = toJsonbParam(sesion.memoria);
  await sql`
    INSERT INTO sesiones_tienda (id, mensajes, pedido, paquete, memoria, updated_at)
    VALUES (${sesion.id}, ${mensajes}::jsonb, ${pedido}::jsonb, ${paquete}::jsonb, ${memoria}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET
      mensajes = EXCLUDED.mensajes,
      pedido = EXCLUDED.pedido,
      paquete = EXCLUDED.paquete,
      memoria = EXCLUDED.memoria,
      updated_at = NOW()
  `;
}

export function anexarMensajes(sesion: SesionMostrador, user: string, assistant: string): void {
  const extra: MensajeHilo[] = [
    { rol: "user", texto: user },
    { rol: "assistant", texto: assistant },
  ];
  sesion.mensajes = [...sesion.mensajes, ...extra].slice(-MAX_MENSAJES);
}

export function recordarProductos(sesion: SesionMostrador, nombres: string[]): void {
  const set = new Set(sesion.memoria.mencionados);
  for (const nombre of nombres) {
    const limpio = nombre.trim();
    if (limpio) set.add(limpio);
  }
  sesion.memoria.mencionados = [...set].slice(-24);
}

export function sqlDesdeEnv(env: Env): Sql {
  return createSql(env.DATABASE_URL);
}
