import { logoDeMarca } from "@/lib/brand";

type Props = {
  nombre?: string;
  marca: string;
  className?: string;
  showName?: boolean;
};

export function BrandLogo({ nombre = "", marca, className = "h-6", showName = false }: Props) {
  const logo = logoDeMarca(nombre, marca);
  if (!logo) {
    return <span className="text-[11px] font-bold uppercase text-accent">{marca}</span>;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <img src={logo} alt={marca} className={`w-auto object-contain ${className}`} />
      {showName ? <span className="text-[11px] font-bold uppercase text-accent">{marca}</span> : null}
    </span>
  );
}
