import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  CircleDollarSign,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { StoreVideo } from "@/components/StoreVideo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/lib/nav";
import { BRANCHES, LOGO_SRC, MAIN_EMAIL, MARCAS_CATALOGO, mapsDirHref, telHref, VIDEOS, WHATSAPP_URL, type Branch } from "@/lib/brand";

export function ScrollingBanner() {
  const frase = "Más de 10,000 productos disponibles  ·  Envío GRATIS en compras mayores a $1,000  ·  Recoge en sucursal Matriz Mazatlán  ·  Asesoría técnica en Culiacán y Los Cabos  ·  ";
  return (
    <section className="overflow-hidden bg-primary py-3 text-primary-foreground" aria-label="Promociones de envío">
      <div className="edh-marquee flex w-max whitespace-nowrap text-sm font-bold uppercase tracking-wide sm:text-base">
        <span className="px-6">{frase.repeat(2)}</span>
        <span className="px-6" aria-hidden>
          {frase.repeat(2)}
        </span>
      </div>
    </section>
  );
}

export function PromoEnvio() {
  return (
    <section className="bg-secondary py-8 text-center text-secondary-foreground">
      <p className="text-xs font-bold uppercase tracking-widest">Envío sin costo</p>
      <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">A partir de $1,000 MXN</h2>
      <p className="mt-2 text-sm">Aplican restricciones según peso, volumen y destino. Recoge también en sucursal.</p>
      <Button className="mt-5 bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
        <AppLink to="/buscar">
          Ver catálogo <ArrowRight />
        </AppLink>
      </Button>
    </section>
  );
}

