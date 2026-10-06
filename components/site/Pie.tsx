import Link from "next/link";
import type { Ajustes } from "@/lib/tipos";
import { enlaceTelefono } from "@/lib/util";
import { Logo } from "./Logo";
import {
  IconoCorreo,
  IconoFacebook,
  IconoInstagram,
  IconoReloj,
  IconoTelefono,
  IconoTiktok,
  IconoUbicacion,
} from "./Iconos";

export function Pie({ ajustes }: { ajustes: Ajustes }) {
  const redes = [
    { url: ajustes.redes.facebook, nombre: "Facebook", Icono: IconoFacebook },
    { url: ajustes.redes.instagram, nombre: "Instagram", Icono: IconoInstagram },
    { url: ajustes.redes.tiktok, nombre: "TikTok", Icono: IconoTiktok },
  ].filter((r) => r.url);

  return (
    <footer className="mt-auto bg-carbon text-white/80">
      <div className="h-1 bg-gradient-to-r from-rojo via-coral to-rojo" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo oscuro />
          <p className="mt-4 max-w-md text-sm leading-relaxed">{ajustes.eslogan}</p>
          {redes.length > 0 && (
            <div className="mt-5 flex gap-3">
              {redes.map(({ url, nombre, Icono }) => (
                <a
                  key={nombre}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  className="rounded-full bg-white/10 p-2.5 text-white transition hover:bg-rojo-oscuro"
                >
                  <Icono className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Navegación</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/servicios", "Servicios"],
              ["/trabajos", "Trabajos realizados"],
              ["/nosotros", "Nosotros"],
              ["/contacto", "Contacto y cotizaciones"],
            ].map(([href, texto]) => (
              <li key={href}>
                <Link href={href} className="hover:text-coral-claro">{texto}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-lg font-semibold text-white">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {ajustes.telefonos.filter(Boolean).map((t) => (
              <li key={t} className="flex items-start gap-2">
                <IconoTelefono className="mt-0.5 h-4 w-4 shrink-0 text-coral-claro" />
                <a href={enlaceTelefono(t)} className="hover:text-coral-claro">{t}</a>
              </li>
            ))}
            {ajustes.correo && (
              <li className="flex items-start gap-2">
                <IconoCorreo className="mt-0.5 h-4 w-4 shrink-0 text-coral-claro" />
                <a href={`mailto:${ajustes.correo}`} className="break-all hover:text-coral-claro">{ajustes.correo}</a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <IconoUbicacion className="mt-0.5 h-4 w-4 shrink-0 text-coral-claro" />
              <span>{ajustes.direccion}</span>
            </li>
            <li className="flex items-start gap-2">
              <IconoReloj className="mt-0.5 h-4 w-4 shrink-0 text-coral-claro" />
              <span>{ajustes.horarios}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {ajustes.razonSocial}. Todos los derechos reservados.</p>
          <Link href="/admin" className="hover:text-white">Administración</Link>
        </div>
      </div>
    </footer>
  );
}
