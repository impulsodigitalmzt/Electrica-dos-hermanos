import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { preguntarAsistente } from "../lib/api";
import { precioMx, sessionId } from "../lib/format";
import { IconSearch } from "../lib/icons";
import type { PaqueteBom, RespuestaAsistente } from "../types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFilter: (value: string) => void;
};

export function SearchBar({ value, onChange, onFilter }: Props) {
  const { lineas, agregarProducto, agregarPaquete, sincronizar } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [turno, setTurno] = useState<RespuestaAsistente | null>(null);
  const box = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onDoc = (ev: MouseEvent) => {
      if (box.current && !box.current.contains(ev.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function enviar(event?: FormEvent) {
    event?.preventDefault();
    const mensaje = value.trim();
    onFilter(mensaje);
    if (!mensaje) return;
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

  return (
    <form ref={box} onSubmit={enviar} className="relative w-full max-w-xl">
      <div className="flex h-10 items-center rounded-md border border-border bg-muted px-3">
        <IconSearch className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (turno || error) setAbierto(true);
          }}
          placeholder="Busca un producto o descríbele el trabajo al mostrador"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" className="text-xs font-semibold text-primary hover:text-navy-soft">
          {cargando ? "…" : "Buscar"}
        </button>
      </div>

      {abierto && (turno || error || cargando) ? (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-xl">
          {cargando ? <p className="text-sm text-muted-foreground">El mostrador está revisando anaquel…</p> : null}
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          {turno ? (
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Asesor de mostrador</p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{turno.respuesta}</p>
              {turno.paquete?.lineas.length ? <PaquetePreview paquete={turno.paquete} onAdd={agregarPaquete} /> : null}
              {turno.productos.length ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {turno.productos.slice(0, 4).map((producto) => (
                    <button
                      key={producto.sku}
                      type="button"
                      onClick={() => agregarProducto(producto)}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:bg-muted"
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
        <button
          type="button"
          onClick={() => onAdd(paquete)}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
        >
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
