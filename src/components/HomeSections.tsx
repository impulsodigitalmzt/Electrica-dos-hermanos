import { useState } from "react";
import { ESPACIOS, MARCAS, SUCURSALES } from "../lib/format";
import { IconHeadset, IconMail, IconPackage, IconPhone, IconPin, IconShield, IconWhatsApp } from "../lib/icons";

type FilterFn = (q: string) => void;

export function Hero({ onFilter }: { onFilter: FilterFn }) {
  return (
    <section id="inicio" className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-2 md:px-6">
      <article className="relative min-h-[340px] overflow-hidden rounded-lg text-white md:min-h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1400&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
          <p className="text-sm font-semibold text-secondary">Eléctrica Dos Hermanos ilumina tu hogar</p>
          <h1 className="mt-2 max-w-md text-4xl font-bold leading-tight md:text-5xl">La primavera se ilumina</h1>
          <p className="mt-3 max-w-md text-sm text-white/85">
            Luminarias decorativas para transformar tu hogar, oficina y cada espacio que imaginas.
          </p>
          <button
            type="button"
            onClick={() => onFilter("foco led lampara")}
            className="mt-5 w-fit rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Comprar iluminación
          </button>
        </div>
      </article>

      <article className="relative min-h-[340px] overflow-hidden rounded-lg text-white md:min-h-[420px]">
        <img
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1400&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">E2H · Soluciones profesionales</p>
          <h2 className="mt-2 max-w-md text-3xl font-bold leading-tight md:text-4xl">Potencia cada proyecto</h2>
          <p className="mt-3 max-w-md text-sm text-white/85">
            Iluminación LED y material eléctrico confiable para instalaciones industriales de cualquier escala.
          </p>
          <button
            type="button"
            onClick={() => onFilter("")}
            className="mt-5 w-fit rounded-md border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur hover:bg-white/20"
          >
            Ver soluciones
          </button>
        </div>
      </article>
    </section>
  );
}

