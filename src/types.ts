export type Producto = {
  sku: string;
  nombre: string;
  categoria: string;
  marca?: string;
  precio: number;
  precioAnterior?: number;
  stock: number;
  descripcion: string;
  urlImagen: string;
  ubicacion: string;
  pos?: string;
  tipoLuminario?: string;
  temperatura?: "Cálida 3000K" | "Neutra 4000K" | "Fría 6500K";
  uso?: "Interior" | "Exterior";
  watts?: number;
  rating?: number;
};

export type LineaCuenta = {
  sku: string;
  nombre: string;
  cantidad: number;
  precio: number;
  urlImagen?: string;
  origen: "catalogo" | "asistente" | "paquete";
  paqueteId?: string;
  paqueteTitulo?: string;
  grupo?: string;
};

export type LineaBom = {
  sku: string;
  nombre: string;
  cantidad: number;
  precio: number;
  existencia: number;
  grupo: string;
  urlImagen: string;
};

export type PaqueteBom = {
  id: string;
  titulo: string;
  resumen: string;
  lineas: LineaBom[];
  faltantes: { query: string; grupo: string }[];
};

export type RespuestaAsistente = {
  ok: boolean;
  sessionId: string;
  ruta: string;
  respuesta: string;
  productos: Producto[];
  paquete: PaqueteBom | null;
  pedido: LineaCuenta[];
};

export type CatalogoResponse = {
  ok: boolean;
  total: number;
  page: number;
  productos: Producto[];
};
