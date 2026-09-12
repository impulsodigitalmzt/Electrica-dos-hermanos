import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { preguntarAsistente } from "../lib/api";
import { precioMx, sessionId } from "../lib/format";
import type { PaqueteBom, Producto, RespuestaAsistente } from "../types";

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
      setError(err instanceof Error ? err.message : "No se pudo consultar el mostrador.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form ref={box} onSubmit={enviar} className="relative w-full max-w-3xl">
      <div className="flex overflow-hidden rounded-full border border-line bg-white shadow-[0_8px_24px_rgba(16,32,51,0.06)]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (turno || error) setAbierto(true);
          }}
          placeholder="¿Qué ocupas hoy? Contacto dúplex, cinta, acometida de 220…"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-navy outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="m-1 rounded-full bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-soft"
        >
          {cargando ? "Buscando…" : "Preguntar"}
        </button>
      </div>

      {abierto && (turno || error || cargando) ? (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-2xl">
          {cargando ? <p className="text-sm text-neutral-500">El mostrador está revisando anaquel…</p> : null}
          {error ? <p className="text-sm text-orange">{error}</p> : null}
          {turno ? (
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue">
                Asistente de mostrador · {turno.ruta}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy">{turno.respuesta}</p>
              {turno.paquete?.lineas.length ? (
                <PaquetePreview paquete={turno.paquete} onAdd={agregarPaquete} />
              ) : null}
              {turno.productos.length ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {turno.productos.slice(0, 4).map((producto) => (
                    <button
                      key={producto.sku}
                      type="button"
                      onClick={() => agregarProducto(producto)}
                      className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-left hover:bg-sand"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-navy">{producto.nombre}</span>
                        <span className="text-xs text-neutral-500">
                          {precioMx(producto.precio)} · {producto.stock} pza
                        </span>
                      </span>
                      <span className="text-xs font-semibold text-orange">Sumar</span>
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
    <div className="rounded-2xl bg-sand p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-semibold text-navy">{paquete.titulo}</p>
        <button
          type="button"
          onClick={() => onAdd(paquete)}
          className="rounded-full bg-orange px-3 py-1.5 text-xs font-semibold text-white"
        >
          Meter paquete · {precioMx(total)}
        </button>
      </div>
      <ul className="space-y-1 text-sm text-neutral-600">
        {paquete.lineas.map((linea) => (
          <li key={linea.sku}>
            {linea.cantidad} × {linea.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { Producto };