export function CategoryExplorer({ onFilter }: { onFilter: FilterFn }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Explora por espacio</p>
          <h2 className="mt-1 text-3xl font-bold">Encuentra justo lo que necesitas</h2>
        </div>
        <button type="button" onClick={() => onFilter("")} className="text-sm font-semibold text-primary hover:underline">
          Ver todas las categorías
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {ESPACIOS.map((espacio) => (
          <button
            key={espacio.id}
            type="button"
            onClick={() => onFilter(espacio.q)}
            className="group overflow-hidden rounded-md border border-border bg-card text-left shadow-sm"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={espacio.imagen}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <p className="px-3 py-3 text-sm font-semibold">{espacio.label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: IconPackage, title: "Envío seguro", copy: "Cobertura en todo México y rastreo de tu pedido." },
    { icon: IconHeadset, title: "Asesoría técnica", copy: "Expertos listos para ayudarte a elegir." },
    { icon: IconShield, title: "Compra con garantía", copy: "Productos originales y pagos protegidos." },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
        {items.map((item) => (
          <div key={item.title} className="flex gap-4">
            <item.icon className="size-7 shrink-0 text-primary" />
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Brands() {
  return (
    <section id="marcas" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Aliados de confianza</p>
      <h2 className="mt-1 text-3xl font-bold">Marcas que conectan tus ideas</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {MARCAS.map((marca) => (
          <div
            key={marca}
            className="flex h-20 items-center justify-center rounded-md border border-border bg-card text-sm font-bold tracking-wide text-muted-foreground"
          >
            {marca}
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "¿Cuándo obtengo envío gratis?",
    a: "En pedidos mayores a $2,500 MXN con entrega en Mazatlán, Culiacán y Los Cabos el envío no tiene costo. Al resto de México aplicamos tarifa preferencial según destino y peso.",
  },
  {
    q: "¿Cómo puedo dar seguimiento a mi pedido?",
    a: "Al confirmar tu compra te enviamos el número de guía por WhatsApp o correo. También puedes escribirnos a cotizaciones.mzt@electricadoshermanos.com.",
  },
  {
    q: "¿Los productos tienen garantía?",
    a: "Sí. Trabajamos marcas originales y respaldamos cada pieza contra defectos de fábrica. La cobertura varía según el fabricante.",
  },
  {
    q: "¿Puedo recibir asesoría para mi proyecto?",
    a: "Sí. Describe el trabajo en el buscador o escríbenos por WhatsApp. El mostrador arma la lista de materiales con existencias reales.",
  },
];

export function Faq() {
  const [abierta, setAbierta] = useState(0);
  return (
    <section id="faq" className="scroll-mt-28 bg-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Estamos para ayudarte</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
          <a
            href="https://wa.me/526699407077"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <IconWhatsApp /> Hablar por WhatsApp
          </a>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Resolvemos las dudas más comunes antes de tu compra. También puedes hablar con un asesor.
        </p>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setAbierta(abierta === i ? -1 : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold"
              >
                {item.q}
                <span className="text-xl text-primary">{abierta === i ? "−" : "+"}</span>
              </button>
              {abierta === i ? <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Sucursales() {
  const [activa, setActiva] = useState<(typeof SUCURSALES)[number]["id"]>(SUCURSALES[0].id);
  const sucursal = SUCURSALES.find((s) => s.id === activa) ?? SUCURSALES[0];
  return (
    <section id="sucursales" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-14 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Estamos cerca de ti</p>
      <h2 className="mt-1 text-3xl font-bold">Nuestras sucursales</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Material eléctrico en alta y baja tensión, ferretería y plomería en Mazatlán, Culiacán, San José del Cabo y Cabo
        San Lucas, con envíos a todo México.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {SUCURSALES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiva(item.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
              activa === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {item.titulo}
          </button>
        ))}
      </div>
      <article className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-bold">{sucursal.titulo}</h3>
        <p className="text-sm text-muted-foreground">{sucursal.ciudad}</p>
        <p className="mt-3 flex items-start gap-2 text-sm">
          <IconPin className="mt-0.5 text-primary" /> {sucursal.direccion}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {sucursal.tels.map((tel) => (
            <a key={tel} href={`tel:${tel.replace(/\D/g, "")}`} className="inline-flex items-center gap-1 hover:text-primary">
              <IconPhone className="text-primary" /> {tel}
            </a>
          ))}
        </div>
        <a href={`mailto:${sucursal.email}`} className="mt-2 inline-flex items-center gap-2 text-sm hover:text-primary">
          <IconMail className="text-primary" /> {sucursal.email}
        </a>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`tel:${sucursal.tels[0].replace(/\D/g, "")}`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Llamar
          </a>
          <a
            href={`mailto:${sucursal.email}`}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Cotizar
          </a>
        </div>
      </article>
    </section>
  );
}

export function PrivacyNotice() {
  return (
    <section id="aviso" className="scroll-mt-28 bg-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-bold">Aviso de privacidad</h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
          Eléctrica dos Hermanos S.A. de C.V., con domicilio en División Norte 1900, Col. Francisco Villa, CP 82127,
          Mazatlán, Sin., utiliza tus datos personales únicamente para atender cotizaciones, pedidos, facturación y
          envíos. No compartimos tu información con terceros ajenos a estos fines. Para ejercer tus derechos ARCO
          escríbenos a cotizaciones.mzt@electricadoshermanos.com.
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-md bg-white p-1">
              <img src="/logo.png" alt="" className="h-11 w-auto" />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-bold">Eléctrica</span>
              <span className="block text-lg font-bold text-secondary">dos Hermanos</span>
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold">Eléctrica dos Hermanos S.A. de C.V.</p>
          <p className="mt-2 text-sm text-primary-foreground/75">
            Material eléctrico en alta y baja tensión, ferretería y plomería para su hogar o negocio.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Contacto</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a href="tel:+526699407077">Tel. (669) 940-7077</a>
            </li>
            <li>
              <a href="tel:+526699407088">Tel. (669) 940-7088</a>
            </li>
            <li>
              <a href="mailto:cotizaciones.mzt@electricadoshermanos.com">cotizaciones.mzt@electricadoshermanos.com</a>
            </li>
            <li>
              <a href="https://wa.me/526699407077">WhatsApp (669) 940-7077</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Sucursales</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {SUCURSALES.map((s) => (
              <li key={s.id}>
                <a href="#sucursales">{s.titulo}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">Información</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <a href="#faq">Preguntas frecuentes</a>
            </li>
            <li>
              <a href="#sucursales">Cobertura y envíos</a>
            </li>
            <li>
              <a href="mailto:cotizaciones.mzt@electricadoshermanos.com">Contacto directo</a>
            </li>
            <li>
              <a href="https://wa.me/526699407077">WhatsApp</a>
            </li>
            <li>
              <a href="#aviso">Aviso de privacidad</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-primary-foreground/70 md:px-6">
          <p>© 2026 Eléctrica dos Hermanos S.A. de C.V. Todos los derechos reservados.</p>
          <p>Visa · Mastercard · American Express · PayPal</p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/526699407077"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105"
      aria-label="WhatsApp Eléctrica Dos Hermanos"
    >
      <IconWhatsApp className="size-7" />
    </a>
  );
}
