import type { Metadata } from "next";
import { Imagen } from "@/components/site/Imagen";
import { IconoCheck } from "@/components/site/Iconos";
import { EncabezadoPagina, LlamadoAccion, Testimonios } from "@/components/site/Secciones";
import { leerContenido } from "@/lib/datos";

export const metadata: Metadata = { title: "Nosotros" };

export default async function Nosotros() {
  const { ajustes, nosotros, testimonios } = await leerContenido();
  return (
    <>
      <EncabezadoPagina titulo={nosotros.titulo} texto={ajustes.eslogan} />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-gradient-to-br from-rojo to-coral" aria-hidden />
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-xl">
            <Imagen src={nosotros.imagen} descripcion="Foto del equipo, del taller o del local de la vidriería" tamano="1200×900" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rojo-oscuro">Nuestra historia</p>
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-gris">{nosotros.historia}</p>
        </div>
      </section>

      <section className="bg-rosa-suave py-20">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {[
            ["Misión", nosotros.mision],
            ["Visión", nosotros.vision],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rosa">
              <h2 className="font-serif text-2xl font-bold text-rojo-oscuro">{titulo}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-gris">{texto}</p>
            </div>
          ))}
        </div>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
          {nosotros.ventajas.map((v) => (
            <li key={v.titulo} className="flex gap-3">
              <IconoCheck className="mt-1 h-5 w-5 shrink-0 text-rojo" />
              <span>
                <strong className="text-carbon">{v.titulo}.</strong> <span className="text-gris">{v.texto}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Testimonios testimonios={testimonios} />
      <LlamadoAccion ajustes={ajustes} />
    </>
  );
}
