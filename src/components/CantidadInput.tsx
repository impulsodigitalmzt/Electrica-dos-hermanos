import { useEffect, useState } from "react";

type Props = {
  value: number;
  onChange: (n: number) => void;
  nombre?: string;
  min?: number;
  max?: number;
  className?: string;
};

/** Campo de cantidad editable (teclado / borrar / escribir). */
export function CantidadInput({
  value,
  onChange,
  nombre = "producto",
  min = 1,
  max = 999,
  className = "h-full min-w-12 flex-1 border-x bg-transparent text-center text-base font-semibold text-foreground outline-none",
}: Props) {
  const [texto, setTexto] = useState(String(value));

  useEffect(() => {
    setTexto(String(value));
  }, [value]);

  function aplicar(crudo: string) {
    const digits = crudo.replace(/\D/g, "");
    if (digits === "") {
      setTexto("");
      return;
    }
    const n = Math.min(max, Math.max(min, Number.parseInt(digits, 10)));
    setTexto(String(n));
    onChange(n);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={texto}
      aria-label={`Cantidad de ${nombre}`}
      onChange={(e) => aplicar(e.target.value)}
      onBlur={() => {
        if (texto.trim() === "" || Number(texto) < min) {
          setTexto(String(min));
          onChange(min);
        }
      }}
      onFocus={(e) => e.target.select()}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className={className}
    />
  );
}
