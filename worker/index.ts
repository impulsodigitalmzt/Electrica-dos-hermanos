import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { isAppError } from "./lib/errors";
import { assistantRoutes } from "./routes/assistant";
import { catalogRoutes } from "./routes/catalog";

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) =>
  c.json({
    status: "healthy",
    service: c.env.APP_NAME || "Eléctrica Dos Hermanos",
    runtime: "cloudflare-workers",
  })
);

app.route("/api/catalogo", catalogRoutes);
app.route("/api/asistente", assistantRoutes);

app.notFound((c) => c.json({ ok: false, detail: "Recurso no encontrado." }, 404));

app.onError((err, c) => {
  if (isAppError(err)) {
    return c.json({ ok: false, detail: err.message, code: err.code }, err.status as ContentfulStatusCode);
  }
  console.error(
    JSON.stringify({
      event: "unhandled_error",
      message: err instanceof Error ? err.message : String(err),
      path: c.req.path,
    })
  );
  return c.json({ ok: false, detail: "No se pudo completar la operación.", code: "INTERNAL_ERROR" }, 500);
});

export default app;
