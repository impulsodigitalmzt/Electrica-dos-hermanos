import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import { ProductGrid } from "./components/ProductGrid";
import { useCart } from "./context/CartContext";
import { fetchCatalogo, fetchCategorias } from "./lib/api";
import { etiquetaCategoria } from "./lib/format";
import type { Producto } from "./types";

export default function App() {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [categorias, setCategorias] = useState<{ categoria: string; total: number }[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetchCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setCargando(true);
      setError("");
      void fetchCatalogo({ q: filtro, categoria, limit: 32 })
        .then((data) => {
          setProductos(data.productos);
          setTotal(data.total);
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "No se pudo cargar el catálogo.");
          setProductos([]);
        })
        .finally(() => setCargando(false));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [categoria, filtro]);

  const titulo = useMemo(() => {
    if (filtro) return `Resultados para “${filtro}”`;
    if (categoria) return etiquetaCategoria(categoria);
    return "Catálogo del anaquel";
  }, [categoria, filtro]);

  return (
    <div className="min-h-screen">
      <Header query={query} onQueryChange={setQuery} onFilter={setFiltro} />

      <section className="bg-[linear-gradient(135deg,#102033_0%,#1a4fb8_58%,#f15a24_140%)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ead7ba]">Tienda en línea</p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight md:text-5xl">
              El anaquel de siempre, ahora con cuenta abierta.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80">
              Busca una pieza o descríbele el trabajo al mostrador. El asistente arma el BOM, recuerda lo que ya pediste y lo
              acumula en tu cuenta.
            </p>
          </div>
          <img src="/logo.png" alt="" className="mx-auto hidden h-44 w-auto drop-shadow-2xl md:block" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-navy">{titulo}</h2>
            <p className="text-sm text-neutral-500">{total} productos en Neon</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoria("")}
              className={`rounded-full px-3 py-1.5 text-sm ${categoria === "" ? "bg-navy text-white" : "bg-white text-navy"}`}
            >
              Todo
            </button>
            {categorias.map((item) => (
              <button
                key={item.categoria}
                type="button"
                onClick={() => setCategoria(item.categoria)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  categoria === item.categoria ? "bg-navy text-white" : "bg-white text-navy"
                }`}
              >
                {etiquetaCategoria(item.categoria)}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange">{error}</p> : null}
        <ProductGrid productos={productos} cargando={cargando} onAdd={agregarProducto} />
      </main>

      <footer className="mt-8 border-t border-line bg-white py-8 text-center text-sm text-neutral-500">
        Eléctrica Dos Hermanos · inventario en vivo desde Neon · listo para Cloudflare Workers
      </footer>
      <CartDrawer />
    </div>
  );
}
