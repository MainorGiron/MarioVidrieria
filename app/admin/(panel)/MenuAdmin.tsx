"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const secciones = [
  { href: "/admin", texto: "Resumen" },
  { href: "/admin/empresa", texto: "Datos de la empresa" },
  { href: "/admin/portada", texto: "Portada" },
  { href: "/admin/servicios", texto: "Servicios" },
  { href: "/admin/galeria", texto: "Galería de trabajos" },
  { href: "/admin/nosotros", texto: "Nosotros" },
  { href: "/admin/testimonios", texto: "Testimonios" },
  { href: "/admin/mensajes", texto: "Mensajes" },
];

export function MenuAdmin({ sinLeer }: { sinLeer: number }) {
  const ruta = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible" aria-label="Panel">
      {secciones.map((s) => {
        const activo = s.href === "/admin" ? ruta === "/admin" : ruta.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            className={`flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activo ? "bg-rojo-oscuro text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {s.texto}
            {s.href === "/admin/mensajes" && sinLeer > 0 && (
              <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-carbon">{sinLeer}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
