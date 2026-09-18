import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WHATSAPP_URL } from "@/lib/brand";
import { guiaDeCatalogo } from "@/lib/guia-rapida";

type Props = {
  iluminacion?: boolean;
  q?: string;
  categoria?: string;
};

export function GuiaRapida({ iluminacion, q, categoria }: Props) {
  const guia = guiaDeCatalogo({ iluminacion, q, categoria });
  const whatsapp = `${WHATSAPP_URL}?text=${encodeURIComponent(guia.mensajeWhatsapp)}`;

  return (
    <section className="bg-muted py-14" aria-labelledby={`guia-${guia.id}`}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Guía rápida</span>
          <h2 id={`guia-${guia.id}`} className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">
            {guia.titulo}
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">{guia.descripcion}</p>
          <Button className="mt-6 bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90" asChild>
            <a href={whatsapp} target="_blank" rel="noreferrer">
              Pedir asesoría <ArrowRight />
            </a>
          </Button>
        </div>
        <Accordion key={guia.id} type="single" collapsible className="border-t">
          {guia.preguntas.map((item, index) => (
            <AccordionItem key={item.pregunta} value={`${guia.id}-${index}`}>
              <AccordionTrigger className="py-5 text-base font-bold text-primary">{item.pregunta}</AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">{item.respuesta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
