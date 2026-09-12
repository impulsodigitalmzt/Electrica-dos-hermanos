import { useCart } from "../context/CartContext";
import { SearchBar } from "./SearchBar";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onFilter: (value: string) => void;
};

export function Header({ query, onQueryChange, onFilter }: Props) {
  const { piezas, setAbierto } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy text-center text-[12px] font-medium tracking-wide text-[#ead7ba]">
        Eléctrica Dos Hermanos · material eléctrico, ferretería y plomería · cuenta abierta de mostrador
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 md:px-6">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Eléctrica Dos Hermanos" className="h-14 w-auto md:h-16" />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-blue">Eléctrica</span>
            <span className="block text-sm font-bold text-orange">Dos Hermanos</span>
          </span>
        </a>
        <SearchBar value={query} onChange={onQueryChange} onFilter={onFilter} />
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="relative rounded-full border border-line px-3 py-2 text-sm font-semibold text-navy hover:bg-sand"
        >
          Cuenta
          {piezas > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] text-white">
              {piezas}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
