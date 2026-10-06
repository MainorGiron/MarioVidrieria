import { BotonBorrar, BotonGuardar, CampoImagen } from "@/components/admin/cliente";
import { AreaTexto, Avisos, Campo, Casilla, TituloPagina } from "@/components/admin/ui";
import { borrarServicio, guardarServicio } from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";
import type { Servicio } from "@/lib/tipos";

function FormularioServicio({ s }: { s?: Servicio }) {
  return (
    <form action={guardarServicio} className="space-y-4">
      <input type="hidden" name="id" value={s?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <Campo etiqueta="Nombre" name="nombre" defaultValue={s?.nombre} required />
        </div>
        <Campo etiqueta="Orden" name="orden" type="number" min={0} defaultValue={s?.orden ?? 99} ayuda="Menor = primero" />
      </div>
      <Campo etiqueta="Descripción corta (tarjeta del inicio)" name="descripcionCorta" defaultValue={s?.descripcionCorta} />
      <AreaTexto etiqueta="Descripción completa (página Servicios)" name="descripcion" defaultValue={s?.descripcion} />
      <CampoImagen actual={s?.imagen ?? ""} etiqueta="Foto del servicio" ayuda="Horizontal 4:3, idealmente 1200×900." />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Casilla etiqueta="Visible en el sitio" name="visible" defaultChecked={s?.visible ?? true} />
        <BotonGuardar>{s ? "Guardar servicio" : "Agregar servicio"}</BotonGuardar>
      </div>
    </form>
  );
}

export default async function ServiciosAdmin({ searchParams }: PageProps<"/admin/servicios">) {
  const { servicios } = await leerContenido();
  const ordenados = [...servicios].sort((a, b) => a.orden - b.orden);
  return (
    <>
      <TituloPagina titulo="Servicios" texto="Toca un servicio para editarlo." />
      <Avisos searchParams={searchParams} />
      <div className="space-y-3">
        {ordenados.map((s) => (
          <details key={s.id} className="group rounded-2xl bg-white shadow-sm ring-1 ring-carbon/5 open:ring-coral">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-4">
              <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                {s.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imagen} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="patron-vidrio block h-full w-full border border-dashed border-coral/60" />
                )}
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-carbon">{s.nombre}</span>
                <span className="block text-sm text-gris">{s.descripcionCorta}</span>
              </span>
              {!s.visible && <span className="rounded-full bg-carbon/10 px-2 py-0.5 text-xs text-gris">Oculto</span>}
              <span className="text-gris transition group-open:rotate-180" aria-hidden>▾</span>
            </summary>
            <div className="border-t border-carbon/5 p-5">
              <FormularioServicio s={s} />
              <form action={borrarServicio} className="mt-4 border-t border-carbon/5 pt-4">
                <input type="hidden" name="id" value={s.id} />
                <BotonBorrar mensaje={`¿Borrar el servicio "${s.nombre}"?`} />
              </form>
            </div>
          </details>
        ))}
      </div>

      <details className="mt-6 rounded-2xl border-2 border-dashed border-coral/50 bg-white">
        <summary className="cursor-pointer list-none p-4 font-semibold text-rojo-oscuro">+ Agregar un servicio nuevo</summary>
        <div className="border-t border-carbon/5 p-5">
          <FormularioServicio />
        </div>
      </details>
    </>
  );
}
