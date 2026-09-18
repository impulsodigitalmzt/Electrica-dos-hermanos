import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, PackageCheck, ShoppingCart } from "lucide-react";
import { Header } from "@/components/Header";
import { Brands, Faq, PreFooterLeyenda, PrivacyNotice, SiteFooter, Sucursales, TrustBar } from "@/components/HomeSections";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo } from "@/lib/api";
import { CATEGORY_TILES, HERO_HOME, HERO_INDUSTRIAL, marcaDe } from "@/lib/brand";
import { DEMO_PRODUCTOS } from "@/lib/demo-productos";
import { precioMx } from "@/lib/format";
import { AppLink, navigate } from "@/lib/nav";
import type { Producto } from "@/types";

export function HomePage() {
  const { agregarProducto } = useCart();
  const [query, setQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [productos, setProductos] = useState<Producto[]>(DEMO_PRODUCTOS.slice(0, 8));
  const [cargando, setCargando] = useState(true);
  const [quick, setQuick] = useState<Producto | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % 2), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let vivo = true;
    void fetchCatalogo({ limit: 8 })
      .then((data) => {
        if (vivo && data.productos.length) setProductos(data.productos);
      })
      .catch(() => {
        if (vivo) setProductos(DEMO_PRODUCTOS.slice(0, 8));
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const heroes = [HERO_HOME, HERO_INDUSTRIAL];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header query={query} onQueryChange={setQuery} favorites={favorites.length} />
      <main id="inicio">
        <section className="relative overflow-hidden bg-primary" aria-label="Promociones destacadas">
          {heroes.map((image, index) => (
            <div
              key={image}
              aria-hidden={slide !== index}
              className={`transition-opacity duration-700 ${slide === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"}`}
            >
              <img
                src={image}
                width={1600}
                height={768}
                alt={index === 0 ? "Sala moderna iluminada con lámparas decorativas" : "Nave industrial iluminada con luminarios LED"}
                className="h-[430px] w-full object-cover sm:h-[510px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/65 to-transparent" />
              <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-6 sm:px-10">
                <div className="max-w-xl text-primary-foreground">
                  <p className="mb-4 inline-flex items-center gap-2 border-l-4 border-secondary pl-3 text-sm font-bold uppercase">
                    {index === 0 ? "Eléctrica Dos Hermanos ilumina tu hogar" : "E2H · Soluciones profesionales"}
                  </p>
                  {index === 0 ? (
                    <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">La primavera se ilumina</h1>
                  ) : (
                    <h2 className="text-4xl font-extrabold leading-tight sm:text-6xl">Potencia cada proyecto</h2>
                  )}
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                    {index === 0
                      ? "Luminarias decorativas para transformar tu hogar, oficina y cada espacio que imaginas."
                      : "Iluminación LED y material eléctrico confiable para instalaciones industriales de cualquier escala."}
                  </p>
                  {index === 0 ? (
                    <Button size="lg" className="mt-7 bg-secondary font-bold text-secondary-foreground shadow-none hover:bg-secondary/90" asChild>
                      <AppLink to="/iluminacion">
                        Comprar iluminación <ArrowRight />
                      </AppLink>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => navigate("/buscar")}
                      className="mt-7 bg-secondary font-bold text-secondary-foreground shadow-none hover:bg-secondary/90"
                    >
                      Ver soluciones <ArrowRight />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Promoción anterior"
              onClick={() => setSlide((slide + 1) % 2)}
              className="border-primary-foreground/40 bg-primary/40 text-primary-foreground hover:bg-primary"
            >
              <ArrowLeft />
            </Button>
            {[0, 1].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Ver promoción ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${slide === i ? "w-9 bg-secondary" : "w-4 bg-primary-foreground/60"}`}
              />
            ))}
            <Button
              variant="outline"
              size="icon"
              aria-label="Promoción siguiente"
              onClick={() => setSlide((slide + 1) % 2)}
              className="border-primary-foreground/40 bg-primary/40 text-primary-foreground hover:bg-primary"
            >
              <ArrowRight />
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-accent">Explora por espacio</span>
              <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">Encuentra justo lo que necesitas</h2>
            </div>
            <Button variant="ghost" className="hidden text-primary sm:flex" onClick={() => navigate("/buscar")}>
              Ver todas las categorías <ArrowRight />
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_TILES.map((item) => (
              <AppLink key={item.label} to={`/buscar?q=${encodeURIComponent(item.q)}`} className="group text-left">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.imagen}
                    alt={item.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-3 flex items-center justify-between font-display text-sm font-bold text-primary sm:text-base">
                  {item.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </AppLink>
            ))}
          </div>
        </section>

        <section id="productos" className="bg-muted py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-accent">Selección E2H</span>
                <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-4xl">Productos destacados</h2>
              </div>
              <Button variant="ghost" className="hidden text-primary sm:flex" onClick={() => navigate("/buscar")}>
                Ver catálogo completo <ArrowRight />
              </Button>
            </div>
            <div className="mt-8">
              <ProductGrid
                productos={productos}
                cargando={cargando}
                onAdd={agregarProducto}
                onQuick={setQuick}
                favorites={favorites}
                onFavorite={(sku) =>
                  setFavorites((current) => (current.includes(sku) ? current.filter((item) => item !== sku) : [...current, sku]))
                }
              />
            </div>
          </div>
        </section>

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
                  <span className="text-xs font-bold text-accent">{marcaDe(quick.nombre, quick.marca)}</span>
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
