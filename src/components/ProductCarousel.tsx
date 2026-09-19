import { Children, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  label?: string;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
};

/**
 * Carrusel horizontal con scroll nativo (dedo) y arrastre con mouse.
 */
export function ProductCarousel({
  children,
  label = "Carrusel de productos",
  className = "",
  itemClassName = "w-[68%] max-w-[260px] sm:w-[46%] sm:max-w-none md:w-[38%] lg:w-[28%]",
  showArrows = true,
}: Props) {
  const pista = useRef<HTMLDivElement>(null);
  const arrastre = useRef({ activo: false, inicioX: 0, scroll: 0, movido: false });
  const [arrastrando, setArrastrando] = useState(false);

  function desplazar(dir: -1 | 1) {
    const el = pista.current;
    if (!el) return;
    const paso = Math.max(220, Math.floor(el.clientWidth * 0.72));
    el.scrollBy({ left: dir * paso, behavior: "smooth" });
  }

  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    const el = pista.current;
    if (!el || e.button !== 0) return;
    arrastre.current = { activo: true, inicioX: e.pageX, scroll: el.scrollLeft, movido: false };
    setArrastrando(true);
  }

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = pista.current;
    const d = arrastre.current;
    if (!el || !d.activo) return;
    e.preventDefault();
    const delta = e.pageX - d.inicioX;
    if (Math.abs(delta) > 4) d.movido = true;
    el.scrollLeft = d.scroll - delta;
  }

  function finArrastre() {
    arrastre.current.activo = false;
    setArrastrando(false);
    window.setTimeout(() => {
      arrastre.current.movido = false;
    }, 40);
  }

  function bloquearClickSiArrastro(e: MouseEvent) {
    if (arrastre.current.movido) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <div className={`relative ${className}`}>
      {showArrows ? (
        <div className="mb-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-full"
            aria-label="Anterior"
            onClick={() => desplazar(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-full"
            aria-label="Siguiente"
            onClick={() => desplazar(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}

      <div
        ref={pista}
        role="list"
        aria-label={label}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={finArrastre}
        onMouseLeave={finArrastre}
        onClickCapture={bloquearClickSiArrastro}
        className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x ${
          arrastrando ? "cursor-grabbing select-none" : "cursor-grab"
        } [&::-webkit-scrollbar]:hidden`}
      >
        {Children.map(children, (child, index) => (
          <div key={index} role="listitem" className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
