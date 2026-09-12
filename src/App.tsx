import { useMemo, useState } from "react";
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
import { DEMO_PRODUCTOS, filtrarDemo } from "./lib/demo-productos";

export default function App() {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("");

  const productos = useMemo(() => filtrarDemo(DEMO_PRODUCTOS, filtro), [filtro]);

  function aplicarFiltro(value: string) {
    setQuery(value);
    setFiltro(value);
    window.requestAnimationFrame(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const filtrado = Boolean(filtro.trim());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header query={query} onQueryChange={setQuery} onFilter={aplicarFiltro} />
      <Hero onFilter={aplicarFiltro} />
      <CategoryExplorer onFilter={aplicarFiltro} />

      <section id="catalogo" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Selección E2H</p>
            <h2 className="mt-1 text-3xl font-bold">
              {filtrado ? `Resultados para “${filtro}”` : "Productos destacados"}
            </h2>
            <p className="text-sm text-muted-foreground">{productos.length} productos listos para tu proyecto</p>
          </div>
          <button
            type="button"
            onClick={() => aplicarFiltro("")}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver catálogo completo
          </button>
        </div>
        <ProductGrid productos={productos} cargando={false} onAdd={agregarProducto} />
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
