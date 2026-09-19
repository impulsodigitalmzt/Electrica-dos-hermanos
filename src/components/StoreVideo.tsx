type Props = {
  src: string;
  title: string;
  className?: string;
  fit?: "cover" | "contain";
  controls?: boolean;
};

export function StoreVideo({ src, title, className = "", fit = "cover", controls = true }: Props) {
  return (
    <video
      src={src}
      title={title}
      aria-label={title}
      className={`${fit === "contain" ? "object-contain bg-transparent" : "object-cover"} ${className}`}
      autoPlay
      muted
      loop
      playsInline
      controls={controls}
      preload="metadata"
    />
  );
}
