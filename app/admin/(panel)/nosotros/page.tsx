import { BotonGuardar, CampoImagen } from "@/components/admin/cliente";
import { AreaTexto, Avisos, Campo, Tarjeta, TituloPagina } from "@/components/admin/ui";
import { guardarNosotros } from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";

export default async function NosotrosAdmin({ searchParams }: PageProps<"/admin/nosotros">) {
  const { nosotros: n } = await leerContenido();
  // Siempre se muestran 6 filas de ventajas; las vacías no se guardan.
  const ventajas = [...n.ventajas, ...Array(Math.max(0, 6 - n.ventajas.length)).fill({ titulo: "", texto: "" })];

  return (
    <>
      <TituloPagina titulo="Nosotros" texto="Historia de la empresa, misión, visión y las razones para elegirlos." />
      <Avisos searchParams={searchParams} />
      <form action={guardarNosotros} className="space-y-6">
        <Tarjeta titulo="Historia">
          <div className="space-y-4">
            <Campo etiqueta="Título" name="titulo" defaultValue={n.titulo} />
            <AreaTexto etiqueta="Historia" name="historia" rows={6} defaultValue={n.historia} />
            <div className="grid gap-4 sm:grid-cols-2">
              <AreaTexto etiqueta="Misión" name="mision" defaultValue={n.mision} />
              <AreaTexto etiqueta="Visión" name="vision" defaultValue={n.vision} />
            </div>
            <CampoImagen actual={n.imagen} etiqueta="Foto del equipo o taller" ayuda="También se usa en la sección “¿Por qué elegirnos?” del inicio." />
          </div>
        </Tarjeta>

        <Tarjeta titulo="¿Por qué elegirnos?">
          <p className="-mt-2 mb-4 text-sm text-gris">Deja vacías las filas que no uses.</p>
          <div className="space-y-3">
            {ventajas.map((v, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-3">
                <Campo etiqueta={`Ventaja ${i + 1}`} name="ventaja_titulo" defaultValue={v.titulo} />
                <div className="sm:col-span-2">
                  <Campo etiqueta="Descripción" name="ventaja_texto" defaultValue={v.texto} />
                </div>
              </div>
            ))}
          </div>
        </Tarjeta>

        <div className="sticky bottom-4 flex justify-end">
          <BotonGuardar />
        </div>
      </form>
    </>
  );
}
