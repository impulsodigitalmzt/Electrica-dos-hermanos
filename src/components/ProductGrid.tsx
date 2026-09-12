import type { Producto } from "../types";
import { ProductCard } from "./ProductCard";

type Props = {
  productos: Producto[];
  cargando: boolean;
  onAdd: (producto: Producto) => void;
};

export function ProductGrid({ productos, cargando, onAdd }: Props) {
  if (cargando) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (!productos.length) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-lg font-semibold">No hay piezas con ese criterio</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Prueba con el nombre de mostrador, el SKU o descríbele el trabajo al asistente.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.sku} producto={producto} onAdd={onAdd} />
      ))}
    </div>
  );
}
