import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LineaCuenta, PaqueteBom, Producto } from "../types";

const STORAGE_KEY = "edh-cuenta-abierta";

type CartContextValue = {
  lineas: LineaCuenta[];
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  agregarProducto: (producto: Producto, cantidad?: number, opciones?: { abrir?: boolean }) => void;
  agregarPaquete: (paquete: PaqueteBom) => void;
  cambiarCantidad: (sku: string, paqueteId: string | undefined, cantidad: number) => void;
  quitar: (sku: string, paqueteId?: string) => void;
  vaciar: () => void;
  sincronizar: (pedido: LineaCuenta[]) => void;
  piezas: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function clave(linea: Pick<LineaCuenta, "sku" | "paqueteId">): string {
  return `${linea.paqueteId ?? "suelta"}:${linea.sku.toLowerCase()}`;
}

function leerStorage(): LineaCuenta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as LineaCuenta[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<LineaCuenta[]>(() => leerStorage());
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineas));
  }, [lineas]);

  const value = useMemo<CartContextValue>(() => {
    const piezas = lineas.reduce((acc, l) => acc + l.cantidad, 0);
    const total = lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
    return {
      lineas,
      abierto,
      setAbierto,
      agregarProducto: (producto, cantidad = 1, opciones) => {
        setLineas((prev) => {
          const extra: LineaCuenta = {
            sku: producto.sku,
            nombre: producto.nombre,
            cantidad: Math.max(1, cantidad),
            precio: producto.precio,
            urlImagen: producto.urlImagen || undefined,
            origen: "catalogo",
          };
          const idx = prev.findIndex((l) => clave(l) === clave(extra));
          if (idx < 0) return [...prev, extra];
          return prev.map((l, i) => (i === idx ? { ...l, cantidad: Math.min(999, l.cantidad + extra.cantidad) } : l));
        });
        if (opciones?.abrir !== false) setAbierto(true);
      },
      agregarPaquete: (paquete) => {
        setLineas((prev) => {
          const kept = prev.filter((l) => l.paqueteId !== paquete.id && l.origen !== "paquete");
          const nuevas: LineaCuenta[] = paquete.lineas.map((linea) => ({
            sku: linea.sku,
            nombre: linea.nombre,
            cantidad: linea.cantidad,
            precio: linea.precio,
            urlImagen: linea.urlImagen || undefined,
            origen: "paquete",
            paqueteId: paquete.id,
            paqueteTitulo: paquete.titulo,
            grupo: linea.grupo,
          }));
          return [...kept, ...nuevas];
        });
        setAbierto(true);
      },
      cambiarCantidad: (sku, paqueteId, cantidad) => {
        const n = Math.min(999, Math.max(0, Math.floor(Number(cantidad) || 0)));
        setLineas((prev) =>
          prev
            .map((l) => (l.sku === sku && l.paqueteId === paqueteId ? { ...l, cantidad: n } : l))
            .filter((l) => l.cantidad > 0)
        );
      },
      quitar: (sku, paqueteId) => {
        setLineas((prev) => prev.filter((l) => !(l.sku === sku && l.paqueteId === paqueteId)));
      },
      vaciar: () => setLineas([]),
      sincronizar: (pedido) => setLineas(pedido),
      piezas,
      total,
    };
  }, [abierto, lineas]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
