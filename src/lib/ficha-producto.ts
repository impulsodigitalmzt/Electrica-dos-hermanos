import { marcaDe } from "@/lib/brand";
import { etiquetaCategoria } from "@/lib/format";
import type { Producto } from "@/types";

export type Caracteristica = { etiqueta: string; valor: string };

function plano(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function colorDe(producto: Producto): string {
  const t = plano(`${producto.nombre} ${producto.descripcion}`);
  if (/\b(blanco|white)\b/.test(t)) return "Blanco";
  if (/\b(negro|black)\b/.test(t)) return "Negro";
  if (/\b(gris plata|acero|plata)\b/.test(t)) return "Acero / gris plata";
  if (/\bgris\b/.test(t)) return "Gris";
  if (/\bazul\b/.test(t)) return "Azul";
  return "";
}

export function materialDe(producto: Producto): string {
  const t = plano(`${producto.nombre} ${producto.descripcion}`);
  if (/\btermomagnet|pastilla|centro de carga\b/.test(t)) return "Gabinete metálico";
  if (/\bmetal y vidrio|vidrio\b/.test(t)) return "Metal y vidrio";
  if (/\b(acero|inox)\b/.test(t)) return "Acero";
  if (/\bporcelana\b/.test(t)) return "Porcelana";
  if (/\bnylon\b/.test(t)) return "Nylon";
  if (/\bpvc\b/.test(t)) return "PVC";
  if (/\b(led|luminario|foco|lampara|tira)\b/.test(t)) return "Aluminio y policarbonato";
  if (/\b(placa|apagador|contacto|interruptor)\b/.test(t)) return "Termoplástico";
  return "Material de uso eléctrico";
}

export function dimensionesDe(producto: Producto): string {
  const t = `${producto.nombre} ${producto.descripcion}`;
  const match = t.match(
    /(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×]\s*(\d+(?:[.,]\d+)?))?\s*(mm|cm|m)?/i,
  );
  if (!match) return "";
  const unidad = match[4] ? ` ${match[4]}` : "";
  return match[3] ? `${match[1]} × ${match[2]} × ${match[3]}${unidad}` : `${match[1]} × ${match[2]}${unidad}`;
}

export function montajeDe(producto: Producto): string {
  const t = plano(`${producto.nombre} ${producto.descripcion}`);
  if (/\bempotrad/.test(t)) return "Empotrado";
  if (/\bsobreponer|sobreponer/.test(t)) return "Sobreponer";
  if (/\bintemperie|exterior|ip65|ip67\b/.test(t)) return "Intemperie / exterior";
  if (/\b(placa|apagador|contacto)\b/.test(t)) return "Empotrado en caja";
  return "Instalación en campo";
}

export function caracteristicasDe(producto: Producto): Caracteristica[] {
  const marca = marcaDe(producto.nombre, producto.marca);
  const color = colorDe(producto);
  const filas: Caracteristica[] = [
    { etiqueta: "Marca", valor: marca },
    { etiqueta: "SKU", valor: producto.sku },
    { etiqueta: "Categoría", valor: etiquetaCategoria(producto.categoria) },
  ];
  if (producto.tipoLuminario) filas.push({ etiqueta: "Tipo de luminario", valor: producto.tipoLuminario });
  if (color) filas.push({ etiqueta: "Color", valor: color });
  filas.push({ etiqueta: "Material", valor: materialDe(producto) });
  if (producto.temperatura) filas.push({ etiqueta: "Temperatura de color", valor: producto.temperatura });
  if (producto.watts) filas.push({ etiqueta: "Potencia", valor: `${producto.watts} W` });
  if (producto.uso) filas.push({ etiqueta: "Uso", valor: producto.uso });
  filas.push({ etiqueta: "Tipo de montaje", valor: montajeDe(producto) });
  const dimensiones = dimensionesDe(producto);
  if (dimensiones) filas.push({ etiqueta: "Dimensiones", valor: dimensiones });
  filas.push({ etiqueta: "Acabado", valor: color === "Blanco" ? "Brillante" : "Estándar de línea" });
  filas.push({ etiqueta: "Garantía", valor: "Garantía de fabricante" });
  if (producto.ubicacion) filas.push({ etiqueta: "Ubicación en tienda", valor: producto.ubicacion });
  return filas;
}

export function textoFichaTecnica(producto: Producto): string {
  const filas = caracteristicasDe(producto)
    .map((item) => `${item.etiqueta}: ${item.valor}`)
    .join("\n");
  return `${producto.nombre}\nSKU ${producto.sku}\n\n${producto.descripcion}\n\n${filas}\n`;
}
