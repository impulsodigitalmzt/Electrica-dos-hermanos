import { useState } from "react";
import { ChevronDown, CircleUserRound, Heart, Menu, MessageCircle, ShoppingCart, Truck } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { LOGO_SRC, MAIN_EMAIL, NAV_ITEMS, telHref, WHATSAPP_URL } from "@/lib/brand";
import { AppLink, navigate } from "@/lib/nav";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  variant?: "home" | "inner";
  searchPath?: string;
  favorites?: number;
};

export function Header({ query, onQueryChange, variant = "home", searchPath = "/buscar", favorites = 0 }: Props) {
  const { piezas, setAbierto } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-1 text-center text-xs font-semibold sm:justify-between sm:text-sm">
          <span className="flex items-center gap-2">
            <Truck className="size-4 text-secondary" /> Envíos gratis a todo México en compras mayores a $1,000
          </span>
          <div className="hidden items-center gap-5 lg:flex">
            <a href={telHref("6699407077")}>Tel. (669) 940-7077 / 940-7088</a>
            <a href={`mailto:${MAIN_EMAIL}`}>{MAIN_EMAIL}</a>
            <a className="flex items-center gap-1 text-secondary" href={WHATSAPP_URL}>
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 lg:flex-nowrap lg:gap-7">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" onClick={() => setMenu(true)}>
            <Menu />
          </Button>
          <AppLink to="/" className="flex shrink-0 items-center gap-2" aria-label="Eléctrica Dos Hermanos inicio">
            <img src={LOGO_SRC} alt="Eléctrica Dos Hermanos" className="h-12 w-auto object-contain sm:h-14" />
            <span className="hidden font-display text-base font-extrabold leading-tight text-primary xl:block">
              Eléctrica
              <br />
              Dos Hermanos
            </span>
          </AppLink>
          <div className="relative z-50 order-last w-full basis-full overflow-visible lg:order-none lg:basis-auto lg:flex-1">
            <SearchBar value={query} onChange={onQueryChange} searchPath={searchPath} />
          </div>
          <div className="ml-auto flex items-center gap-1">
            {variant === "inner" ? (
              <Button variant="ghost" className="hidden text-primary sm:flex" onClick={() => navigate("/")}>
                Inicio
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" aria-label="Mi cuenta">
              <CircleUserRound />
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label={`${favorites} favoritos`}>
              <Heart className={favorites ? "fill-sale text-sale" : ""} />
              {favorites > 0 ? <Counter value={favorites} /> : null}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`${piezas} artículos en carrito`}
              onClick={() => setAbierto(true)}
            >
              <ShoppingCart />
              {piezas > 0 ? <Counter value={piezas} /> : null}
            </Button>
          </div>
        </div>
        {variant === "home" ? (
          <nav aria-label="Navegación principal" className="hidden border-t lg:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
              {NAV_ITEMS.map((item) => (
                <AppLink
                  key={item.id}
                  to={item.to}
                  className={`flex h-12 items-center gap-1 border-b-2 px-2 text-sm font-bold uppercase transition-colors hover:text-primary ${
                    "sale" in item && item.sale ? "border-sale text-sale" : "border-transparent"
                  }`}
                >
                  {item.label}
                  {item.id !== "ofertas" ? <ChevronDown className="size-3" /> : null}
                </AppLink>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[88%]">
          <SheetHeader>
            <SheetTitle className="text-left text-2xl text-primary">Menú</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMenu(false);
                  navigate(item.to);
                }}
                className="flex items-center justify-between border-b py-4 text-left font-bold text-primary"
              >
                {item.label}
                <ChevronDown className="size-4 -rotate-90" />
              </button>
            ))}
          </nav>
          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p>Tel. (669) 940-7077 / 940-7088</p>
            <p className="break-all">{MAIN_EMAIL}</p>
            <p className="flex items-center gap-2">
              <MessageCircle className="size-4" /> WhatsApp (669) 940-7077
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-sale-foreground">
      {value}
    </span>
  );
}
