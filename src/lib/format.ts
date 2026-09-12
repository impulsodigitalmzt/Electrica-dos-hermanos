export function precioMx(valor: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(valor);
}

export function etiquetaCategoria(categoria: string): string {
  const mapa: Record<string, string> = {
    electricidad: "Electricidad",
    ferreteria: "Ferretería",
    plomeria: "Plomería",
    otro: "Más materiales",
  };
  return mapa[categoria.toLowerCase()] ?? categoria;
}

export function sessionId(): string {
  const key = "edh-session";
  const actual = localStorage.getItem(key);
  if (actual) return actual;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}
