import { useEffect, useMemo, useState } from "react";
import { Lightbulb, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/Header";
import { CompactFooter } from "@/components/HomeSections";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo, fetchCategorias } from "@/lib/api";
import { HERO_HOME, marcaDe } from "@/lib/brand";
import { DEMO_PRODUCTOS, filtrarDemo } from "@/lib/demo-productos";
import { etiquetaCategoria, precioMx } from "@/lib/format";
import { AppLink, navigate } from "@/lib/nav";
import type { Producto } from "@/types";

const SORTERS = [
  { id: "relevancia", label: "Relevancia" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
] as const;

type Props = { q: string; categoria: string; iluminacion: boolean };

export function SearchPage({ q, categoria, iluminacion }: Props) {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState(q);
  const [categoriaActiva, setCategoriaActiva] = useState(categoria);
  const [categorias, setCategorias] = useState<{ categoria: string; total: number }[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [sort, setSort] = useState("relevancia");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<Producto | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [usandoDemo, setUsandoDemo] = useState(false);

  useEffect(() => {
    setQuery(q);
    setCategoriaActiva(categoria);
  }, [categoria, q]);

  useEffect(() => {
    void fetchCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCargando(true);
      void fetchCatalogo({ q, categoria, limit: 36 })
        .then((data) => {
          setProductos(data.productos);
          setTotal(data.total);
          setUsandoDemo(false);
        })
        .catch(() => {
          const demo = filtrarDemo(DEMO_PRODUCTOS, q, categoria);
          setProductos(demo);
          setTotal(demo.length);
          setUsandoDemo(true);
        })
        .finally(() => setCargando(false));
    }, 200);
    return () => window.clearTimeout(handle);
  }, [categoria, q]);

  const results = useMemo(() => {
    const filtrados = productos.filter((item) => item.precio <= maxPrice && (!onlyOffers || Boolean(item.precioAnterior)));
    const sorted = [...filtrados];
    if (sort === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
    if (sort === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    return sorted;
  }, [maxPrice, onlyOffers, productos, sort]);

  function aplicarCategoria(value: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (value) params.set("categoria", value);
    navigate(`${iluminacion ? "/iluminacion" : "/buscar"}${params.toString() ? `?${params}` : ""}`);
  }

  function resetFilters() {
    setMaxPrice(5000);
    setOnlyOffers(false);
    setSort("relevancia");
    navigate(iluminacion ? "/iluminacion" : "/buscar");
  }

  const filtersPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Categoría</h3>
        <div className="mt-3 flex flex-col">
          <button
            type="button"
            onClick={() => aplicarCategoria("")}
            className={`flex items-center justify-between border-b py-2.5 text-left text-sm font-semibold transition ${
              !categoriaActiva ? "text-accent" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Todas
            <span className="text-xs">{usandoDemo ? DEMO_PRODUCTOS.length : total}</span>
          </button>
          {categorias.map((item) => (
            <button
              key={item.categoria}
              type="button"
              onClick={() => aplicarCategoria(item.categoria)}
              className={`flex items-center justify-between border-b py-2.5 text-left text-sm font-semibold transition ${
                categoriaActiva === item.categoria ? "text-accent" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {etiquetaCategoria(item.categoria)}
              <span className="text-xs">{item.total}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Precio máximo</h3>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Precio máximo"
          className="mt-4 w-full accent-[oklch(0.68_0.2_48)]"
        />
        <p className="mt-2 text-sm font-bold text-primary">Hasta {precioMx(maxPrice)}</p>
      </div>
      <label className="flex cursor-pointer items-center gap-3 border-t pt-5 text-sm font-semibold text-primary">
        <input
          type="checkbox"
          checked={onlyOffers}
          onChange={(e) => setOnlyOffers(e.target.checked)}
          className="size-4 accent-[oklch(0.68_0.22_39)]"
        />
        Solo productos en oferta
      </label>
      <Button variant="outline" className="w-full border-primary text-primary" onClick={resetFilters}>
        <RotateCcw /> Limpiar filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        query={query}
        onQueryChange={setQuery}
        variant="inner"
        searchPath={iluminacion ? "/iluminacion" : "/buscar"}
        favorites={favorites.length}
      />
      <main>
        <section className="relative overflow-hidden bg-primary">
          <img src={HERO_HOME} alt="Interiores iluminados con luminarios LED" className="h-64 w-full object-cover sm:h-80" width={1600} height={640} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent" />
          <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6 text-primary-foreground sm:px-10">
            <nav aria-label="Ruta de navegación" className="text-xs font-semibold text-primary-foreground/75">
              <AppLink to="/" className="hover:text-secondary">
                Inicio
              </AppLink>{" "}
              <span className="px-1">/</span> {iluminacion ? "Iluminación" : "Búsqueda"}
            </nav>
            <h1 className="mt-3 flex items-center gap-3 text-4xl font-extrabold sm:text-5xl">
              <Lightbulb className="size-9 text-secondary" /> {iluminacion ? "Iluminación" : q ? `Resultados para “${q}”` : "Catálogo"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
              {iluminacion
                ? "Luminarios LED de marcas originales, con garantía de fabricante y asesoría técnica desde Mazatlán, Culiacán y Los Cabos."
                : "Busca por nombre, código o descríbele el trabajo al mostrador. También puedes usar voz o una foto."}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-32">{filtersPanel}</div>
          </aside>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <p className="text-sm text-muted-foreground">
                <b className="text-primary">{results.length}</b> productos encontrados
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal /> Filtros
                </Button>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Ordenar
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Ordenar productos"
                    className="h-10 border bg-background px-3 text-sm font-semibold text-primary outline-none focus:border-accent"
                  >
                    {SORTERS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <ProductGrid
              productos={results}
              cargando={cargando}
              columns="search"
              onAdd={agregarProducto}
              onQuick={setQuick}
              favorites={favorites}
              onFavorite={(sku) =>
                setFavorites((current) => (current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]))
              }
            />
          </div>
        </section>
      </main>
      <CompactFooter />

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="w-[88%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-left text-2xl text-primary">Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6 pb-10">{filtersPanel}</div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(quick)} onOpenChange={(open) => !open && setQuick(null)}>
        {quick ? (
          <DialogContent className="max-w-2xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <ProductImage producto={quick} className="aspect-square bg-muted object-contain p-4" />
              <div className="flex flex-col justify-center">
                <DialogHeader>
                  <span className="text-xs font-bold text-accent">{marcaDe(quick.nombre, quick.marca)}</span>
                  <DialogTitle className="text-2xl leading-tight text-primary">{quick.nombre}</DialogTitle>
                  <DialogDescription>{quick.descripcion || "Producto original con garantía de fabricante."}</DialogDescription>
                </DialogHeader>
                <div className="mt-5">
                  <b className="font-display text-3xl text-primary">{precioMx(quick.precio)}</b>
                </div>
                <Button
                  className="mt-6 h-11"
                  onClick={() => {
                    agregarProducto(quick);
                    setQuick(null);
                  }}
                >
                  Añadir al carrito
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
