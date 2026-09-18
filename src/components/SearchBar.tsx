import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, LoaderCircle, Mic, Search, X } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/context/CartContext";
import { buscarPorImagen, compactarImagen, fetchCatalogo, preguntarAsistente } from "@/lib/api";
import { precioMx, sessionId } from "@/lib/format";
import { navigate } from "@/lib/nav";
import type { PaqueteBom, Producto, RespuestaAsistente } from "@/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPath?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "¿Qué estás buscando?",
  searchPath = "/buscar",
}: Props) {
  const { lineas, agregarProducto, agregarPaquete, sincronizar } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [turno, setTurno] = useState<RespuestaAsistente | null>(null);
  const [cargando, setCargando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [leyendoFoto, setLeyendoFoto] = useState(false);
  const [error, setError] = useState("");
  const box = useRef<HTMLFormElement>(null);
  const foto = useRef<HTMLInputElement>(null);
  const reconocimiento = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const onDoc = (ev: MouseEvent) => {
      if (box.current && !box.current.contains(ev.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 2) {
      setSugerencias([]);
      return;
    }
    const handle = window.setTimeout(() => {
      void fetchCatalogo({ q, limit: 5 })
        .then((data) => setSugerencias(data.productos))
        .catch(() => setSugerencias([]));
    }, 180);
    return () => window.clearTimeout(handle);
  }, [value]);

  function irABuscar(q: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    navigate(`${searchPath}${params.toString() ? `?${params}` : ""}`);
    setAbierto(false);
  }

  async function enviar(event?: FormEvent) {
    event?.preventDefault();
    const mensaje = value.trim();
    irABuscar(mensaje);
    if (!mensaje) return;
    const pareceFrase = mensaje.split(/\s+/).length >= 4;
    if (!pareceFrase) return;
    setCargando(true);
    setError("");
    setAbierto(true);
    try {
      const data = await preguntarAsistente(mensaje, sessionId(), lineas);
      setTurno(data);
      if (data.pedido?.length) sincronizar(data.pedido);
    } catch (err) {
      setError(err instanceof Error ? err.message : "El mostrador no pudo responder.");
    } finally {
      setCargando(false);
    }
  }

  function hablar() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Tu navegador no admite búsqueda por voz.");
      setAbierto(true);
      return;
    }
    reconocimiento.current?.stop();
    const rec = new Ctor();
    rec.lang = "es-MX";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      const texto = String(event.results[0]?.[0]?.transcript ?? "").trim();
      if (!texto) return;
      onChange(texto);
      irABuscar(texto);
    };
    rec.onerror = () => setEscuchando(false);
    rec.onend = () => setEscuchando(false);
    reconocimiento.current = rec;
    setError("");
    setEscuchando(true);
    rec.start();
  }

  async function onFoto(file: File | undefined) {
    if (!file) return;
    setLeyendoFoto(true);
    setError("");
    setAbierto(true);
    try {
      const image = await compactarImagen(file);
      const data = await buscarPorImagen(image);
      onChange(data.q);
      setSugerencias(data.productos.slice(0, 5));
      irABuscar(data.q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer la foto.");
    } finally {
      setLeyendoFoto(false);
      if (foto.current) foto.current.value = "";
    }
  }

  const mostrarPanel = abierto && (sugerencias.length > 0 || turno || error || cargando || leyendoFoto);

  return (
    <form ref={box} onSubmit={enviar} className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        aria-label="Buscar productos"
        placeholder={placeholder}
        className="h-11 w-full rounded-sm border bg-muted/40 pl-12 pr-28 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
        {value ? (
          <button type="button" aria-label="Limpiar búsqueda" onClick={() => onChange("")} className="p-1.5 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        ) : null}
        <button
          type="button"
          aria-label={escuchando ? "Detener voz" : "Buscar por voz"}
          onClick={hablar}
          className={`p-1.5 ${escuchando ? "text-sale" : "text-muted-foreground hover:text-primary"}`}
        >
          <Mic className="size-4" />
        </button>
        <button type="button" aria-label="Buscar por foto" onClick={() => foto.current?.click()} className="p-1.5 text-muted-foreground hover:text-primary">
          {leyendoFoto ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
        </button>
        <input
          ref={foto}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void onFoto(e.target.files?.[0])}
        />
      </div>

      {mostrarPanel ? (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-[70vh] overflow-y-auto border bg-background p-2 shadow-xl">
          {cargando || leyendoFoto ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {leyendoFoto ? "Revisando la foto en el anaquel…" : "El mostrador está revisando anaquel…"}
            </p>
          ) : null}
          {error ? <p className="px-2 py-2 text-sm text-sale">{error}</p> : null}
          {sugerencias.map((item) => (
            <button
              key={item.sku}
              type="button"
              onClick={() => {
                setAbierto(false);
                navigate(`/producto/${encodeURIComponent(item.sku)}`);
              }}
              className="flex w-full items-center gap-3 p-2 text-left hover:bg-muted"
            >
              <ProductImage producto={item} className="size-12 shrink-0 object-contain bg-muted" />
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm">{item.nombre}</strong>
                <span className="text-xs text-muted-foreground">{item.categoria}</span>
              </span>
              <b className="text-sm text-primary">{precioMx(item.precio)}</b>
            </button>
          ))}
          {turno ? (
            <div className="mt-2 space-y-3 border-t p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Asesor de mostrador</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{turno.respuesta}</p>
              {turno.paquete?.lineas.length ? <PaquetePreview paquete={turno.paquete} onAdd={agregarPaquete} /> : null}
              {turno.productos.slice(0, 4).map((producto) => (
                <button
                  key={producto.sku}
                  type="button"
                  onClick={() => agregarProducto(producto)}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{producto.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {precioMx(producto.precio)} · {producto.stock} pza
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-accent">Añadir</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

function PaquetePreview({ paquete, onAdd }: { paquete: PaqueteBom; onAdd: (p: PaqueteBom) => void }) {
  const total = paquete.lineas.reduce((acc, l) => acc + l.precio * l.cantidad, 0);
  return (
    <div className="rounded-md bg-muted p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-semibold">{paquete.titulo}</p>
        <button type="button" onClick={() => onAdd(paquete)} className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          Meter paquete · {precioMx(total)}
        </button>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {paquete.lineas.map((linea) => (
          <li key={linea.sku}>
            {linea.cantidad} × {linea.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
