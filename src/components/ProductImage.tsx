import { useEffect, useState } from "react";
import { placeholderProducto } from "@/lib/api";
import { PRODUCT_SHEET } from "@/lib/brand";
import { esImagenDebil, imagenLocalDe } from "@/lib/imagenes-locales";
import type { Producto } from "@/types";

type Props = {
  producto: Pick<Producto, "nombre" | "categoria" | "urlImagen">;
  className?: string;
  sprite?: boolean;
  pos?: string;
};

export function ProductImage({ producto, className = "", sprite = false, pos }: Props) {
  const fallback = placeholderProducto(producto);
  const local = imagenLocalDe(producto.nombre, producto.categoria);
  const principal = esImagenDebil(producto.urlImagen) ? local : producto.urlImagen;
  const [src, setSrc] = useState(principal || fallback);

  useEffect(() => {
    setSrc(principal || fallback);
  }, [fallback, principal]);

  if (!principal && sprite && pos) {
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
        if (local && src !== local) setSrc(local);
        else if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
