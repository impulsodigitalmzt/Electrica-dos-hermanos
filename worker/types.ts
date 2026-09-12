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

export type FaltanteBom = {
  query: string;
  grupo: string;
};

export type PaqueteBom = {
  id: string;
  titulo: string;
  resumen: string;
  lineas: LineaBom[];
  faltantes: FaltanteBom[];
};

export type MensajeHilo = {
  rol: "user" | "assistant";
  texto: string;
};

export type MemoriaSesion = {
  mencionados: string[];
  cierreSolicitado: boolean;
  negociacion: boolean;
};

export type SesionMostrador = {
  id: string;
  mensajes: MensajeHilo[];
  pedido: LineaCuenta[];
  paquete: PaqueteBom | null;
  memoria: MemoriaSesion;
  updatedAt: string;
};
