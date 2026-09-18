import { useEffect, useState } from "react";
import { placeholderProducto } from "@/lib/api";
import type { Producto } from "@/types";

type Props = {
  producto: Pick<Producto, "nombre" | "categoria" | "urlImagen">;
  className?: string;
  sprite?: boolean;
  pos?: string;
};

export function ProductImage({ producto, className = "" }: Props) {
  const fallback = placeholderProducto(producto);
  const [src, setSrc] = useState(producto.urlImagen || fallback);

  useEffect(() => {
    setSrc(producto.urlImagen || fallback);
  }, [fallback, producto.urlImagen]);

  return (
    <img
      src={src}
      alt={producto.nombre}
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
