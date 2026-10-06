import { BotonBorrar, BotonGuardar } from "@/components/admin/cliente";
import { Avisos, Tarjeta, TituloPagina } from "@/components/admin/ui";
import { borrarMensaje, marcarMensaje } from "@/lib/acciones-admin";
import { leerMensajes } from "@/lib/datos";
import { enlaceTelefono, enlaceWhatsApp, formatearFecha } from "@/lib/util";

export default async function Mensajes({ searchParams }: PageProps<"/admin/mensajes">) {
  const mensajes = await leerMensajes();
  return (
    <>
      <TituloPagina titulo="Mensajes" texto="Solicitudes de cotización enviadas desde la página de contacto." />
      <Avisos searchParams={searchParams} />
      {mensajes.length === 0 && (
        <Tarjeta>
          <p className="text-gris">Todavía no hay mensajes. Aparecerán aquí cuando alguien llene el formulario de contacto.</p>
        </Tarjeta>
      )}
      <div className="space-y-4">
        {mensajes.map((m) => {
          const whatsapp = m.telefono ? enlaceWhatsApp(m.telefono, `Hola ${m.nombre}, le escribimos de Vidriería Indurocer.`) : null;
          return (
            <article key={m.id} className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ${m.leido ? "ring-carbon/5" : "ring-coral"}`}>
              <header className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-carbon">
                    {!m.leido && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-rojo align-middle" />}
                    {m.nombre}
                  </h2>
                  <p className="text-sm text-gris">
                    {formatearFecha(m.fecha)}
                    {m.servicio && <> · <span className="font-medium text-rojo-oscuro">{m.servicio}</span></>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {m.telefono && <a href={enlaceTelefono(m.telefono)} className="rounded-lg bg-rosa-suave px-3 py-1.5 font-medium text-carbon ring-1 ring-rosa">📞 {m.telefono}</a>}
                  {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-50 px-3 py-1.5 font-medium text-green-800 ring-1 ring-green-700/20">WhatsApp</a>}
                  {m.correo && <a href={`mailto:${m.correo}`} className="rounded-lg bg-rosa-suave px-3 py-1.5 font-medium text-carbon ring-1 ring-rosa">✉ {m.correo}</a>}
                </div>
              </header>
              <p className="mt-3 whitespace-pre-line text-carbon">{m.mensaje}</p>
              <footer className="mt-4 flex gap-2 border-t border-carbon/5 pt-3">
                <form action={marcarMensaje}>
                  <input type="hidden" name="id" value={m.id} />
                  <BotonGuardar variante="suave">{m.leido ? "Marcar como no leído" : "Marcar como leído"}</BotonGuardar>
                </form>
                <form action={borrarMensaje}>
                  <input type="hidden" name="id" value={m.id} />
                  <BotonBorrar mensaje="¿Borrar este mensaje?" />
                </form>
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}
