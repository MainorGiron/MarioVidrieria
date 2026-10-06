import Link from "next/link";
import { Imagen } from "@/components/site/Imagen";
import { IconoCheck, IconoFlecha } from "@/components/site/Iconos";
import { LlamadoAccion, TarjetaServicio, Testimonios, TituloSeccion } from "@/components/site/Secciones";
import { leerContenido } from "@/lib/datos";

export default async function Inicio() {
  const { ajustes, portada, nosotros, servicios, galeria, categorias, testimonios } = await leerContenido();
  const serviciosVisibles = servicios.filter((s) => s.visible).sort((a, b) => a.orden - b.orden);
  const destacados = galeria
    .filter((g) => g.destacado)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 6);
  const nombreCategoria = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? "";

  return (
    <>
      {/* PORTADA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rosa-suave to-white">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-rosa blur-3xl" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-rojo-oscuro shadow-sm ring-1 ring-rosa">
              <span className="h-2 w-2 rounded-full bg-rojo" /> {ajustes.eslogan}
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-carbon sm:text-5xl lg:text-6xl">
              {portada.titulo}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gris">{portada.subtitulo}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contacto" className="rounded-full bg-rojo-oscuro px-7 py-3.5 font-semibold text-white shadow-lg shadow-rojo/25 transition hover:bg-rojo-profundo">
                Solicitar cotización
              </Link>
              <Link href="/trabajos" className="inline-flex items-center gap-2 rounded-full border-2 border-carbon/15 bg-white px-7 py-3 font-semibold text-carbon transition hover:border-rojo-oscuro hover:text-rojo-oscuro">
                Ver trabajos <IconoFlecha className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rotate-2 rounded-3xl bg-gradient-to-br from-rojo to-coral opacity-90" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-2xl">
              <Imagen
                src={portada.imagen}
                descripcion="Foto principal de portada: el mejor trabajo terminado (fachada, ventanales o puerta de vidrio)"
                tamano="1600×1200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <TituloSeccion
            etiqueta="Servicios"
            titulo="Soluciones en vidrio y aluminio"
            texto="Diseñamos, fabricamos e instalamos a la medida para hogares, oficinas y comercios."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviciosVisibles.map((s) => (
              <TarjetaServicio key={s.id} servicio={s} />
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section className="bg-carbon py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <TituloSeccion
              oscuro
              centrado={false}
              etiqueta="¿Por qué elegirnos?"
              titulo="Trabajo bien hecho, de principio a fin"
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {nosotros.ventajas.map((v) => (
                <li key={v.titulo} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rojo to-coral text-white">
                    <IconoCheck className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{v.titulo}</h3>
                  <p className="mt-1 text-sm text-white/70">{v.texto}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl ring-4 ring-coral/40">
            <Imagen src={nosotros.imagen} descripcion="Foto del equipo trabajando o del taller" tamano="1000×1250" />
          </div>
        </div>
      </section>

      {/* TRABAJOS RECIENTES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <TituloSeccion etiqueta="Trabajos" titulo="Proyectos recientes" texto="Algunos de los trabajos que hemos realizado." />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {destacados.map((g, i) => (
              <figure
                key={g.id}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
              >
                <Imagen src={g.url} descripcion={g.descripcion} tamano="1200×1200" className="transition duration-500 group-hover:scale-105" />
                {g.url && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-sm text-white opacity-0 transition group-hover:opacity-100">
                    <span className="block text-xs uppercase tracking-wider text-coral-claro">{nombreCategoria(g.categoriaId)}</span>
                    {g.descripcion}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/trabajos" className="inline-flex items-center gap-2 font-semibold text-rojo-oscuro hover:text-rojo-profundo">
              Ver toda la galería <IconoFlecha className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonios testimonios={testimonios} />
      <LlamadoAccion ajustes={ajustes} />
    </>
  );
}
