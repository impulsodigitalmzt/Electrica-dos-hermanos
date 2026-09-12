import { useState } from "react";
import { placeholderProducto } from "../lib/api";
import { precioMx } from "../lib/format";
import type { Producto } from "../types";

type Props = {
  producto: Producto;
  onAdd: (producto: Producto) => void;
};

export function ProductCard({ producto, onAdd }: Props) {
  const fallback = placeholderProducto(producto);
  const [src, setSrc] = useState(producto.urlImagen || fallback);
  const descuento =
    producto.precioAnterior && producto.precioAnterior > producto.precio
      ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={src}
          alt={producto.nombre}
          className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.04]"
          onError={() => setSrc(fallback)}
        />
        {descuento > 0 ? (
          <span className="absolute left-3 top-3 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            −{descuento} %
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-sm bg-card/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            Vista rápida
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {producto.marca || "E2H"}
        </p>
        <h3 className="line-clamp-2 min-h-11 text-[15px] font-semibold leading-snug">{producto.nombre}</h3>
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-bold text-foreground">{precioMx(producto.precio)}</p>
            {producto.precioAnterior ? (
              <p className="text-sm text-muted-foreground line-through">{precioMx(producto.precioAnterior)}</p>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Precio unitario · IVA incluido</p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(producto)}
          className="mt-1 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:bg-navy-soft"
        >
          Añadir
        </button>
      </div>
    </article>
  );
}
