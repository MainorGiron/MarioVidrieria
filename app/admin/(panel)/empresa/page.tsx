import { BotonGuardar } from "@/components/admin/cliente";
import { AreaTexto, Avisos, Campo, Tarjeta, TituloPagina } from "@/components/admin/ui";
import { guardarEmpresa } from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";

export default async function Empresa({ searchParams }: PageProps<"/admin/empresa">) {
  const { ajustes: a } = await leerContenido();
  return (
    <>
      <TituloPagina titulo="Datos de la empresa" texto="Información de contacto que aparece en el encabezado, el pie de página y la página de contacto." />
      <Avisos searchParams={searchParams} />
      <form action={guardarEmpresa} className="space-y-6">
        <Tarjeta titulo="General">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre comercial" name="nombre" defaultValue={a.nombre} required />
            <Campo etiqueta="Razón social" name="razonSocial" defaultValue={a.razonSocial} />
          </div>
          <div className="mt-4">
            <Campo etiqueta="Eslogan" name="eslogan" defaultValue={a.eslogan} />
          </div>
        </Tarjeta>

        <Tarjeta titulo="Contacto">
          <div className="grid gap-4 sm:grid-cols-2">
            <AreaTexto etiqueta="Teléfonos" name="telefonos" rows={3} defaultValue={a.telefonos.join("\n")} ayuda="Uno por línea." />
            <div className="space-y-4">
              <Campo
                etiqueta="WhatsApp"
                name="whatsapp"
                defaultValue={a.whatsapp}
                inputMode="tel"
                placeholder="50499998888"
                ayuda="Con código de país, solo números. Activa el botón verde de WhatsApp."
              />
              <Campo etiqueta="Correo" name="correo" type="email" defaultValue={a.correo} />
            </div>
          </div>
        </Tarjeta>

        <Tarjeta titulo="Ubicación y horario">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Dirección" name="direccion" defaultValue={a.direccion} />
            <Campo etiqueta="Ciudad" name="ciudad" defaultValue={a.ciudad} />
          </div>
          <div className="mt-4 space-y-4">
            <Campo etiqueta="Horarios" name="horarios" defaultValue={a.horarios} />
            <AreaTexto
              etiqueta="Mapa de Google"
              name="urlMapa"
              rows={3}
              defaultValue={a.urlMapa}
              ayuda="En Google Maps: Compartir → Insertar un mapa → Copiar HTML, y pégalo aquí."
            />
          </div>
        </Tarjeta>

        <Tarjeta titulo="Redes sociales">
          <div className="grid gap-4 sm:grid-cols-3">
            <Campo etiqueta="Facebook" name="facebook" type="url" defaultValue={a.redes.facebook} placeholder="https://facebook.com/..." />
            <Campo etiqueta="Instagram" name="instagram" type="url" defaultValue={a.redes.instagram} placeholder="https://instagram.com/..." />
            <Campo etiqueta="TikTok" name="tiktok" type="url" defaultValue={a.redes.tiktok} placeholder="https://tiktok.com/@..." />
          </div>
        </Tarjeta>

        <div className="sticky bottom-4 flex justify-end">
          <BotonGuardar />
        </div>
      </form>
    </>
  );
}
