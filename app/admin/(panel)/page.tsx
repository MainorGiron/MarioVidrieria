import Link from "next/link";
import { Tarjeta, TituloPagina } from "@/components/admin/ui";
import { leerContenido, leerMensajes } from "@/lib/datos";

export default async function Resumen() {
  const [c, mensajes] = await Promise.all([leerContenido(), leerMensajes()]);
  const faltanServicios = c.servicios.filter((s) => !s.imagen).length;
  const faltanGaleria = c.galeria.filter((g) => !g.url).length;
  const pendientes = [
    !c.portada.imagen && { texto: "Subir la foto de portada", href: "/admin/portada" },
    !c.nosotros.imagen && { texto: "Subir la foto de Nosotros", href: "/admin/nosotros" },
    faltanServicios > 0 && { texto: `Subir fotos a ${faltanServicios} servicio(s)`, href: "/admin/servicios" },
    faltanGaleria > 0 && { texto: `Reemplazar ${faltanGaleria} espacio(s) vacío(s) de la galería`, href: "/admin/galeria" },
    !c.ajustes.whatsapp && { texto: "Agregar el número de WhatsApp", href: "/admin/empresa" },
    !c.ajustes.urlMapa && { texto: "Agregar el mapa de Google", href: "/admin/empresa" },
    c.ajustes.direccion.includes("pendiente") && { texto: "Escribir la dirección real", href: "/admin/empresa" },
    c.ajustes.telefonos.some((t) => t.startsWith("0000")) && { texto: "Escribir el teléfono real", href: "/admin/empresa" },
    !c.ajustes.correo && { texto: "Agregar el correo de contacto", href: "/admin/empresa" },
  ].filter(Boolean) as { texto: string; href: string }[];

  const cifras = [
    { titulo: "Servicios", valor: c.servicios.filter((s) => s.visible).length, href: "/admin/servicios" },
    { titulo: "Fotos en galería", valor: c.galeria.filter((g) => g.url).length, href: "/admin/galeria" },
    { titulo: "Testimonios", valor: c.testimonios.filter((t) => t.visible).length, href: "/admin/testimonios" },
    { titulo: "Mensajes sin leer", valor: mensajes.filter((m) => !m.leido).length, href: "/admin/mensajes" },
  ];

  return (
    <>
      <TituloPagina titulo="¡Hola! 👋" texto="Desde aquí puedes cambiar todo el contenido del sitio." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cifras.map((x) => (
          <Link key={x.titulo} href={x.href} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-carbon/5 transition hover:ring-coral">
            <p className="text-sm text-gris">{x.titulo}</p>
            <p className="mt-1 font-serif text-3xl font-bold text-rojo-oscuro">{x.valor}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Tarjeta titulo="Pendientes para completar el sitio">
          {pendientes.length === 0 ? (
            <p className="text-gris">¡Todo listo! El sitio ya tiene toda su información.</p>
          ) : (
            <ul className="divide-y divide-carbon/5">
              {pendientes.map((p) => (
                <li key={p.texto}>
                  <Link href={p.href} className="flex items-center justify-between py-3 text-sm text-carbon hover:text-rojo-oscuro">
                    <span className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-coral" /> {p.texto}
                    </span>
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
