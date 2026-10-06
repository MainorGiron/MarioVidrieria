"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { IconoCerrar, IconoMenu, IconoTelefono } from "./Iconos";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/trabajos", texto: "Trabajos" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

export function Encabezado({ telefono }: { telefono?: string }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const activo = (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-rosa bg-white/90 backdrop-blur">
      <div className="h-1 bg-gradient-to-r from-rojo via-coral to-rojo" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activo(e.href) ? "bg-rosa text-rojo-oscuro" : "text-carbon hover:bg-rosa-suave hover:text-rojo-oscuro"
              }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {telefono && (
            <a href={`tel:${telefono.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-gris hover:text-rojo-oscuro">
              <IconoTelefono className="h-4 w-4" /> {telefono}
            </a>
          )}
          <Link href="/contacto" className="rounded-full bg-rojo-oscuro px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rojo-profundo">
            Cotizar
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-carbon lg:hidden"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          {abierto ? <IconoCerrar className="h-6 w-6" /> : <IconoMenu className="h-6 w-6" />}
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-rosa bg-white px-4 pb-4 lg:hidden" aria-label="Principal móvil">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className={`block rounded-lg px-3 py-3 font-medium ${activo(e.href) ? "bg-rosa text-rojo-oscuro" : "text-carbon"}`}
            >
              {e.texto}
            </Link>
          ))}
          <Link
            href="/contacto"
            onClick={() => setAbierto(false)}
            className="mt-2 block rounded-full bg-rojo-oscuro px-5 py-3 text-center font-semibold text-white"
          >
            Solicitar cotización
          </Link>
        </nav>
      )}
    </header>
  );
}
