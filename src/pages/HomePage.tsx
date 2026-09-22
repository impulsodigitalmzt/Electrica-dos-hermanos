import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, PackageCheck, ShoppingCart } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Header } from "@/components/Header";
import { Brands, BrandLogoMarquee, EmpresaIntro, Faq, PreFooterLeyenda, PrivacyNotice, PromoContactosVideo, ScrollingBanner, SiteFooter, SucursalTourVideo, Sucursales, Testimonials, TrustBar } from "@/components/HomeSections";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo } from "@/lib/api";
import {
  CATEGORY_TILES,
  COLLECTION_CARDS,
  HERO_SLIDES,
  SECTORES_TIENDA,
  PROMO_TEMPORADA,
  PROMO_TEMPORADA_VIDEO,
  PROMO_TILES,
  marcaDe,
} from "@/lib/brand";
import { CATALOGO_ILUMINACION, mezclarCatalogo } from "@/lib/catalogo-iluminacion";
import { DEMO_PRODUCTOS } from "@/lib/demo-productos";
import { precioMx } from "@/lib/format";
import { AppLink, navigate } from "@/lib/nav";
import type { Producto } from "@/types";

const HEROES = HERO_SLIDES;

const CONTACTOS_LOCALES = DEMO_PRODUCTOS.filter((producto) => ["contactos", "placas"].includes(producto.categoria));

