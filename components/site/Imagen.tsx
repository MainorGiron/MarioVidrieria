type Props = {
  src?: string;
  /** Qué foto va en este espacio, ej. "foto de una ventana instalada". */
  descripcion: string;
  /** Tamaño recomendado, ej. "1200×800". */
  tamano?: string;
  className?: string;
};

/** Muestra la imagen si existe; si no, un recuadro que indica qué foto va ahí. */
export function Imagen({ src, descripcion, tamano, className = "" }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={descripcion} loading="lazy" className={`h-full w-full object-cover ${className}`} />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Espacio para imagen: ${descripcion}`}
      className={`patron-vidrio flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-coral/60 p-4 text-center ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-9 w-9 text-coral" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5-8 9" />
      </svg>
      <p className="text-sm font-semibold text-rojo-oscuro">Aquí va la imagen</p>
      <p className="max-w-xs text-xs text-gris">{descripcion}</p>
      {tamano && <p className="text-[11px] uppercase tracking-wider text-gris/80">Recomendado {tamano}</p>}
    </div>
  );
}
