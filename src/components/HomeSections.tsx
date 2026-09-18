import { useState } from "react";
import {
  ArrowRight,
  CircleDollarSign,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BRANCHES, LOGO_SRC, MAIN_EMAIL, MARCAS, telHref, WHATSAPP_URL, type Branch } from "@/lib/brand";
import { AppLink } from "@/lib/nav";

export function TrustBar() {
  const benefits = [
    { icon: Truck, title: "Envío seguro", text: "Cobertura en todo México y rastreo de tu pedido." },
    { icon: Headphones, title: "Asesoría técnica", text: "Expertos listos para ayudarte a elegir." },
    { icon: ShieldCheck, title: "Compra con garantía", text: "Productos originales y pagos protegidos." },
  ];
  return (
    <section className="bg-primary py-10 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center border border-primary-foreground/30 text-secondary">
              <Icon className="size-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-primary-foreground/70">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Brands() {
  return (
    <section id="marcas" className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <span className="text-xs font-bold uppercase text-accent">Aliados de confianza</span>
        <h2 className="mt-2 text-3xl font-extrabold text-primary">Marcas que conectan tus ideas</h2>
      </div>
      <div className="mt-9 grid grid-cols-2 border-y sm:grid-cols-4 lg:grid-cols-7">
        {MARCAS.map((brand) => (
          <div
            key={brand}
            className="flex h-24 items-center justify-center border-r font-display text-lg font-extrabold text-muted-foreground grayscale transition hover:text-primary hover:grayscale-0"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  ["¿Cuándo obtengo envío gratis?", "En compras mayores a $1,000 MXN. Aplican restricciones según peso, volumen y destino."],
  ["¿Cómo puedo dar seguimiento a mi pedido?", "Al confirmar tu compra recibirás una guía de rastreo en tu correo electrónico."],
  ["¿Los productos tienen garantía?", "Sí. Todos nuestros productos cuentan con garantía de fabricante; el plazo depende de cada marca."],
  ["¿Puedo recibir asesoría para mi proyecto?", "Claro. Nuestro equipo técnico te ayuda de lunes a viernes de 8:30 a 19:00 y sábados de 8:30 a 14:00."],
] as const;

export function Faq() {
  return (
    <section id="faq" className="bg-muted py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-xs font-bold uppercase text-accent">Estamos para ayudarte</span>
          <h2 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">Preguntas frecuentes</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Resolvemos las dudas más comunes antes de tu compra. También puedes hablar con un asesor.
          </p>
          <Button variant="outline" className="mt-6 border-primary text-primary" asChild>
            <a href={WHATSAPP_URL}>
              <MessageCircle /> Hablar por WhatsApp
            </a>
          </Button>
        </div>
        <Accordion type="single" collapsible className="border-t">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={`faq-${i}`}>
              <AccordionTrigger className="py-5 text-base font-bold text-primary">{q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Sucursales() {
  const first = BRANCHES[0];
  const [active, setActive] = useState(first.id);
  const branch: Branch = BRANCHES.find((item) => item.id === active) ?? first;
  return (
    <section id="sucursales" className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <span className="text-xs font-bold uppercase text-accent">Estamos cerca de ti</span>
        <h2 className="mt-2 text-3xl font-extrabold text-primary sm:text-4xl">Nuestras sucursales</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Material eléctrico en alta y baja tensión, ferretería y plomería en Mazatlán, Culiacán, San José del Cabo y Cabo San
          Lucas, con envíos a todo México.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col border-t">
          {BRANCHES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              aria-pressed={item.id === active}
              className={`flex items-center justify-between gap-3 border-b px-4 py-4 text-left font-bold transition ${
                item.id === active ? "bg-primary text-primary-foreground" : "text-primary hover:bg-muted"
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" /> {item.name}
              </span>
              <ArrowRight className="size-4 shrink-0" />
            </button>
          ))}
        </div>
        <div className="border bg-muted p-6 sm:p-8">
          <h3 className="font-display text-2xl font-extrabold text-primary">{branch.name}</h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-accent">{branch.city}</p>
          <p className="mt-5 flex gap-3 text-muted-foreground">
            <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" /> {branch.address}
          </p>
          <div className="mt-4 flex gap-3">
            <Phone className="mt-0.5 size-5 shrink-0 text-secondary" />
            <div className="flex flex-col">
              {branch.phones.map((phone) => (
                <a key={phone} href={telHref(phone)} className="font-semibold text-primary hover:underline">
                  {phone}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-4 flex gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-secondary" />
            <a href={`mailto:${branch.email}`} className="break-all font-semibold text-primary hover:underline">
              {branch.email}
            </a>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90">
              <a href={telHref(branch.phones[0] ?? "6699407077")}>
                <Phone /> Llamar
              </a>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary">
              <a href={`mailto:${branch.email}`}>
                <Mail /> Cotizar
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PrivacyNotice() {
  return (
    <section id="aviso-privacidad" className="border-t bg-background py-12">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-extrabold text-primary">Aviso de privacidad</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Eléctrica dos Hermanos S.A. de C.V., con domicilio en División Norte 1900, Col. Francisco Villa, CP 82127, Mazatlán,
          Sin., utiliza tus datos personales únicamente para atender cotizaciones, pedidos, facturación y envíos. No compartimos
          tu información con terceros ajenos a estos fines. Para ejercer tus derechos ARCO escríbenos a{" "}
          <a className="font-semibold text-primary hover:underline" href={`mailto:${MAIN_EMAIL}`}>
            {MAIN_EMAIL}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center bg-background p-1">
              <img src={LOGO_SRC} alt="Eléctrica dos Hermanos" className="h-16 w-auto object-contain" />
            </span>
            <span className="font-display text-lg font-extrabold leading-tight">
              Eléctrica
              <br />
              dos Hermanos
            </span>
          </div>
          <p className="mt-4 text-sm font-semibold text-primary-foreground/80">Eléctrica dos Hermanos S.A. de C.V.</p>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
            Material eléctrico en alta y baja tensión, ferretería y plomería para su hogar o negocio.
          </p>
          <div className="mt-5 flex gap-2">
            <Button size="icon" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle />
              </a>
            </Button>
            <Button size="icon" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground" asChild>
              <a href={`mailto:${MAIN_EMAIL}`} aria-label="Correo">
                <Mail />
              </a>
            </Button>
            <Button size="icon" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground" asChild>
              <a href={telHref("6699407077")} aria-label="Teléfono">
                <Phone />
              </a>
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-secondary">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li>
              <a className="hover:text-primary-foreground" href={telHref("6699407077")}>
                Tel. (669) 940-7077
              </a>
            </li>
            <li>
              <a className="hover:text-primary-foreground" href={telHref("6699407088")}>
                Tel. (669) 940-7088
              </a>
            </li>
            <li>
              <a className="break-all hover:text-primary-foreground" href={`mailto:${MAIN_EMAIL}`}>
                {MAIN_EMAIL}
              </a>
            </li>
            <li>
              <a className="hover:text-primary-foreground" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                WhatsApp (669) 940-7077
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold text-secondary">Sucursales</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            {BRANCHES.map((branch) => (
              <li key={branch.id}>
                <a href="#sucursales" className="hover:text-primary-foreground">
                  {branch.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold text-secondary">Información</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li>
              <a href="#faq" className="hover:text-primary-foreground">
                Preguntas frecuentes
              </a>
            </li>
            <li>
              <a href="#sucursales" className="hover:text-primary-foreground">
                Cobertura y envíos
              </a>
            </li>
            <li>
              <a href={`mailto:${MAIN_EMAIL}`} className="hover:text-primary-foreground">
                Contacto directo
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-primary-foreground">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="#aviso-privacidad" className="hover:text-primary-foreground">
                Aviso de privacidad
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:justify-between">
          <span>© 2026 Eléctrica dos Hermanos S.A. de C.V. Todos los derechos reservados.</span>
          <span>Visa · Mastercard · American Express · PayPal</span>
        </div>
      </div>
    </footer>
  );
}

export function PreFooterLeyenda() {
  const items = [
    { icon: MessageCircle, title: "Conoce nuestro centro de atención", text: "Atención y servicio" },
    { icon: Package, title: "Entregas confiables", text: "Actualización y seguimiento de tu envío" },
    { icon: Truck, title: "Envíos", text: "Seguridad de tus envíos" },
    { icon: CircleDollarSign, title: "Precios competitivos", text: "Buscamos los mejores proveedores" },
  ];

  return (
    <div className="bg-background">
      <section className="border-y" aria-label="Beneficios de compra">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 text-primary">
              <Icon className="mt-0.5 size-8 shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-bold leading-snug">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="py-5 text-center">
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Volver al principio
        </button>
      </div>
    </div>
  );
}

export function CompactFooter() {
  return (
    <footer className="bg-primary py-8 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span>Eléctrica dos Hermanos S.A. de C.V. · Iluminación LED con envíos a todo México.</span>
        <AppLink to="/" className="font-bold text-secondary hover:underline">
          Volver al inicio
        </AppLink>
      </div>
    </footer>
  );
}
