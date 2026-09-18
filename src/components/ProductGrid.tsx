import { ProductCard } from "@/components/ProductCard";
import type { Producto } from "@/types";

type Props = {
  productos: Producto[];
  cargando: boolean;
  onAdd: (producto: Producto) => void;
  onQuick?: (producto: Producto) => void;
  favorites?: string[];
  onFavorite?: (sku: string) => void;
  columns?: "home" | "search";
};

export function ProductGrid({
  productos,
  cargando,
  onAdd,
  onQuick,
  favorites = [],
  onFavorite,
  columns = "home",
}: Props) {
  const grid = columns === "search" ? "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5" : "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5";

  if (cargando) {
    return (
      <div className={grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (!productos.length) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed py-24 text-center">
        <h2 className="text-xl font-bold text-primary">Sin resultados</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Ajusta la búsqueda o descríbele el trabajo al mostrador para encontrar la pieza.
        </p>
      </div>
    );
  }

  return (
    <div className={grid}>
      {productos.map((producto) => (
        <ProductCard
          key={producto.sku}
          producto={producto}
          onAdd={onAdd}
          onQuick={onQuick}
          favorite={favorites.includes(producto.sku)}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}
