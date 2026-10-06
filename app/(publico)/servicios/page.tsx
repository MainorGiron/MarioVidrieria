import type { Metadata } from "next";
import Link from "next/link";
import { Imagen } from "@/components/site/Imagen";
import { EncabezadoPagina, LlamadoAccion } from "@/components/site/Secciones";
import { leerContenido } from "@/lib/datos";

export const metadata: Metadata = { title: "Servicios" };

export default async function Servicios() {
  const { ajustes, servicios } = await leerContenido();
  const visibles = servicios.filter((s) => s.visible).sort((a, b) => a.orden - b.orden);

  return (
    <>
      <EncabezadoPagina
        titulo="Nuestros servicios"
        texto="Todo lo que necesitas en vidrio, aluminio y espejos, fabricado a la medida e instalado por profesionales."
      />
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-6">
        {visibles.map((s, i) => (
          <section key={s.id} id={s.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2">
            <div className={`aspect-[4/3] overflow-hidden rounded-3xl shadow-xl ${i % 2 ? "lg:order-2" : ""}`}>
              <Imagen src={s.imagen} descripcion={`Foto del servicio: ${s.nombre.toLowerCase()}`} tamano="1200×900" />
            </div>
            <div>
              <span className="font-serif text-6xl font-bold text-rosa">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="-mt-4 font-serif text-3xl font-bold text-carbon">{s.nombre}</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-rojo to-coral" />
              <p className="mt-5 text-lg leading-relaxed text-gris">{s.descripcion}</p>
              <Link
                href={`/contacto?servicio=${encodeURIComponent(s.nombre)}`}
                className="mt-7 inline-block rounded-full bg-rojo-oscuro px-6 py-3 font-semibold text-white transition hover:bg-rojo-profundo"
              >
                Cotizar {s.nombre.toLowerCase()}
              </Link>
            </div>
          </section>
        ))}
      </div>
      <LlamadoAccion ajustes={ajustes} />
    </>
  );
}
