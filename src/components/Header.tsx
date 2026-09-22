import { useState } from "react";
import {
  ArrowUpRight,
  Cable,
  ChevronDown,
  CircleUserRound,
  Clock,
  Heart,
  Home,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Percent,
  Phone,
  Plug,
  ShoppingCart,
  Tags,
  ToggleLeft,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { LOGO_SRC, MAIN_EMAIL, NAV_ITEMS, PROMO_TEMPORADA, telHref, WHATSAPP_URL } from "@/lib/brand";
import { AppLink, navigate } from "@/lib/nav";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  variant?: "home" | "inner";
  searchPath?: string;
  favorites?: number;
};

const NAV_ICONS: Record<(typeof NAV_ITEMS)[number]["id"], LucideIcon> = {
  iluminacion: Lightbulb,
  contactos: Plug,
  placas: ToggleLeft,
  tuberia: Cable,
  conductores: Zap,
  marcas: Tags,
  ofertas: Percent,
};

const MENU_ITEMS: { id: string; label: string; to: string; icon: LucideIcon; sale?: boolean }[] = [
  { id: "inicio", label: "Inicio", to: "/", icon: Home },
  ...NAV_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    to: item.to,
    icon: NAV_ICONS[item.id],
    sale: "sale" in item && item.sale ? true : undefined,
  })),
];

