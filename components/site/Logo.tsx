import Link from "next/link";

export function Logo({ oscuro = false }: { oscuro?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Vidriería Indurocer, inicio">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icono.svg" alt="" className="h-10 w-auto transition-transform group-hover:-translate-y-0.5" />
      <span className="leading-tight">
        <span className={`block font-serif text-lg font-bold tracking-wide ${oscuro ? "text-white" : "text-carbon"}`}>
          VIDRIERÍA INDUROCER
        </span>
        <span className={`block text-[11px] tracking-[0.2em] ${oscuro ? "text-coral-claro" : "text-rojo-oscuro"}`}>
          VIDRIO · ALUMINIO · ESPEJOS
        </span>
      </span>
    </Link>
  );
}
