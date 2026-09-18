import { ArrowRight, BadgeCheck, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { ENVIO_GRATIS_DESDE, WHATSAPP_URL } from "@/lib/brand";
import { precioMx } from "@/lib/format";

export function CartDrawer() {
  const { abierto, setAbierto, lineas, cambiarCantidad, quitar, piezas, total } = useCart();
  const remaining = Math.max(0, ENVIO_GRATIS_DESDE - total);
  const progress = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetContent className="flex w-full max-w-md flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle className="flex items-center gap-2 text-xl text-primary">
            <ShoppingCart /> Tu carrito <span className="text-sm font-normal text-muted-foreground">({piezas})</span>
          </SheetTitle>
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
              <ShoppingCart className="size-14 text-border" />
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
                      <div className="flex h-8 items-center border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => cambiarCantidad(linea.sku, linea.paqueteId, linea.cantidad - 1)}
                          aria-label="Reducir cantidad"
                        >
                          <Minus />
                        </Button>
                        <span className="w-7 text-center text-sm">{linea.cantidad}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => cambiarCantidad(linea.sku, linea.paqueteId, linea.cantidad + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <Button
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
            </div>
          )}
        </div>
        {lineas.length > 0 ? (
          <div className="border-t p-5">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <b className="font-display text-primary">{precioMx(total)}</b>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Impuestos incluidos. Envío calculado al finalizar.</p>
            <Button
              className="mt-4 h-12 w-full bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90"
              onClick={() => {
                window.open(
                  `${WHATSAPP_URL}?text=${encodeURIComponent(
                    `Hola, quiero finalizar este pedido de Eléctrica Dos Hermanos (${piezas} piezas, ${precioMx(total)}).`
                  )}`,
                  "_blank"
                );
              }}
            >
              Finalizar compra <ArrowRight />
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