export function Header({ query, onQueryChange, variant = "home", searchPath = "/buscar", favorites = 0 }: Props) {
  const { piezas, setAbierto } = useCart();
  const [menu, setMenu] = useState(false);

  function ir(to: string) {
    setMenu(false);
    navigate(to);
  }

  return (
    <>
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-3 py-1.5 text-center text-[11px] font-semibold sm:px-4 sm:text-xs md:text-sm lg:justify-between">
          <span className="flex items-center gap-2">
            <Truck className="size-3.5 shrink-0 text-secondary sm:size-4" />
            <span className="leading-snug">Envíos gratis a todo México en compras mayores a $1,000</span>
          </span>
          <div className="hidden items-center gap-5 lg:flex">
            <a href={telHref("6699407077")}>Tel. (669) 940-70-77 / 940-70-88 / 133-21-19</a>
            <a href={`mailto:${MAIN_EMAIL}`}>{MAIN_EMAIL}</a>
            <a className="flex items-center gap-1 text-secondary" href={WHATSAPP_URL}>
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:gap-7">
          <Button
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-full lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setMenu(true)}
          >
            <Menu className="size-5" />
          </Button>

          <AppLink to="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label="Eléctrica Dos Hermanos inicio">
            <img src={LOGO_SRC} alt="Eléctrica Dos Hermanos" className="h-10 w-auto object-contain sm:h-12 md:h-14" />
            <span className="hidden font-display text-base font-extrabold leading-tight text-primary xl:block">
              Eléctrica
              <br />
              Dos Hermanos
            </span>
          </AppLink>

          <div className="relative z-50 hidden min-w-0 flex-1 lg:block">
            <SearchBar value={query} onChange={onQueryChange} searchPath={searchPath} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
            {variant === "inner" ? (
              <Button variant="ghost" className="hidden text-primary sm:flex" onClick={() => navigate("/")}>
                Inicio
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" className="size-10" aria-label="Mi cuenta">
              <CircleUserRound className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative size-10" aria-label={`${favorites} favoritos`}>
              <Heart className={`size-5 ${favorites ? "fill-sale text-sale" : ""}`} />
              {favorites > 0 ? <Counter value={favorites} /> : null}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10"
              aria-label={`${piezas} artículos en carrito`}
              onClick={() => setAbierto(true)}
            >
              <ShoppingCart className="size-5" />
              {piezas > 0 ? <Counter value={piezas} /> : null}
            </Button>
          </div>
        </div>

        <div className="border-t px-3 py-2.5 lg:hidden">
          <SearchBar value={query} onChange={onQueryChange} searchPath={searchPath} />
        </div>

        {variant === "home" ? (
          <nav aria-label="Navegación principal" className="hidden border-t lg:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-4">
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
        <SheetContent
          side="left"
          className="flex w-[min(100%,400px)] flex-col gap-0 overflow-y-auto border-0 bg-[#eef1f5] p-0 shadow-2xl sm:max-w-[400px] [&>button]:right-4 [&>button]:top-4 [&>button]:flex [&>button]:size-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border-0 [&>button]:bg-white [&>button]:opacity-100 [&>button]:shadow-md [&>button]:ring-0 [&>button]:hover:bg-white [&>button]:hover:opacity-100"
        >
          <SheetTitle className="sr-only">Menú de navegación Eléctrica Dos Hermanos</SheetTitle>

          <div className="relative">
            <button type="button" onClick={() => ir("/")} className="block w-full text-left" aria-label="Ir al inicio">
              <img
                src="/brand/lumi-hero-home.jpg"
                alt="Eléctrica Dos Hermanos"
                className="h-44 w-full object-cover sm:h-52"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 pr-14">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
                  <img src={LOGO_SRC} alt="" className="h-full w-auto object-contain" />
                </span>
                <div className="min-w-0 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Bienvenido</p>
                  <p className="font-display text-lg font-extrabold leading-tight">Eléctrica Dos Hermanos</p>
                  <p className="mt-0.5 text-xs text-white/80">Material eléctrico · Ferretería · Plomería</p>
                </div>
              </div>
            </button>
          </div>

          <div className="space-y-4 px-4 pb-10 pt-4">
            <button
              type="button"
              onClick={() => ir("/buscar")}
              className="group relative block w-full overflow-hidden rounded-[22px] text-left shadow-sm ring-1 ring-black/5"
            >
              <img src={PROMO_TEMPORADA} alt="" className="aspect-[2.2/1] w-full object-cover object-left" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Ofertas</p>
                <p className="mt-1 font-display text-base font-extrabold">Hasta -20% de temporada</p>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-secondary">
                  Ver ofertas <ArrowUpRight className="size-4" />
                </span>
              </div>
            </button>

            <nav className="overflow-hidden rounded-[22px] bg-white p-2 shadow-sm ring-1 ring-black/5" aria-label="Menú móvil">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const activo = item.id === "inicio";
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => ir(item.to)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors ${
                      activo
                        ? "bg-primary/10 text-primary"
                        : item.sale
                          ? "text-sale hover:bg-sale/10"
                          : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                        activo
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : item.sale
                            ? "bg-sale/15 text-sale"
                            : "bg-[#eef2f7] text-primary"
                      }`}
                    >
                      <Icon className="size-5" strokeWidth={1.85} />
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[15px] font-bold leading-snug">{item.label}</span>
                    {item.sale ? (
                      <span className="rounded-full bg-sale px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sale-foreground">
                        Hot
                      </span>
                    ) : (
                      <ChevronDown className="size-4 shrink-0 -rotate-90 text-muted-foreground/60" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">Visítanos</p>
              <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eef2f7] text-primary">
                    <Clock className="size-4" />
                  </span>
                  <span className="pt-1.5">Lun–Vie 8:30–19:00 · Sáb 8:30–14:00</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eef2f7] text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <span className="pt-1.5">Matriz Mazatlán · Culiacán · San José del Cabo · Cabo San Lucas</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eef2f7] text-primary">
                    <Phone className="size-4" />
                  </span>
                  <a className="pt-1.5 hover:text-primary" href={telHref("6699407077")}>
                    (669) 940-70-77 / 940-70-88 / 133-21-19
                  </a>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eef2f7] text-primary">
                    <Mail className="size-4" />
                  </span>
                  <a className="break-all pt-1.5 hover:text-primary" href={`mailto:${MAIN_EMAIL}`}>
                    {MAIN_EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid gap-2.5">
              <Button
                className="h-12 rounded-full bg-secondary font-bold text-secondary-foreground shadow-sm hover:bg-secondary/90"
                asChild
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={() => setMenu(false)}>
                  <MessageCircle /> Cotizar por WhatsApp
                </a>
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-2 border-primary bg-white font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => ir("/#sucursales")}
              >
                <MapPin /> Ver sucursales
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-sale text-[10px] font-bold text-sale-foreground">
      {value > 99 ? "99+" : value}
    </span>
  );
}
