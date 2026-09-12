export type Producto = {
  sku: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  urlImagen: string;
  ubicacion: string;
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