export function HomePage() {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [iluminacion, setIluminacion] = useState<Producto[]>(CATALOGO_ILUMINACION.slice(0, 4));
  const [contactos, setContactos] = useState<Producto[]>(CONTACTOS_LOCALES.slice(0, 4));
  const [quick, setQuick] = useState<Producto | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % HEROES.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let vivo = true;
    void Promise.all([
      fetchCatalogo({ q: "foco lampara led", limit: 8 }).catch(() => ({ productos: [] as Producto[] })),
      fetchCatalogo({ q: "contacto placa interruptor", limit: 8 }).catch(() => ({ productos: [] as Producto[] })),
    ]).then(([luz, con]) => {
      if (!vivo) return;
      if (luz.productos.length) setIluminacion(mezclarCatalogo(CATALOGO_ILUMINACION, luz.productos).slice(0, 4));
      if (con.productos.length) setContactos(mezclarCatalogo(CONTACTOS_LOCALES, con.productos).slice(0, 4));
    });
    return () => {
      vivo = false;
    };
  }, []);

  const toggleFavorite = (sku: string) => {
    setFavorites((current) => (current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header query={query} onQueryChange={setQuery} favorites={favorites.length} />
      <main id="inicio">
        <section className="relative overflow-hidden bg-muted" aria-label="Promociones destacadas">
          {HEROES.map((hero, index) => (
            <div
              key={hero.image}
              aria-hidden={slide !== index}
              className={`transition-opacity duration-700 ${slide === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}
            >
              <img src={hero.image} width={1600} height={768} alt={hero.alt} className="h-[430px] w-full object-cover sm:h-[540px]" />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="max-w-3xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
                  <p className="text-sm font-bold uppercase tracking-[0.2em]">{hero.kicker}</p>
                  {index === 0 ? (
                    <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-6xl">{hero.title}</h1>
                  ) : (
                    <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-6xl">{hero.title}</h2>
                  )}
                  <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">{hero.text}</p>
                  <Button size="lg" className="mt-7 bg-secondary font-bold text-secondary-foreground shadow-none hover:bg-secondary/90" asChild>
                    <AppLink to={hero.to}>
                      {hero.cta} <ArrowRight />
                    </AppLink>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Promoción anterior"
              onClick={() => setSlide((value) => (value + HEROES.length - 1) % HEROES.length)}
              className="border-primary-foreground/40 bg-primary/40 text-primary-foreground hover:bg-primary"
            >
              <ArrowLeft />
            </Button>
            {HEROES.map((hero, index) => (
              <button
                key={hero.image}
                type="button"
                onClick={() => setSlide(index)}
                aria-label={`Ver promoción ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${slide === index ? "w-9 bg-secondary" : "w-4 bg-primary-foreground/60"}`}
              />
            ))}
            <Button
              variant="outline"
              size="icon"
              aria-label="Promoción siguiente"
              onClick={() => setSlide((value) => (value + 1) % HEROES.length)}
              className="border-primary-foreground/40 bg-primary/40 text-primary-foreground hover:bg-primary"
            >
              <ArrowRight />
            </Button>
          </div>
        </section>

        <ScrollingBanner />
        <EmpresaIntro />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16" aria-labelledby="sectores">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase text-accent">Nuestros sectores</span>
            <h2 id="sectores" className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">
              Electricidad, plomería, ferretería y herramientas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Todo el catálogo de Eléctrica Dos Hermanos está basado en estos cuatro rubros para casa, negocio y obra.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {SECTORES_TIENDA.map((item) => (
              <AppLink key={item.id} to={item.to} className="group block text-left">
                <div className="overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-3 block font-display text-base font-extrabold text-primary sm:text-xl">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs leading-snug text-muted-foreground sm:text-sm">
                  {item.text}
                </span>
              </AppLink>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:py-16" aria-labelledby="colecciones">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase text-accent">Colecciones</span>
            <h2 id="colecciones" className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">
              Encuentra justo lo que necesitas
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {COLLECTION_CARDS.map((item) => (
              <AppLink key={item.label} to={item.to} className="group relative block overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt=""
                  className="aspect-[4/5] h-full w-full bg-background object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-3 pt-10 text-sm font-bold text-primary-foreground sm:text-base">
                  {item.label}
                </span>
              </AppLink>
            ))}
          </div>
        </section>

        <section className="bg-muted py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-accent">Explora por espacio</span>
                <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">Iluminación para cada ambiente</h2>
              </div>
              <Button variant="ghost" className="hidden text-primary sm:flex" asChild>
                <AppLink to="/iluminacion">
                  Ver iluminación <ArrowRight />
                </AppLink>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CATEGORY_TILES.map((item) => (
                <AppLink key={item.label} to={`/iluminacion?q=${encodeURIComponent(item.q.split(" ")[0])}`} className="group text-left">
                  <div className="aspect-square overflow-hidden bg-background">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-3 flex items-center justify-between font-display text-sm font-bold text-primary sm:text-base">
                    {item.label}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </AppLink>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14" aria-labelledby="promos-sucursal">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-accent">Promociones de sucursal</span>
              <h2 id="promos-sucursal" className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">
                Lo que está en oferta
              </h2>
            </div>
            <Button variant="ghost" className="hidden text-primary sm:flex" asChild>
              <AppLink to="/buscar">
                Ver ofertas <ArrowRight />
              </AppLink>
            </Button>
          </div>
          <AppLink
            to="/buscar"
            className="group relative mb-4 block w-full overflow-hidden lg:mx-auto lg:w-[90%]"
            aria-label="Ofertas de temporada hasta 35% de descuento — comprar ahora"
          >
            <img
              src={PROMO_TEMPORADA}
              alt="Ofertas de temporada: hasta 35% de descuento en material eléctrico e iluminación"
              width={983}
              height={768}
              className="h-auto w-full transition-opacity duration-300 group-hover:opacity-95"
            />
            <div className="pointer-events-none absolute inset-y-[6%] right-[2.5%] left-[56%] flex items-center justify-end">
              <div className="h-full max-w-full aspect-[9/16] overflow-hidden rounded-[clamp(16px,2.5vw,40px)] shadow-md">
                <video
                  src={PROMO_TEMPORADA_VIDEO}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  title="Promoción Eléctrica Dos Hermanos"
                />
              </div>
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute left-[4%] top-[71%] inline-flex max-w-[48%] items-center justify-center rounded-full bg-secondary px-[clamp(0.7rem,2.4vw,1.6rem)] py-[clamp(0.32rem,0.95vw,0.6rem)] text-[clamp(0.55rem,1.55vw,0.9rem)] font-bold uppercase tracking-wide text-secondary-foreground shadow-sm transition group-hover:bg-secondary/90 sm:left-[5%] sm:top-[72%]"
            >
              Comprar ahora
            </span>
          </AppLink>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PROMO_TILES.map((item) => (
              <AppLink key={item.label} to={item.to} className="group overflow-hidden border bg-card">
                <img src={item.image} alt={item.label} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="block px-3 py-3 text-sm font-bold text-primary">{item.label}</span>
              </AppLink>
            ))}
          </div>
        </section>

        <BrandLogoMarquee />

        <ColeccionDestacada
          kicker="Tecnolite y más"
          titulo="Iluminación destacada"
          to="/iluminacion"
          productos={iluminacion}
          onAdd={agregarProducto}
          onQuick={setQuick}
          favorites={favorites}
          onFavorite={toggleFavorite}
        />

        <PromoContactosVideo />

        <ColeccionDestacada
          kicker="Residencial"
          titulo="Contactos, placas e interruptores"
          to="/buscar?q=contacto"
          productos={contactos}
          onAdd={agregarProducto}
          onQuick={setQuick}
          favorites={favorites}
          onFavorite={toggleFavorite}
        />

        <SucursalTourVideo />

        <Testimonials />
        <TrustBar />
        <Brands />
        <Faq />
        <Sucursales />
        <PrivacyNotice />
        <PreFooterLeyenda />
      </main>
      <SiteFooter />

      <Dialog open={Boolean(quick)} onOpenChange={(open) => !open && setQuick(null)}>
        {quick ? (
          <DialogContent className="max-w-2xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <ProductImage producto={quick} className="aspect-square bg-muted object-contain p-4" />
              <div className="flex flex-col justify-center">
                <DialogHeader>
                  <BrandLogo nombre={quick.nombre} marca={marcaDe(quick.nombre, quick.marca)} className="h-5" />
                  <DialogTitle className="text-2xl leading-tight text-primary">{quick.nombre}</DialogTitle>
                  <DialogDescription>
                    {quick.descripcion || "Producto original con garantía de fabricante. Disponibilidad inmediata."}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-5">
                  <b className="font-display text-3xl text-primary">{precioMx(quick.precio)}</b>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-success">
                  <PackageCheck className="size-5" /> {quick.stock > 0 ? `Disponible · ${quick.stock} pza` : "Consulta existencia"}
                </div>
                <Button
                  className="mt-6 h-11"
                  onClick={() => {
                    agregarProducto(quick);
                    setQuick(null);
                  }}
                >
                  <ShoppingCart /> Añadir al carrito
                </Button>
                <Button variant="ghost" className="mt-2 text-primary" onClick={() => navigate(`/producto/${encodeURIComponent(quick.sku)}`)}>
                  Ver ficha completa
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function ColeccionDestacada({
  kicker,
  titulo,
  to,
  productos,
  onAdd,
  onQuick,
  favorites,
  onFavorite,
}: {
  kicker: string;
  titulo: string;
  to: string;
  productos: Producto[];
  onAdd: (producto: Producto) => void;
  onQuick: (producto: Producto) => void;
  favorites: string[];
  onFavorite: (sku: string) => void;
}) {
  return (
    <section id={to.startsWith("/iluminacion") ? "productos" : undefined} className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-accent">{kicker}</span>
            <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">{titulo}</h2>
          </div>
          <Button variant="ghost" className="hidden text-primary sm:flex" asChild>
            <AppLink to={to}>
              Ver todo <ArrowRight />
            </AppLink>
          </Button>
        </div>
        <div className="mt-8">
          <ProductCarousel label={titulo}>
            {productos.map((producto) => (
              <ProductCard
                key={producto.sku}
                producto={producto}
                onAdd={onAdd}
                onQuick={onQuick}
                favorite={favorites.includes(producto.sku)}
                onFavorite={onFavorite}
              />
            ))}
          </ProductCarousel>
        </div>
      </div>
    </section>
  );
}