export function Testimonials() {
  const opiniones = [
    { nombre: "Ing. Ramírez", ciudad: "Mazatlán, Sin.", texto: "Pedí el material de una casa completa y me armaron la lista el mismo día en Matriz." },
    { nombre: "Arq. Beltrán", ciudad: "Culiacán, Sin.", texto: "Buen surtido de Tecnolite y Siemens. Recogí en sucursal sin esperas." },
    { nombre: "Constructora Pacífico", ciudad: "Los Cabos, B.C.S.", texto: "Precios competitivos y envío puntual para la obra. Así se trabaja." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16" aria-labelledby="opiniones">
      <div className="text-center">
        <span className="text-xs font-bold uppercase text-accent">Nuestros clientes opinan</span>
        <h2 id="opiniones" className="mt-2 text-3xl font-extrabold text-primary">
          Confianza de obra en obra
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {opiniones.map((item) => (
          <blockquote key={item.nombre} className="border bg-card p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">“{item.texto}”</p>
            <footer className="mt-5">
              <cite className="not-italic text-sm font-bold text-primary">{item.nombre}</cite>
              <p className="text-xs text-muted-foreground">{item.ciudad}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

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

export function PromoContactosVideo() {
  const video = VIDEOS.promocion;
  return (
    <section className="bg-primary text-primary-foreground" aria-label={video.title}>
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-[260px_1fr] lg:py-16">
        <StoreVideo src={video.src} title={video.title} fit="contain" className="mx-auto h-[380px] w-full max-w-[220px]" />
        <div className="text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary">{video.kicker}</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{video.heading}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/85 lg:mx-0 sm:text-base">{video.text}</p>
          <Button size="lg" className="mt-6 bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90" asChild>
            <AppLink to={video.to}>
              {video.cta} <ArrowRight />
            </AppLink>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SucursalTourVideo() {
  const video = VIDEOS.sucursal;
  return (
    <section className="relative overflow-hidden" aria-label={video.title}>
      <StoreVideo src={video.src} title={video.title} controls={false} className="h-[260px] w-full sm:h-[380px]" />
      <div className="absolute inset-0 flex items-center justify-center bg-primary/50 px-6 text-center">
        <div className="max-w-2xl text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest">{video.kicker}</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{video.heading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90 sm:text-base">{video.text}</p>
          <Button size="lg" className="mt-6 bg-secondary font-bold text-secondary-foreground hover:bg-secondary/90" asChild>
            <AppLink to={video.to}>
              {video.cta} <ArrowRight />
            </AppLink>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Brands() {
  const makita = VIDEOS.makita;
  return (
    <section id="marcas" className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center">
        <span className="text-xs font-bold uppercase text-accent">Aliados de confianza</span>
        <h2 className="mt-2 text-3xl font-extrabold text-primary">Marcas que conectan tus ideas</h2>
      </div>
      <div className="mt-10 grid items-center gap-6 overflow-hidden border bg-card lg:grid-cols-2">
        <StoreVideo src={makita.src} title={makita.title} className="aspect-video w-full" />
        <div className="px-6 py-8 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">{makita.kicker}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">{makita.heading}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{makita.text}</p>
          <Button className="mt-6 font-bold" asChild>
            <AppLink to={makita.to}>
              {makita.cta} <ArrowRight />
            </AppLink>
          </Button>
        </div>
      </div>
      <div className="mt-9 grid grid-cols-2 border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {MARCAS_CATALOGO.map((brand) => (
          <AppLink
            key={brand.label}
            to={`/buscar?q=${encodeURIComponent(brand.q)}`}
            className="flex h-24 items-center justify-center border-b border-r bg-background px-4 grayscale transition hover:bg-muted hover:grayscale-0"
            aria-label={`Ver productos ${brand.label}`}
          >
            <img src={brand.logo} alt={brand.label} className="max-h-12 w-full object-contain" />
          </AppLink>
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

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-muted/70 px-4 py-3.5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-secondary shadow-sm">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-semibold leading-relaxed text-primary sm:text-base">{children}</div>
      </div>
    </div>
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
      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border bg-black shadow-sm">
        <StoreVideo src={VIDEOS.marca.src} title={VIDEOS.marca.title} className="aspect-video w-full" />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
        <div className="flex flex-col gap-3">
          {BRANCHES.map((item) => {
            const selected = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                aria-pressed={selected}
                className={`group flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left shadow-sm transition duration-200 ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-secondary/80"
                    : "border border-border/80 bg-card text-primary hover:-translate-y-0.5 hover:border-primary/25 hover:bg-muted hover:shadow-md"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-secondary text-secondary-foreground" : "bg-muted text-secondary"
                    }`}
                  >
                    <MapPin className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-extrabold sm:text-base">{item.name}</span>
                    <span className={`mt-0.5 block text-xs font-medium ${selected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                      {item.city}
                    </span>
                  </span>
                </span>
                <ArrowRight className={`size-4 shrink-0 transition ${selected ? "text-secondary" : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary"}`} />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm sm:p-8">
            <p className="inline-flex rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-foreground">
              {branch.city}
            </p>
            <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight text-primary sm:text-3xl">{branch.name}</h3>
            <div className="mt-6 flex flex-col gap-3">
              <ContactRow icon={MapPin} label="Dirección">
                {branch.address}
              </ContactRow>
              <ContactRow icon={Phone} label="Teléfonos">
                <div className="flex flex-col gap-1">
                  {branch.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)} className="hover:text-accent hover:underline">
                      {phone}
                    </a>
                  ))}
                </div>
              </ContactRow>
              <ContactRow icon={Mail} label="Correo">
                <a href={`mailto:${branch.email}`} className="break-all hover:text-accent hover:underline">
                  {branch.email}
                </a>
              </ContactRow>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Button asChild className="h-12 rounded-xl bg-secondary font-bold text-secondary-foreground shadow-sm hover:bg-secondary/90">
                <a href={mapsDirHref(branch.address)} target="_blank" rel="noreferrer">
                  <Navigation /> Cómo llegar
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl border-primary/20 bg-background font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                <a href={telHref(branch.phones[0] ?? "6699407077")}>
                  <Phone /> Llamar
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl border-primary/20 bg-background font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                <a href={`mailto:${branch.email}`}>
                  <Mail /> Cotizar
                </a>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border/70 shadow-lg">
            <iframe
              key={branch.id}
              title={`Ubicación de ${branch.name}`}
              src={branch.mapEmbed}
              className="h-[240px] w-full border-0 sm:h-[300px] lg:h-[340px]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
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
          Eléctrica dos Hermanos S.A. de C.V., con domicilio en División del Nte. 1900, Francisco Villa, 82127 Mazatlán,
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
