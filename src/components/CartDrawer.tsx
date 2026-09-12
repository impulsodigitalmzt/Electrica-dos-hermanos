import { useCart } from "../context/CartContext";
import { placeholderProducto } from "../lib/api";
import { precioMx } from "../lib/format";
import { IconClose } from "../lib/icons";

const ENVIO_GRATIS_DESDE = 2500;

export function CartDrawer() {
  const { abierto, setAbierto, lineas, cambiarCantidad, quitar, vaciar, piezas, total } = useCart();
  const progresoEnvio = Math.min(100, Math.round((total / ENVIO_GRATIS_DESDE) * 100));
  const faltaEnvio = Math.max(0, ENVIO_GRATIS_DESDE - total);

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
            <h2 className="text-xl font-bold">Tu carrito ({piezas})</h2>
            <p className="text-sm text-muted-foreground">
              {piezas === 0 ? "Aún no hay productos" : `${piezas} ${piezas === 1 ? "artículo" : "artículos"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar carrito"
          >
            <IconClose />
          </button>
        </header>

        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-primary">
            {faltaEnvio === 0 ? "¡Tu envío es gratis!" : `Te faltan ${precioMx(faltaEnvio)} para envío gratis`}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progresoEnvio}%` }} />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {!lineas.length ? (
            <p className="rounded-md bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
              Agrega productos destacados para armar tu pedido de demostración.
            </p>
          ) : null}
          {lineas.map((linea) => (
            <LineaKey key={`${linea.paqueteId ?? "suelta"}-${linea.sku}`} linea={linea} onQty={cambiarCantidad} onRemove={quitar} />
          ))}
        </div>

        <footer className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="text-2xl font-bold">{precioMx(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">Impuestos incluidos. Envío al finalizar.</p>
          <button
            type="button"
            disabled={!lineas.length}
            className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            onClick={() => {
              window.open(
                `https://wa.me/526699407077?text=${encodeURIComponent(
                  `Hola, quiero finalizar este pedido de Eléctrica Dos Hermanos (${piezas} piezas, ${precioMx(total)}).`
                )}`,
                "_blank"
              );
            }}
          >
            Finalizar compra
          </button>
          {lineas.length ? (
            <button type="button" onClick={vaciar} className="w-full text-xs text-muted-foreground underline">
              Vaciar carrito
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
  };
  onQty: (sku: string, paqueteId: string | undefined, cantidad: number) => void;
  onRemove: (sku: string, paqueteId?: string) => void;
}) {
  return (
    <div className="flex gap-3">
      <img
        src={linea.urlImagen || placeholderProducto({ nombre: linea.nombre, categoria: "pieza" })}
        alt=""
        className="h-16 w-16 rounded-md border border-border bg-muted object-contain p-1"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{linea.nombre}</p>
        <p className="text-sm font-bold">{precioMx(linea.precio)}</p>
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
