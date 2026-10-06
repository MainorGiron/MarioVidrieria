import { BotonBorrar, BotonGuardar } from "@/components/admin/cliente";
import { AreaTexto, Avisos, Campo, Casilla, Tarjeta, TituloPagina } from "@/components/admin/ui";
import { borrarTestimonio, guardarTestimonio } from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";
import type { Testimonio } from "@/lib/tipos";

function FormularioTestimonio({ t }: { t?: Testimonio }) {
  return (
    <form action={guardarTestimonio} className="space-y-3">
      <input type="hidden" name="id" value={t?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <Campo etiqueta="Cliente" name="cliente" defaultValue={t?.cliente} required />
        </div>
        <Campo etiqueta="Estrellas (1-5)" name="calificacion" type="number" min={1} max={5} defaultValue={t?.calificacion ?? 5} />
      </div>
      <AreaTexto etiqueta="Comentario" name="comentario" rows={3} defaultValue={t?.comentario} required />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Casilla etiqueta="Visible en el sitio" name="visible" defaultChecked={t?.visible ?? true} />
        <BotonGuardar>{t ? "Guardar" : "Agregar testimonio"}</BotonGuardar>
      </div>
    </form>
  );
}

export default async function TestimoniosAdmin({ searchParams }: PageProps<"/admin/testimonios">) {
  const { testimonios } = await leerContenido();
  return (
    <>
      <TituloPagina titulo="Testimonios" texto="Comentarios de clientes que se muestran en el inicio y en Nosotros." />
      <Avisos searchParams={searchParams} />
      <div className="space-y-4">
        {testimonios.map((t) => (
          <Tarjeta key={t.id}>
            <FormularioTestimonio t={t} />
            <form action={borrarTestimonio} className="mt-3 border-t border-carbon/5 pt-3">
              <input type="hidden" name="id" value={t.id} />
              <BotonBorrar mensaje="¿Borrar este testimonio?" />
            </form>
          </Tarjeta>
        ))}
        <Tarjeta titulo="Agregar testimonio">
          <FormularioTestimonio />
        </Tarjeta>
      </div>
    </>
  );
}
