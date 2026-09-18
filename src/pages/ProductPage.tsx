import { useEffect, useState } from "react";
import { Minus, PackageCheck, Plus, ShoppingCart } from "lucide-react";
import { Header } from "@/components/Header";
import { CompactFooter } from "@/components/HomeSections";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo, fetchProducto } from "@/lib/api";
import { descuentoDe, marcaDe } from "@/lib/brand";
import { DEMO_PRODUCTOS } from "@/lib/demo-productos";
import { encontrarProductoLocal } from "@/lib/catalogo-iluminacion";
import { etiquetaCategoria, precioMx } from "@/lib/format";
import { AppLink } from "@/lib/nav";
import type { Producto } from "@/types";

export function ProductPage({ sku }: { sku: string }) {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState("");
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let vivo = true;
    setError("");
    setProducto(null);
    setCantidad(1);
    void fetchProducto(sku)
      .then((item) => {
        if (vivo) setProducto(item);
      })
      .catch(() => {
        const demo =
          DEMO_PRODUCTOS.find((item) => item.sku.toLowerCase() === sku.toLowerCase()) ??
          encontrarProductoLocal(sku) ??
          null;
        if (vivo) {
          setProducto(demo);
          if (!demo) setError("No encontramos esa pieza.");
        }
      });
    return () => {
      vivo = false;
    };
  }, [sku]);

  useEffect(() => {
    if (!producto) return;
    const q = producto.nombre.split(/\s+/).slice(0, 3).join(" ");
    void fetchCatalogo({ q, categoria: producto.categoria, limit: 8 })
      .then((data) => setRelacionados(data.productos.filter((item) => item.sku !== producto.sku).slice(0, 4)))
      .catch(() =>
        setRelacionados(DEMO_PRODUCTOS.filter((item) => item.sku !== producto.sku && item.categoria === producto.categoria).slice(0, 4))
      );
  }, [producto]);

  const descuento = producto ? descuentoDe(producto.precio, producto.precioAnterior) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header query={query} onQueryChange={setQuery} variant="inner" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <nav aria-label="Ruta de navegación" className="text-xs font-semibold text-muted-foreground">
          <AppLink to="/" className="hover:text-primary">
            Inicio
          </AppLink>
          <span className="px-1">/</span>
          <AppLink to="/buscar" className="hover:text-primary">
            Catálogo
          </AppLink>
          {producto ? (
            <>
              <span className="px-1">/</span>
              <span className="text-primary">{etiquetaCategoria(producto.categoria)}</span>
            </>
          ) : null}
        </nav>

        {error ? (
          <div className="py-24 text-center">
            <h1 className="text-3xl font-extrabold text-primary">{error}</h1>
            <Button className="mt-6" asChild>
              <AppLink to="/buscar">Volver al catálogo</AppLink>
            </Button>
          </div>
        ) : !producto ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse bg-muted" />
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse bg-muted" />
              <div className="h-10 w-3/4 animate-pulse bg-muted" />
              <div className="h-24 animate-pulse bg-muted" />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div className="relative overflow-hidden border bg-background">
                <ProductImage producto={producto} className="aspect-square w-full object-contain p-8" />
                {descuento > 0 ? (
                  <span className="absolute left-4 top-4 bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">-{descuento}%</span>
                ) : null}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold uppercase text-accent">{marcaDe(producto.nombre, producto.marca)}</span>
                <h1 className="mt-2 text-3xl font-extrabold leading-tight text-primary sm:text-4xl">{producto.nombre}</h1>
                <p className="mt-2 text-sm text-muted-foreground">Código {producto.sku}</p>
                <div className="mt-6 flex flex-wrap items-baseline gap-3">
                  <b className="font-display text-4xl text-primary">{precioMx(producto.precio)}</b>
                  {producto.precioAnterior ? (
                    <span className="text-sm text-muted-foreground line-through">{precioMx(producto.precioAnterior)}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Precio unitario · IVA incluido</p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {producto.descripcion || "Producto original con garantía de fabricante. Disponibilidad inmediata en sucursal."}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-success">
                  <PackageCheck className="size-5" />
                  {producto.stock > 0 ? `Disponible para envío · ${producto.stock} pza` : "Consulta existencia con un asesor"}
                </div>
                {producto.ubicacion ? <p className="mt-2 text-xs text-muted-foreground">Ubicación: {producto.ubicacion}</p> : null}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex h-11 items-center border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10"
                      onClick={() => setCantidad((n) => Math.max(1, n - 1))}
                      aria-label="Reducir cantidad"
                    >
                      <Minus />
                    </Button>
                    <span className="w-10 text-center font-semibold">{cantidad}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10"
                      onClick={() => setCantidad((n) => Math.min(99, n + 1))}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button className="h-11 min-w-48 font-bold" onClick={() => agregarProducto(producto, cantidad)}>
                    <ShoppingCart /> Añadir al carrito
                  </Button>
                </div>
              </div>
            </div>

            {relacionados.length ? (
              <section className="mt-16">
                <span className="text-xs font-bold uppercase text-accent">También te puede servir</span>
                <h2 className="mt-2 text-2xl font-extrabold text-primary">Relacionados</h2>
                <div className="mt-6">
                  <ProductGrid productos={relacionados} cargando={false} onAdd={agregarProducto} />
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>
      <CompactFooter />
    </div>
  );
}
