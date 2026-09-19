import { useEffect, useMemo, useState } from "react";
import { Lightbulb, RotateCcw, SlidersHorizontal } from "lucide-react";
import { GuiaRapida } from "@/components/GuiaRapida";
import { Header } from "@/components/Header";
import { CompactFooter, PreFooterLeyenda } from "@/components/HomeSections";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo } from "@/lib/api";
import { BrandLogo } from "@/components/BrandLogo";
import { StoreVideo } from "@/components/StoreVideo";
import { logoDeMarca, marcaDe, videoDeConsulta } from "@/lib/brand";
import {
  CATALOGO_ILUMINACION,
  MARCAS_ILUMINACION,
  ORDEN_CATALOGO,
  TEMPERATURAS,
  TIPOS_LUMINARIO,
  USOS,
  aplicarFiltros,
  conteoTipo,
  mezclarCatalogo,
} from "@/lib/catalogo-iluminacion";
import { DEMO_PRODUCTOS, filtrarDemo } from "@/lib/demo-productos";
import { precioMx } from "@/lib/format";
import { AppLink } from "@/lib/nav";
import type { Producto } from "@/types";

type Props = { q: string; categoria: string; iluminacion: boolean };

function toggleValor(lista: string[], valor: string): string[] {
  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
}

export function SearchPage({ q, categoria, iluminacion }: Props) {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState(q);
  const [productos, setProductos] = useState<Producto[]>(iluminacion ? CATALOGO_ILUMINACION : []);
  const [cargando, setCargando] = useState(true);
  const [tipo, setTipo] = useState("todas");
  const [marcas, setMarcas] = useState<string[]>([]);
  const [temps, setTemps] = useState<string[]>([]);
  const [uso, setUso] = useState("todos");
  const [maxPrice, setMaxPrice] = useState(2500);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sort, setSort] = useState("relevancia");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<Producto | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCargando(true);
      void fetchCatalogo({ q: iluminacion ? "" : q, categoria, limit: 60 })
        .then((data) => {
          if (iluminacion) {
            const extra = data.productos.filter((item) =>
              /\b(foco|lampara|plafon|candil|tira led|reflector|arbotante|downlight|empotrado)\b/i.test(item.nombre)
            );
            setProductos(mezclarCatalogo(CATALOGO_ILUMINACION, extra));
            return;
          }
          setProductos(data.productos.length ? data.productos : filtrarDemo(DEMO_PRODUCTOS, q, categoria));
        })
        .catch(() => {
          setProductos(iluminacion ? CATALOGO_ILUMINACION : filtrarDemo(DEMO_PRODUCTOS, q, categoria));
        })
        .finally(() => setCargando(false));
    }, 160);
    return () => window.clearTimeout(handle);
  }, [categoria, iluminacion, q]);

  const techoPrecio = useMemo(() => {
    const max = Math.max(2500, ...productos.map((item) => item.precio), 2500);
    return Math.ceil(max / 10) * 10;
  }, [productos]);

  useEffect(() => {
    setMaxPrice((actual) => (actual > techoPrecio ? techoPrecio : actual));
  }, [techoPrecio]);

  const results = useMemo(
    () =>
      aplicarFiltros(productos, {
        tipo: iluminacion ? tipo : "todas",
        marcas,
        temperaturas: iluminacion ? temps : [],
        uso: iluminacion ? uso : "todos",
        maxPrice,
        onlyOffers,
        q: iluminacion ? query : "",
        sort,
      }),
    [iluminacion, marcas, maxPrice, onlyOffers, productos, query, sort, temps, tipo, uso]
  );

  function resetFilters() {
    setTipo("todas");
    setMarcas([]);
    setTemps([]);
    setUso("todos");
    setMaxPrice(techoPrecio);
    setOnlyOffers(false);
    setSort("relevancia");
    if (!q) setQuery("");
  }

  const filtersPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Tipo de luminario</h3>
        <div className="mt-3 flex flex-col">
          {TIPOS_LUMINARIO.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTipo(item.id)}
              aria-pressed={tipo === item.id}
              className={`flex items-center justify-between border-b py-2.5 text-left text-sm font-semibold transition ${
                tipo === item.id ? "text-accent" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
              <span className="text-xs">{conteoTipo(productos, item.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Marca</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {MARCAS_ILUMINACION.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setMarcas((current) => toggleValor(current, brand))}
              aria-pressed={marcas.includes(brand)}
              className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-bold transition ${
                marcas.includes(brand) ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {logoDeMarca("", brand) ? <img src={logoDeMarca("", brand)} alt="" className="h-4 w-auto object-contain" /> : null}
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Temperatura de color</h3>
        <div className="mt-3 flex flex-col gap-2">
          {TEMPERATURAS.map((temp) => (
            <label key={temp} className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={temps.includes(temp)}
                onChange={() => setTemps((current) => toggleValor(current, temp))}
                className="size-4 accent-[oklch(0.43_0.2_257)]"
              />
              {temp}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Uso</h3>
        <div className="mt-3 flex gap-2">
          {["todos", ...USOS].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setUso(item)}
              aria-pressed={uso === item}
              className={`flex-1 border px-3 py-2 text-xs font-bold capitalize transition ${
                uso === item ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-extrabold uppercase text-primary">Precio máximo</h3>
        <input
          type="range"
          min={89}
          max={techoPrecio}
          step={10}
          value={Math.min(maxPrice, techoPrecio)}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Precio máximo"
          className="mt-4 w-full accent-[oklch(0.68_0.2_48)]"
        />
        <p className="mt-2 text-sm font-bold text-primary">Hasta {precioMx(Math.min(maxPrice, techoPrecio))}</p>
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

  const videoBanner = iluminacion ? null : videoDeConsulta(q);

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
          {videoBanner ? (
            <StoreVideo src={videoBanner.src} title={videoBanner.title} controls={false} className="h-64 w-full sm:h-80" />
          ) : (
            <img src="/brand/lumi-hero-home.jpg" alt="Interiores iluminados con luminarios LED" className="h-64 w-full object-cover sm:h-80" width={1600} height={640} />
          )}
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
                : "Filtra por tipo, marca, temperatura, uso y precio. También puedes usar voz o una foto en el buscador."}
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
                    {ORDEN_CATALOGO.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {!cargando && results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Lightbulb className="size-14 text-border" />
                <h2 className="mt-4 text-xl font-bold text-primary">Sin resultados</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Ajusta los filtros o busca con otras palabras para encontrar el luminario que necesitas.
                </p>
                <Button className="mt-5" onClick={resetFilters}>
                  <RotateCcw /> Limpiar filtros
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </section>
        <GuiaRapida iluminacion={iluminacion} q={q} categoria={categoria} />
        <PreFooterLeyenda />
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
              <ProductImage producto={quick} sprite={Boolean(quick.pos)} pos={quick.pos} className="aspect-square bg-muted object-contain p-4" />
              <div className="flex flex-col justify-center">
                <DialogHeader>
                  <BrandLogo nombre={quick.nombre} marca={marcaDe(quick.nombre, quick.marca)} className="h-5" />
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
