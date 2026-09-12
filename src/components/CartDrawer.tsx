import { useCart } from "../context/CartContext";
import { placeholderProducto } from "../lib/api";
import { precioMx } from "../lib/format";
import { IconClose } from "../lib/icons";

export function CartDrawer() {
  const { abierto, setAbierto, lineas, cambiarCantidad, quitar, vaciar, piezas, total } = useCart();
  const paquetes = new Map<string, string>();
  for (const linea of lineas) {
    if (linea.paqueteId && linea.paqueteTitulo) paquetes.set(linea.paqueteId, linea.paqueteTitulo);
  }
  const sueltas = lineas.filter((l) => !l.paqueteId);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground/40 transition ${abierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setAbierto(false)}
      />
      <aside
        aria-hidden={!abierto}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ${
          abierto ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Cuenta abierta</p>
            <h2 className="text-xl font-bold">Tu mostrador</h2>
            <p className="text-sm text-muted-foreground">
              {piezas} {piezas === 1 ? "pieza" : "piezas"} · se acumula todo el hilo
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar cuenta"
          >
            <IconClose />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {!lineas.length ? (
            <p className="rounded-md bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
              Aún no hay nada en la cuenta. Agrega piezas sueltas o un paquete de proyecto.
            </p>
          ) : null}

          {[...paquetes.entries()].map(([id, titulo]) => (
            <section key={id} className="rounded-md border border-border p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Paquete · {titulo}</p>
              {lineas
                .filter((l) => l.paqueteId === id)
                .map((linea) => (
                  <LineaKey key={`${id}-${linea.sku}`} linea={linea} onQty={cambiarCantidad} onRemove={quitar} />
                ))}
            </section>
          ))}

          {sueltas.length ? (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Piezas sueltas</p>
              {sueltas.map((linea) => (
                <LineaKey key={`suelta-${linea.sku}`} linea={linea} onQty={cambiarCantidad} onRemove={quitar} />
              ))}
            </section>
          ) : null}
        </div>

        <footer className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total de la cuenta</span>
            <span className="text-2xl font-bold">{precioMx(total)}</span>
          </div>
          <a
            href={`https://wa.me/526699407077?text=${encodeURIComponent(
              `Hola, quiero continuar este pedido de Eléctrica Dos Hermanos (${piezas} piezas, ${precioMx(total)}).`
            )}`}
            className="block w-full rounded-md bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-navy-soft"
          >
            Continuar pedido
          </a>
          {lineas.length ? (
            <button type="button" onClick={vaciar} className="w-full text-xs text-muted-foreground underline">
              Vaciar cuenta
            </button>
          ) : null}
        </footer>
      </aside>
    </>
  );
}

function LineaKey({
  linea,
  onQty,
  onRemove,
}: {
  linea: {
    sku: string;
    nombre: string;
    cantidad: number;
    precio: number;
    urlImagen?: string;
    paqueteId?: string;
    categoria?: string;
  };
  onQty: (sku: string, paqueteId: string | undefined, cantidad: number) => void;
  onRemove: (sku: string, paqueteId?: string) => void;
}) {
  return (
    <div className="mb-3 flex gap-3">
      <img
        src={linea.urlImagen || placeholderProducto({ nombre: linea.nombre, categoria: "pieza" })}
        alt=""
        className="h-16 w-16 rounded-md border border-border object-contain p-1"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{linea.nombre}</p>
        <p className="text-xs text-muted-foreground">
          {linea.sku} · {precioMx(linea.precio)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="h-7 w-7 rounded-md border border-border"
            onClick={() => onQty(linea.sku, linea.paqueteId, linea.cantidad - 1)}
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold">{linea.cantidad}</span>
          <button
            type="button"
            className="h-7 w-7 rounded-md border border-border"
            onClick={() => onQty(linea.sku, linea.paqueteId, linea.cantidad + 1)}
          >
            +
          </button>
          <button type="button" className="ml-auto text-xs text-accent" onClick={() => onRemove(linea.sku, linea.paqueteId)}>
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
}
