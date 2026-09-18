import { useEffect, useState } from "react";
import { placeholderProducto } from "@/lib/api";
import { PRODUCT_SHEET } from "@/lib/brand";
import type { Producto } from "@/types";

type Props = {
  producto: Pick<Producto, "nombre" | "categoria" | "urlImagen">;
  className?: string;
  sprite?: boolean;
  pos?: string;
};

export function ProductImage({ producto, className = "", sprite = false, pos }: Props) {
  const fallback = placeholderProducto(producto);
  const [src, setSrc] = useState(producto.urlImagen || fallback);

  useEffect(() => {
    setSrc(producto.urlImagen || fallback);
  }, [fallback, producto.urlImagen]);

  if (!producto.urlImagen && sprite && pos) {
    return (
      <div
        role="img"
        aria-label={producto.nombre}
        className={`bg-no-repeat ${className}`}
        style={{ backgroundImage: `url(${PRODUCT_SHEET})`, backgroundSize: "300% 300%", backgroundPosition: pos }}
      />
    );
  }

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
