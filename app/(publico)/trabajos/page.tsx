import type { Metadata } from "next";
import { Galeria } from "@/components/site/Galeria";
import { EncabezadoPagina, LlamadoAccion } from "@/components/site/Secciones";
import { leerContenido } from "@/lib/datos";

export const metadata: Metadata = { title: "Trabajos realizados" };

export default async function Trabajos() {
  const { ajustes, galeria, categorias } = await leerContenido();
  const imagenes = [...galeria].sort((a, b) => a.orden - b.orden);
  return (
    <>
      <EncabezadoPagina
        titulo="Trabajos realizados"
        texto="Una muestra de las ventanas, puertas, vitrinas y demás trabajos que hemos entregado."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Galeria imagenes={imagenes} categorias={categorias} />
      </section>
      <LlamadoAccion ajustes={ajustes} />
    </>
  );
}
