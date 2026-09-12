import { neon, neonConfig } from "@neondatabase/serverless";
import { AppError } from "./lib/errors";

const NEON_HOST_TECISTOCK = "ep-silent-hat";
const NEON_HOSTS_AJENOS = ["ep-bitter-moon"];
const NEON_FETCH_TIMEOUT_MS = 12_000;

export type Sql = {
  <T = Record<string, unknown>[]>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>;
  query(query: string, params?: unknown[]): Promise<Record<string, unknown>[]>;
  unsafe(query: string): Promise<Record<string, unknown>[]>;
};

function hostnameDeDatabaseUrl(databaseUrl: string): string {
  return new URL(databaseUrl).hostname.toLowerCase();
}

export function assertDatabaseUrl(databaseUrl: string): void {
  if (!databaseUrl.trim()) {
    throw new AppError(503, "DATABASE_URL no está configurada.", "DB_NOT_CONFIGURED");
  }
  let host = "";
  try {
    host = hostnameDeDatabaseUrl(databaseUrl);
  } catch {
    throw new AppError(503, "DATABASE_URL no es una URL válida.", "DB_URL_INVALID");
  }
  if (NEON_HOSTS_AJENOS.some((frag) => host.includes(frag))) {
    throw new AppError(503, "DATABASE_URL apunta a un proyecto Neon ajeno.", "DB_WRONG_PROJECT");
  }
  if (!host.includes(NEON_HOST_TECISTOCK)) {
    throw new AppError(503, "DATABASE_URL no apunta al Neon de Eléctrica Dos Hermanos.", "DB_WRONG_PROJECT");
  }
}

neonConfig.fetchFunction = (input: string | URL | Request, init?: RequestInit) =>
  fetch(input, {
    ...init,
    cache: "no-store",
    signal: init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(NEON_FETCH_TIMEOUT_MS)])
      : AbortSignal.timeout(NEON_FETCH_TIMEOUT_MS),
  });

export function createSql(databaseUrl: string): Sql {
  assertDatabaseUrl(databaseUrl);
  const httpSql = neon(databaseUrl);
  const nativeQuery = httpSql.query.bind(httpSql);
  const sql = httpSql as unknown as Sql;
  const asRows = (result: unknown): Record<string, unknown>[] => {
    if (Array.isArray(result)) return result as Record<string, unknown>[];
    if (result && typeof result === "object" && Array.isArray((result as { rows?: unknown }).rows)) {
      return (result as { rows: Record<string, unknown>[] }).rows;
    }
    return [];
  };
  sql.query = async (query: string, params?: unknown[]) => asRows(await nativeQuery(query, params ?? []));
  sql.unsafe = async (query: string) => asRows(await nativeQuery(query));
  return sql;
}

export function toJsonbParam(value: unknown): string {
  try {
    return JSON.stringify(value ?? []) ?? "[]";
  } catch {
    return "[]";
  }
}
