"use client";

import { useEffect, useState } from "react";
import type { Categoria, ImagenGaleria } from "@/lib/tipos";
import { Imagen } from "./Imagen";
import { IconoCerrar } from "./Iconos";

export function Galeria({ imagenes, categorias }: { imagenes: ImagenGaleria[]; categorias: Categoria[] }) {
  const [filtro, setFiltro] = useState("todas");
  const [abierta, setAbierta] = useState<ImagenGaleria | null>(null);
  const visibles = filtro === "todas" ? imagenes : imagenes.filter((i) => i.categoriaId === filtro);
  const nombreCategoria = (id: string) => categorias.find((c) => c.id === id)?.nombre ?? "";

  useEffect(() => {
    if (!abierta) return;
    const cerrar = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(null);
    window.addEventListener("keydown", cerrar);
    return () => window.removeEventListener("keydown", cerrar);
  }, [abierta]);

  const opciones = [{ id: "todas", nombre: "Todas" }, ...categorias];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar por categoría">
        {opciones.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filtro === c.id}
            onClick={() => setFiltro(c.id)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filtro === c.id ? "bg-rojo-oscuro text-white shadow" : "bg-rosa-suave text-carbon ring-1 ring-rosa hover:text-rojo-oscuro"
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visibles.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => img.url && setAbierta(img)}
            className="group relative aspect-square overflow-hidden rounded-2xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-coral"
            aria-label={img.descripcion}
          >
            <Imagen src={img.url} descripcion={img.descripcion} tamano="1200×1200" className="transition duration-500 group-hover:scale-105" />
            {img.url && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 text-sm text-white opacity-0 transition group-hover:opacity-100">
                <span className="block text-xs uppercase tracking-wider text-coral-claro">{nombreCategoria(img.categoriaId)}</span>
                {img.descripcion}
              </span>
            )}
          </button>
        ))}
      </div>
      {visibles.length === 0 && <p className="mt-10 text-center text-gris">Pronto agregaremos fotos en esta categoría.</p>}

      {abierta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={abierta.descripcion}
          onClick={() => setAbierta(null)}
        >
          <button type="button" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Cerrar">
            <IconoCerrar className="h-6 w-6" />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={abierta.url} alt={abierta.descripcion} className="max-h-[80vh] rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-white/90">{abierta.descripcion}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
