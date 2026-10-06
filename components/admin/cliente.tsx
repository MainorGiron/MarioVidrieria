"use client";

import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function BotonGuardar({ children = "Guardar cambios", variante = "primario" }: { children?: ReactNode; variante?: "primario" | "peligro" | "suave" }) {
  const { pending } = useFormStatus();
  const estilos = {
    primario: "bg-rojo-oscuro text-white hover:bg-rojo-profundo",
    peligro: "bg-white text-rojo-oscuro ring-1 ring-rojo-oscuro/30 hover:bg-rosa",
    suave: "bg-rosa-suave text-carbon ring-1 ring-rosa hover:text-rojo-oscuro",
  }[variante];
  return (
    <button type="submit" disabled={pending} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${estilos}`}>
      {pending ? "Guardando…" : children}
    </button>
  );
}

export function BotonBorrar({ mensaje = "¿Seguro que quieres borrarlo?" }: { mensaje?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(mensaje)) e.preventDefault();
      }}
      className="rounded-lg px-3 py-2 text-sm font-semibold text-rojo-oscuro ring-1 ring-rojo-oscuro/30 transition hover:bg-rosa disabled:opacity-60"
    >
      {pending ? "Borrando…" : "Borrar"}
    </button>
  );
}

/** Selector de imagen con vista previa. Envía: <nombre>, <nombre>_actual y <nombre>_quitar. */
export function CampoImagen({
  nombre = "imagen",
  actual,
  etiqueta = "Imagen",
  ayuda,
}: {
  nombre?: string;
  actual: string;
  etiqueta?: string;
  ayuda?: string;
}) {
  const [vista, setVista] = useState(actual);
  const [quitar, setQuitar] = useState(false);
  const mostrar = quitar ? "" : vista;

  return (
    <div>
      <span className="block text-sm font-medium text-carbon">{etiqueta}</span>
      <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
          {mostrar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mostrar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="patron-vidrio flex h-full items-center justify-center border-2 border-dashed border-coral/60 text-xs font-semibold text-rojo-oscuro">
              Sin imagen
            </div>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <input type="hidden" name={`${nombre}_actual`} value={actual} />
          <input
            type="file"
            name={nombre}
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(e) => {
              const archivo = e.target.files?.[0];
              if (archivo) {
                setVista(URL.createObjectURL(archivo));
                setQuitar(false);
              }
            }}
            className="block w-full text-sm text-gris file:mr-3 file:rounded-lg file:border-0 file:bg-rosa file:px-3 file:py-2 file:font-semibold file:text-rojo-oscuro hover:file:bg-coral/30"
          />
          {actual && (
            <label className="inline-flex items-center gap-2 text-gris">
              <input type="checkbox" name={`${nombre}_quitar`} checked={quitar} onChange={(e) => setQuitar(e.target.checked)} className="accent-[#b3140a]" />
              Quitar imagen (volverá a mostrarse el espacio vacío)
            </label>
          )}
          {ayuda && <p className="text-xs text-gris">{ayuda}</p>}
        </div>
      </div>
    </div>
  );
}
