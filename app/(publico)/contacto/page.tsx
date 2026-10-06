import type { Metadata } from "next";
import { FormularioContacto } from "@/components/site/FormularioContacto";
import {
  IconoCorreo,
  IconoReloj,
  IconoTelefono,
  IconoUbicacion,
  IconoWhatsApp,
} from "@/components/site/Iconos";
import { EncabezadoPagina } from "@/components/site/Secciones";
import { leerContenido } from "@/lib/datos";
import { enlaceTelefono, enlaceWhatsApp } from "@/lib/util";

export const metadata: Metadata = { title: "Contacto y cotizaciones" };

export default async function Contacto({ searchParams }: PageProps<"/contacto">) {
  const { servicio } = await searchParams;
  const { ajustes, servicios } = await leerContenido();
  const whatsapp = enlaceWhatsApp(ajustes.whatsapp, "Hola, quisiera una cotización.");
  const nombresServicios = servicios.filter((s) => s.visible).sort((a, b) => a.orden - b.orden).map((s) => s.nombre);

  const datos = [
    ...ajustes.telefonos.filter(Boolean).map((t) => ({ Icono: IconoTelefono, titulo: "Teléfono", texto: t, href: enlaceTelefono(t) })),
    ...(whatsapp ? [{ Icono: IconoWhatsApp, titulo: "WhatsApp", texto: "Escríbenos", href: whatsapp }] : []),
    ...(ajustes.correo ? [{ Icono: IconoCorreo, titulo: "Correo", texto: ajustes.correo, href: `mailto:${ajustes.correo}` }] : []),
    { Icono: IconoUbicacion, titulo: "Dirección", texto: `${ajustes.direccion}${ajustes.ciudad ? `, ${ajustes.ciudad}` : ""}`, href: undefined },
    { Icono: IconoReloj, titulo: "Horario", texto: ajustes.horarios, href: undefined },
  ];

  return (
    <>
      <EncabezadoPagina titulo="Contáctanos" texto="Escríbenos para una cotización sin compromiso. Respondemos lo antes posible." />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-carbon">Información de contacto</h2>
          <ul className="mt-6 space-y-4">
            {datos.map(({ Icono, titulo, texto, href }) => (
              <li key={`${titulo}-${texto}`} className="flex gap-4 rounded-2xl bg-rosa-suave p-4 ring-1 ring-rosa">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rojo to-coral text-white">
                  <Icono className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-rojo-oscuro">{titulo}</span>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="break-all font-medium text-carbon hover:text-rojo-oscuro">
                      {texto}
                    </a>
                  ) : (
                    <span className="font-medium text-carbon">{texto}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <FormularioContacto servicios={nombresServicios} servicioInicial={typeof servicio === "string" ? servicio : undefined} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="aspect-[16/7] min-h-72 overflow-hidden rounded-3xl ring-1 ring-rosa">
          {ajustes.urlMapa ? (
            <iframe
              src={ajustes.urlMapa}
              title="Ubicación de Vidriería Indurocer"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="patron-vidrio flex h-full flex-col items-center justify-center gap-2 border-2 border-dashed border-coral/60 p-6 text-center">
              <IconoUbicacion className="h-9 w-9 text-coral" />
              <p className="font-semibold text-rojo-oscuro">Aquí va el mapa de Google</p>
              <p className="max-w-md text-sm text-gris">Se agrega desde el panel: Datos de la empresa → enlace del mapa.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
