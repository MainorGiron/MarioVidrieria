import Link from "next/link";
import type { Ajustes, Servicio, Testimonio } from "@/lib/tipos";
import { enlaceTelefono, enlaceWhatsApp } from "@/lib/util";
import { Imagen } from "./Imagen";
import { IconoEstrella, IconoFlecha, IconoTelefono, IconoWhatsApp } from "./Iconos";

export function TituloSeccion({
  etiqueta,
  titulo,
  texto,
  centrado = true,
  oscuro = false,
}: {
  etiqueta: string;
  titulo: string;
  texto?: string;
  centrado?: boolean;
  oscuro?: boolean;
}) {
  return (
    <div className={centrado ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${oscuro ? "text-coral-claro" : "text-rojo-oscuro"}`}>
        {etiqueta}
      </p>
      <h2 className={`mt-3 font-serif text-3xl font-bold sm:text-4xl ${oscuro ? "text-white" : "text-carbon"}`}>{titulo}</h2>
      <div className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-rojo to-coral ${centrado ? "mx-auto" : ""}`} />
      {texto && <p className={`mt-5 text-lg leading-relaxed ${oscuro ? "text-white/75" : "text-gris"}`}>{texto}</p>}
    </div>
  );
}

export function EncabezadoPagina({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="relative overflow-hidden bg-carbon">
      <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,#f21b07_0,transparent_45%),radial-gradient(circle_at_85%_60%,#f25c5c_0,transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">{titulo}</h1>
        <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-rojo to-coral" />
        <p className="mt-5 max-w-2xl text-lg text-white/80">{texto}</p>
      </div>
    </section>
  );
}

export function TarjetaServicio({ servicio }: { servicio: Servicio }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-rosa bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-rojo/10">
      <div className="aspect-[4/3] overflow-hidden">
        <Imagen
          src={servicio.imagen}
          descripcion={`Foto del servicio: ${servicio.nombre.toLowerCase()}`}
          tamano="800×600"
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-semibold text-carbon">{servicio.nombre}</h3>
        <p className="mt-2 flex-1 text-gris">{servicio.descripcionCorta}</p>
        <Link
          href={`/servicios#${servicio.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rojo-oscuro hover:gap-2 hover:text-rojo-profundo"
        >
          Ver más <IconoFlecha className="h-4 w-4 transition-all" />
        </Link>
      </div>
    </article>
  );
}

export function Testimonios({ testimonios }: { testimonios: Testimonio[] }) {
  const visibles = testimonios.filter((t) => t.visible);
  if (visibles.length === 0) return null;
  return (
    <section className="bg-rosa-suave py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <TituloSeccion etiqueta="Testimonios" titulo="Lo que dicen nuestros clientes" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {visibles.map((t) => (
            <figure key={t.id} className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-rosa">
              <span className="absolute -top-4 left-6 font-serif text-6xl leading-none text-coral/40" aria-hidden>“</span>
              <div className="flex gap-0.5 text-rojo" aria-label={`${t.calificacion} de 5 estrellas`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <IconoEstrella key={i} className={`h-4 w-4 ${i < t.calificacion ? "" : "opacity-20"}`} />
                ))}
              </div>
              <blockquote className="mt-4 text-carbon">{t.comentario}</blockquote>
              <figcaption className="mt-5 font-semibold text-rojo-oscuro">— {t.cliente}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LlamadoAccion({ ajustes }: { ajustes: Ajustes }) {
  const whatsapp = enlaceWhatsApp(ajustes.whatsapp, "Hola, quisiera una cotización.");
  const telefono = ajustes.telefonos.find(Boolean);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rojo-oscuro via-rojo-profundo to-carbon py-20">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">¿Necesitas una cotización?</h2>
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          Cuéntanos qué necesitas. Medimos a domicilio y te enviamos tu presupuesto sin compromiso.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/contacto" className="rounded-full bg-white px-7 py-3.5 font-semibold text-rojo-oscuro shadow-lg transition hover:bg-rosa">
            Solicitar cotización
          </Link>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
              <IconoWhatsApp className="h-5 w-5" /> WhatsApp
            </a>
          )}
          {!whatsapp && telefono && (
            <a href={enlaceTelefono(telefono)} className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 font-semibold text-white transition hover:bg-white/10">
              <IconoTelefono className="h-5 w-5" /> {telefono}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
