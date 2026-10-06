import { BotonGuardar, CampoImagen } from "@/components/admin/cliente";
import { AreaTexto, Avisos, Campo, Tarjeta, TituloPagina } from "@/components/admin/ui";
import { guardarPortada } from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";

export default async function Portada({ searchParams }: PageProps<"/admin/portada">) {
  const { portada } = await leerContenido();
  return (
    <>
      <TituloPagina titulo="Portada" texto="Lo primero que ven los visitantes al entrar al sitio." />
      <Avisos searchParams={searchParams} />
      <form action={guardarPortada}>
        <Tarjeta>
          <div className="space-y-5">
            <Campo etiqueta="Título principal" name="titulo" defaultValue={portada.titulo} required />
            <AreaTexto etiqueta="Texto debajo del título" name="subtitulo" defaultValue={portada.subtitulo} />
            <CampoImagen actual={portada.imagen} etiqueta="Foto principal" ayuda="Horizontal, idealmente 1600×1200 o más. Tu mejor trabajo terminado." />
            <div className="flex justify-end">
              <BotonGuardar />
            </div>
          </div>
        </Tarjeta>
      </form>
    </>
  );
}
