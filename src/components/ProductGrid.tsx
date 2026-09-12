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
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (!productos.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-lg font-semibold text-navy">No hay piezas con ese criterio</p>
        <p className="mt-2 text-sm text-neutral-500">
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
