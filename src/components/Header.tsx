import { useState } from "react";
import { useCart } from "../context/CartContext";
import { NAV_CATEGORIAS } from "../lib/format";
import { IconCart, IconMenu, IconTruck, IconWhatsApp } from "../lib/icons";
import { SearchBar } from "./SearchBar";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onFilter: (value: string, categoria?: string) => void;
};

export function Header({ query, onQueryChange, onFilter }: Props) {
  const { piezas, setAbierto } = useCart();
  const [menu, setMenu] = useState(false);

  function irA(item: (typeof NAV_CATEGORIAS)[number]) {
    setMenu(false);
    if ("href" in item && item.href) {
      if (item.id === "ofertas") onFilter("");
      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    onFilter("q" in item ? item.q : "");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-1 text-center text-xs font-semibold sm:justify-between sm:text-sm">
          <span className="flex items-center gap-2">
            <IconTruck className="size-4 text-secondary" />
            Mazatlán · Culiacán · San José del Cabo · Cabo San Lucas y envíos a todo México
          </span>
          <div className="hidden items-center gap-5 lg:flex">
            <a href="tel:+526699407077">Tel. (669) 940-7077 / 940-7088</a>
            <a href="mailto:cotizaciones.mzt@electricadoshermanos.com">cotizaciones.mzt@electricadoshermanos.com</a>
            <a className="flex items-center gap-1 text-secondary" href="https://wa.me/526699407077">
              <IconWhatsApp /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMenu((v) => !v)}
          >
            <IconMenu />
          </button>
          <a href="#inicio" className="flex shrink-0 items-center gap-2" aria-label="Eléctrica Dos Hermanos inicio">
            <img src="/logo.png" alt="" className="h-11 w-auto" />
            <span className="leading-none">
              <span className="block text-lg font-bold text-primary">Eléctrica</span>
              <span className="block text-lg font-bold text-accent">Dos Hermanos</span>
            </span>
          </a>
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBar value={query} onChange={onQueryChange} onFilter={(q) => onFilter(q)} />
          </div>
          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="relative ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
            aria-label={`Abrir carrito, ${piezas} productos`}
          >
            <IconCart />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
              {piezas}
            </span>
          </button>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBar value={query} onChange={onQueryChange} onFilter={(q) => onFilter(q)} />
        </div>
        <nav className="hidden border-t border-border lg:block">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-7 px-4 py-2.5 text-sm font-semibold text-foreground/80">
            {NAV_CATEGORIAS.map((item) => (
              <button key={item.id} type="button" onClick={() => irA(item)} className="hover:text-primary">
                {item.label}
              </button>
            ))}
          </div>
        </nav>
        {menu ? (
          <div className="grid gap-1 border-t border-border px-4 py-3 lg:hidden">
            {NAV_CATEGORIAS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => irA(item)}
                className="rounded-md px-2 py-2 text-left text-sm font-semibold hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
