import { BotonWhatsApp } from "@/components/site/BotonWhatsApp";
import { Encabezado } from "@/components/site/Encabezado";
import { Pie } from "@/components/site/Pie";
import { leerContenido } from "@/lib/datos";

// El contenido se edita desde el panel, así que siempre se lee al momento.
export const dynamic = "force-dynamic";

export default async function LayoutPublico({ children }: LayoutProps<"/">) {
  const { ajustes } = await leerContenido();
  return (
    <>
      <Encabezado telefono={ajustes.telefonos.find(Boolean)} />
      <main className="flex-1">{children}</main>
      <Pie ajustes={ajustes} />
      <BotonWhatsApp numero={ajustes.whatsapp} />
    </>
  );
}
