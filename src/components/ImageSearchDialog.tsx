import { useEffect, useRef, useState, type DragEvent } from "react";
import { Camera, ImagePlus, LoaderCircle, Upload } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductImage } from "@/components/ProductImage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buscarPorImagen, compactarImagen } from "@/lib/api";
import { marcaDe } from "@/lib/brand";
import { precioMx } from "@/lib/format";
import { navigate } from "@/lib/nav";
import type { Producto } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchPath?: string;
  onIdentified?: (q: string, productos: Producto[]) => void;
};

export function ImageSearchDialog({ open, onOpenChange, searchPath = "/buscar", onIdentified }: Props) {
  const archivo = useRef<HTMLInputElement>(null);
  const camara = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [preview, setPreview] = useState("");
  const [leyendo, setLeyendo] = useState(false);
  const [error, setError] = useState("");
  const [consulta, setConsulta] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    if (!open) {
      setArrastrando(false);
      setPreview("");
      setLeyendo(false);
      setError("");
      setConsulta("");
      setProductos([]);
      if (archivo.current) archivo.current.value = "";
      if (camara.current) camara.current.value = "";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPaste(event: ClipboardEvent) {
      const file = [...(event.clipboardData?.files ?? [])].find((item) => item.type.startsWith("image/"));
      if (file) {
        event.preventDefault();
        void analizar(file);
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open]);

  async function analizar(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Elige una foto del material (JPG, PNG o WEBP).");
      return;
    }
    setError("");
    setConsulta("");
    setProductos([]);
    setLeyendo(true);
    try {
      const image = await compactarImagen(file);
      setPreview(image);
      const data = await buscarPorImagen(image);
      setConsulta(data.q);
      setProductos(data.productos);
      onIdentified?.(data.q, data.productos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer la foto.");
    } finally {
      setLeyendo(false);
      if (archivo.current) archivo.current.value = "";
      if (camara.current) camara.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setArrastrando(false);
    void analizar(event.dataTransfer.files?.[0]);
  }

  function irAResultados() {
    if (!consulta) return;
    const params = new URLSearchParams({ q: consulta });
    onOpenChange(false);
    navigate(`${searchPath}?${params}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-0 overflow-hidden rounded-[28px] border-0 p-0 shadow-2xl sm:rounded-[28px]">
        <DialogHeader className="px-6 pb-1 pt-5 text-left">
          <DialogTitle className="text-xl font-normal text-foreground">Buscar con una imagen</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={onDrop}
            className={`mx-6 mb-6 flex min-h-[300px] flex-col items-center justify-center rounded-[28px] px-6 text-center transition-colors ${
              arrastrando ? "bg-primary/10 ring-2 ring-primary/30" : "bg-[#f1f3f4]"
            }`}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-background text-primary shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-8" aria-hidden="true">
                <path
                  d="M7 3H5a2 2 0 0 0-2 2v2M17 3h2a2 2 0 0 1 2 2v2M7 21H5a2 2 0 0 1-2-2v-2M17 21h2a2 2 0 0 0 2-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <p className="mt-5 text-lg text-foreground">Arrastra una imagen aquí</p>
            <p className="mt-2 text-sm text-muted-foreground">o</p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              onClick={() => archivo.current?.click()}
            >
              <ImagePlus className="size-4" />
              Subir un archivo
            </button>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => camara.current?.click()}
            >
              <Camera className="size-4" />
              Usar la cámara
            </button>
            <p className="mt-6 text-xs text-muted-foreground">También puedes pegar una imagen (Ctrl+V)</p>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <div className="overflow-hidden rounded-3xl bg-[#f1f3f4]">
              <img src={preview} alt="Foto para buscar en el catálogo" className="mx-auto max-h-64 w-full object-contain" />
            </div>
            {leyendo ? (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" /> Identificando el material…
              </p>
            ) : null}
            {!leyendo && consulta ? (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Resultados para <span className="font-semibold text-foreground">“{consulta}”</span>
                </p>
                <div className="mt-3 space-y-1">
                  {productos.slice(0, 5).map((item) => (
                    <button
                      key={item.sku}
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/producto/${encodeURIComponent(item.sku)}`);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted"
                    >
                      <ProductImage producto={item} className="size-14 shrink-0 rounded-lg bg-muted object-contain" />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-sm">{item.nombre}</strong>
                        <BrandLogo nombre={item.nombre} marca={marcaDe(item.nombre, item.marca)} className="h-3.5" />
                      </span>
                      <b className="text-sm text-primary">{precioMx(item.precio)}</b>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={irAResultados}
                  className="mt-3 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Ver todos los resultados
                </button>
              </div>
            ) : null}
            {!leyendo ? (
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                onClick={() => {
                  setPreview("");
                  setConsulta("");
                  setProductos([]);
                  setError("");
                }}
              >
                <Upload className="size-4" />
                Probar con otra imagen
              </button>
            ) : null}
          </div>
        )}

        {error ? <p className="px-6 pb-5 text-sm text-sale">{error}</p> : null}

        <input ref={archivo} type="file" accept="image/*" className="hidden" onChange={(e) => void analizar(e.target.files?.[0])} />
        <input
          ref={camara}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => void analizar(e.target.files?.[0])}
        />
      </DialogContent>
    </Dialog>
  );
}
