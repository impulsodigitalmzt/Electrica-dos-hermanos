import { useEffect, useMemo, useState, type SVGProps } from "react";
import { BadgeCheck, Minus, Plus, Trash2 } from "lucide-react";
import { CantidadInput } from "@/components/CantidadInput";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { fetchCatalogo } from "@/lib/api";
import { ENVIO_GRATIS_DESDE, WHATSAPP_URL } from "@/lib/brand";
import { precioMx } from "@/lib/format";
import { consultaComplemento, sugerirComplementos } from "@/lib/recomendaciones-carrito";
import type { Producto } from "@/types";

function IconoCarrito(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export function CartDrawer() {
  const { abierto, setAbierto, lineas, cambiarCantidad, quitar, agregarProducto, piezas, total } = useCart();
  const remaining = Math.max(0, ENVIO_GRATIS_DESDE - total);
  const progress = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);
  const [extra, setExtra] = useState<Producto[]>([]);
  const skus = lineas.map((linea) => linea.sku).join(",");

  useEffect(() => {
    if (!abierto || !lineas.length) {
      setExtra([]);
      return;
    }
    const q = consultaComplemento(lineas);
    let vivo = true;
    void fetchCatalogo({ q, limit: 12 })
      .then((data) => {
        if (vivo) setExtra(data.productos);
      })
      .catch(() => {
        if (vivo) setExtra([]);
      });
    return () => {
      vivo = false;
    };
  }, [abierto, skus]);

  const recomendaciones = useMemo(() => sugerirComplementos(lineas, extra), [extra, lineas]);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetContent className="flex w-full max-w-md flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <div className="flex items-center justify-between gap-2 pr-8">
            <SheetTitle className="flex items-center gap-2 text-xl uppercase tracking-wide text-primary">
              <IconoCarrito className="size-5" /> Su carrito
            </SheetTitle>
            <span className="text-xs font-semibold text-accent">Ver carrito</span>
          </div>
        </SheetHeader>
        <div className="border-b bg-muted p-4">
          <p className="text-sm font-semibold">
            {remaining > 0 ? (
              <>
                Te faltan <b className="text-primary">{precioMx(remaining)}</b> para envío gratis
              </>
            ) : (
              <span className="flex items-center gap-2 text-success">
                <BadgeCheck className="size-4" /> ¡Tu envío es gratis!
              </span>
            )}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {lineas.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <IconoCarrito className="size-14 text-border" />
              <h3 className="mt-4 text-xl font-bold">Tu carrito está vacío</h3>
              <p className="mt-2 text-sm text-muted-foreground">Encuentra iluminación y material eléctrico para tu proyecto.</p>
              <Button className="mt-5" onClick={() => setAbierto(false)}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {lineas.map((linea) => (
                <div key={`${linea.paqueteId ?? "suelta"}-${linea.sku}`} className="flex gap-3 border-b pb-5">
                  <ProductImage
                    producto={{ nombre: linea.nombre, categoria: "pieza", urlImagen: linea.urlImagen ?? "" }}
                    className="size-20 shrink-0 bg-muted object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold">{linea.nombre}</p>
                    {linea.paqueteTitulo ? <p className="text-[11px] text-muted-foreground">{linea.paqueteTitulo}</p> : null}
                    <b className="mt-1 block text-primary">{precioMx(linea.precio)}</b>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-9 items-center overflow-hidden rounded-md border bg-background">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 rounded-none"
                          onClick={() => cambiarCantidad(linea.sku, linea.paqueteId, linea.cantidad - 1)}
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="size-4" />
                        </Button>
                        <CantidadInput
                          value={linea.cantidad}
                          nombre={linea.nombre}
                          onChange={(n) => cambiarCantidad(linea.sku, linea.paqueteId, n)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 rounded-none"
                          onClick={() => cambiarCantidad(linea.sku, linea.paqueteId, Math.min(999, linea.cantidad + 1))}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-sale"
                        onClick={() => quitar(linea.sku, linea.paqueteId)}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {recomendaciones.length ? (
                <section className="border-t pt-5" aria-label="Podría interesarte">
                  <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-primary">Podría interesarte…</h3>
                  <ProductCarousel
                    label="Podría interesarte"
                    itemClassName="w-[85%] max-w-[280px]"
                    showArrows={recomendaciones.length > 1}
                  >
                    {recomendaciones.map((item) => (
                      <article key={item.sku} className="flex h-full gap-3 rounded-xl border bg-card p-3">
                        <ProductImage
                          producto={item}
                          sprite={Boolean(item.pos)}
                          pos={item.pos}
                          className="size-20 shrink-0 bg-muted object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-3 text-xs font-semibold uppercase leading-snug">{item.nombre}</p>
                          <b className="mt-2 block text-sm text-primary">{precioMx(item.precio)} MXN</b>
                          <Button
                            variant="outline"
                            className="mt-3 h-8 border-accent px-3 text-[11px] font-bold uppercase text-accent hover:bg-accent hover:text-accent-foreground"
                            onClick={() => agregarProducto(item, 1, { abrir: false })}
                          >
                            Añadir al carrito
                          </Button>
                        </div>
                      </article>
                    ))}
                  </ProductCarousel>
                </section>
              ) : null}
            </div>
          )}
        </div>
        {lineas.length > 0 ? (
          <div className="border-t p-5">
            <p className="text-xs text-muted-foreground">Añadir observaciones del pedido</p>
            <p className="mt-2 text-xs text-muted-foreground">Impuestos, descuentos y envío calculados en la pantalla de pago.</p>
            <div className="mt-3 flex justify-between text-lg">
              <span>Subtotal</span>
              <b className="font-display text-primary">{precioMx(total)}</b>
            </div>
            <Button
              className="mt-4 h-12 w-full bg-primary font-bold uppercase tracking-wide"
              onClick={() => {
                window.open(
                  `${WHATSAPP_URL}?text=${encodeURIComponent(
                    `Hola, quiero finalizar este pedido de Eléctrica Dos Hermanos (${piezas} piezas, ${precioMx(total)}).`
                  )}`,
                  "_blank"
                );
              }}
            >
              Pagar · {precioMx(total)}
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
