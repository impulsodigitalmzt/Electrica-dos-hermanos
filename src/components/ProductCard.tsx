import { useState } from "react";
import { placeholderProducto } from "../lib/api";
import { etiquetaCategoria, precioMx } from "../lib/format";
import type { Producto } from "../types";

type Props = {
  producto: Producto;
  onAdd: (producto: Producto) => void;
};

export function ProductCard({ producto, onAdd }: Props) {
  const agotado = producto.stock <= 0;
  const fallback = placeholderProducto(producto);
  const [src, setSrc] = useState(producto.urlImagen || fallback);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(16,32,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,32,51,0.08)]">
      <div className="relative aspect-square overflow-hidden bg-sand">
        <img
          src={src}
          alt={producto.nombre}
          className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={() => setSrc(fallback)}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy">
          {etiquetaCategoria(producto.categoria)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-blue">{producto.sku}</p>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-navy">{producto.nombre}</h3>
          {producto.descripcion ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500">{producto.descripcion}</p>
          ) : null}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-navy">{precioMx(producto.precio)}</p>
            <p className={`text-xs font-medium ${agotado ? "text-orange" : "text-emerald-700"}`}>
              {agotado ? "Agotado" : `En existencia (${producto.stock})`}
            </p>
          </div>
          <button
            type="button"
            disabled={agotado}
            onClick={() => onAdd(producto)}
            className="rounded-full bg-orange px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-orange-hot disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
