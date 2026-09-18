import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { descuentoDe, marcaDe } from "@/lib/brand";
import { precioMx } from "@/lib/format";
import { navigate } from "@/lib/nav";
import type { Producto } from "@/types";

type Props = {
  producto: Producto;
  onAdd: (producto: Producto) => void;
  onQuick?: (producto: Producto) => void;
  favorite?: boolean;
  onFavorite?: (sku: string) => void;
};

export function ProductCard({ producto, onAdd, onQuick, favorite, onFavorite }: Props) {
  const descuento = descuentoDe(producto.precio, producto.precioAnterior);
  const marca = marcaDe(producto.nombre, producto.marca);

  return (
    <article className="group relative flex flex-col border bg-card">
      <div className="relative aspect-square overflow-hidden bg-background">
        <button type="button" className="block h-full w-full" onClick={() => navigate(`/producto/${encodeURIComponent(producto.sku)}`)}>
          <ProductImage
            producto={producto}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
        {descuento > 0 ? (
          <span className="absolute left-3 top-3 bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">-{descuento}%</span>
        ) : null}
        {onFavorite ? (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 top-3 bg-background"
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            onClick={() => onFavorite(producto.sku)}
          >
            <Heart className={favorite ? "fill-sale text-sale" : ""} />
          </Button>
        ) : null}
        {onQuick ? (
          <Button
            variant="secondary"
            className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 shadow-lg sm:flex lg:opacity-0 lg:group-hover:opacity-100"
            onClick={() => onQuick(producto)}
          >
            <Eye /> Vista rápida
          </Button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <span className="text-[11px] font-bold text-accent">{marca}</span>
        <h3 className="mt-1 min-h-10 text-sm font-semibold leading-snug sm:text-base">
          <button type="button" className="text-left" onClick={() => navigate(`/producto/${encodeURIComponent(producto.sku)}`)}>
            {producto.nombre}
          </button>
        </h3>
        {producto.temperatura || producto.watts || producto.uso ? (
          <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold uppercase text-muted-foreground">
            {producto.temperatura ? <span className="border px-1.5 py-0.5">{producto.temperatura}</span> : null}
            {producto.watts ? <span className="border px-1.5 py-0.5">{producto.watts}W</span> : null}
            {producto.uso ? <span className="border px-1.5 py-0.5">{producto.uso}</span> : null}
          </div>
        ) : null}
        {producto.rating ? (
          <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-secondary text-secondary" /> {producto.rating.toFixed(1)}
          </span>
        ) : null}
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <b className="font-display text-lg text-primary sm:text-xl">{precioMx(producto.precio)}</b>
          {producto.precioAnterior ? (
            <span className="text-xs text-muted-foreground line-through">{precioMx(producto.precioAnterior)}</span>
          ) : null}
        </div>
        <span className="mt-1 text-[11px] text-muted-foreground">Precio unitario · IVA incluido</span>
        <Button className="mt-4 w-full font-bold" onClick={() => onAdd(producto)}>
          <ShoppingCart /> Añadir
        </Button>
      </div>
    </article>
  );
}
