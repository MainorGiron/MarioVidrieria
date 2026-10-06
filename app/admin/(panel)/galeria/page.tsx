import { BotonBorrar, BotonGuardar, CampoImagen } from "@/components/admin/cliente";
import { Avisos, Campo, Casilla, Tarjeta, TituloPagina, claseCampo } from "@/components/admin/ui";
import {
  borrarCategoria,
  borrarFoto,
  guardarCategoria,
  guardarFoto,
  subirFotos,
} from "@/lib/acciones-admin";
import { leerContenido } from "@/lib/datos";
import type { Categoria } from "@/lib/tipos";

function SelectorCategoria({ categorias, valor }: { categorias: Categoria[]; valor?: string }) {
  return (
    <label className="block text-sm font-medium text-carbon">
      Categoría
      <select name="categoriaId" defaultValue={valor ?? categorias[0]?.id} className={claseCampo}>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
    </label>
  );
}

export default async function GaleriaAdmin({ searchParams }: PageProps<"/admin/galeria">) {
  const { galeria, categorias } = await leerContenido();
  const fotos = [...galeria].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <TituloPagina titulo="Galería de trabajos" texto="Las fotos marcadas como destacadas salen en el inicio (las primeras 6)." />
      <Avisos searchParams={searchParams} />

      <Tarjeta titulo="Subir fotos nuevas">
        <form action={subirFotos} className="space-y-4">
          <label className="block text-sm font-medium text-carbon">
            Fotos (puedes elegir varias a la vez)
            <input
              type="file"
              name="fotos"
              multiple
              required
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="mt-1.5 block w-full rounded-lg border-2 border-dashed border-coral/50 bg-rosa-suave p-4 text-sm text-gris file:mr-3 file:rounded-lg file:border-0 file:bg-rojo-oscuro file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            <span className="mt-1 block text-xs font-normal text-gris">Máximo 8 MB por foto. Desde el celular puedes tomar la foto directamente.</span>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectorCategoria categorias={categorias} />
            <Campo etiqueta="Descripción" name="descripcion" placeholder="Ej. Ventana corrediza en residencial…" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Casilla etiqueta="Destacar en el inicio" name="destacado" />
            <BotonGuardar>Subir fotos</BotonGuardar>
          </div>
        </form>
      </Tarjeta>

      <h2 className="mb-3 mt-8 font-serif text-lg font-semibold text-carbon">Fotos ({fotos.length})</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {fotos.map((f) => (
          <div key={f.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-carbon/5">
            <form action={guardarFoto} className="space-y-3">
              <input type="hidden" name="id" value={f.id} />
              <CampoImagen nombre="imagen" actual={f.url} etiqueta={f.url ? "Foto" : "Espacio vacío: sube la foto"} />
              <Campo etiqueta="Descripción" name="descripcion" defaultValue={f.descripcion} />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <SelectorCategoria categorias={categorias} valor={f.categoriaId} />
                </div>
                <Campo etiqueta="Orden" name="orden" type="number" min={0} defaultValue={f.orden} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Casilla etiqueta="Destacada" name="destacado" defaultChecked={f.destacado} />
                <BotonGuardar>Guardar</BotonGuardar>
              </div>
            </form>
            <form action={borrarFoto} className="mt-3 border-t border-carbon/5 pt-3">
              <input type="hidden" name="id" value={f.id} />
              <BotonBorrar mensaje="¿Borrar esta foto?" />
            </form>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Tarjeta titulo="Categorías">
          <ul className="space-y-2">
            {categorias.map((c) => (
              <li key={c.id} className="flex flex-wrap items-end gap-2">
                <form action={guardarCategoria} className="flex flex-1 items-end gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <div className="flex-1">
                    <Campo etiqueta="" name="nombre" defaultValue={c.nombre} aria-label="Nombre de la categoría" />
                  </div>
                  <BotonGuardar variante="suave">Renombrar</BotonGuardar>
                </form>
                <form action={borrarCategoria}>
                  <input type="hidden" name="id" value={c.id} />
                  <BotonBorrar mensaje={`¿Borrar la categoría "${c.nombre}"?`} />
                </form>
              </li>
            ))}
          </ul>
          <form action={guardarCategoria} className="mt-5 flex items-end gap-2 border-t border-carbon/5 pt-5">
            <div className="flex-1">
              <Campo etiqueta="Nueva categoría" name="nombre" placeholder="Ej. Barandales" required />
            </div>
            <BotonGuardar>Agregar</BotonGuardar>
          </form>
        </Tarjeta>
      </div>
    </>
  );
}
