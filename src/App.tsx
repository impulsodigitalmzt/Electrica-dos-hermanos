import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import {
  Brands,
  CategoryExplorer,
  Faq,
  Hero,
  PrivacyNotice,
  SiteFooter,
  Sucursales,
  TrustBar,
  WhatsAppFab,
} from "./components/HomeSections";
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

  function aplicarFiltro(value: string, cat = "") {
    setQuery(value);
    setFiltro(value);
    setCategoria(cat);
    if (value || cat) {
      window.requestAnimationFrame(() => {
        document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
      });
    } else {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const titulo = useMemo(() => {
    if (filtro) return `Resultados para “${filtro}”`;
    if (categoria) return etiquetaCategoria(categoria);
    return "Productos destacados";
  }, [categoria, filtro]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header query={query} onQueryChange={setQuery} onFilter={aplicarFiltro} />
      <Hero onFilter={aplicarFiltro} />
      <CategoryExplorer onFilter={aplicarFiltro} />

      <section id="catalogo" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Selección E2H</p>
            <h2 className="mt-1 text-3xl font-bold">{titulo}</h2>
            <p className="text-sm text-muted-foreground">{total} productos en existencia</p>
          </div>
          <button
            type="button"
            onClick={() => aplicarFiltro("")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver catálogo completo
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => aplicarFiltro("", "")}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
              categoria === "" && filtro === "" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"
            }`}
          >
            Todo
          </button>
          {categorias.map((item) => (
            <button
              key={item.categoria}
              type="button"
              onClick={() => aplicarFiltro("", item.categoria)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                categoria === item.categoria ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"
              }`}
            >
              {etiquetaCategoria(item.categoria)}
            </button>
          ))}
        </div>
        {error ? <p className="mb-4 rounded-md bg-accent/10 px-4 py-3 text-sm text-accent">{error}</p> : null}
        <ProductGrid productos={productos} cargando={cargando} onAdd={agregarProducto} />
      </section>

      <TrustBar />
      <Brands />
      <Faq />
      <Sucursales />
      <PrivacyNotice />
      <SiteFooter />
      <WhatsAppFab />
      <CartDrawer />
    </div>
  );
}
