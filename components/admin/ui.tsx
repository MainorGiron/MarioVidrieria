import type { ReactNode } from "react";

export const claseCampo =
  "mt-1.5 w-full rounded-lg border border-carbon/15 bg-white px-3 py-2.5 text-sm text-carbon focus:border-rojo-oscuro focus:outline-none focus:ring-4 focus:ring-rosa";

export function Campo({
  etiqueta,
  ayuda,
  ...props
}: { etiqueta: string; ayuda?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium text-carbon">
      {etiqueta}
      <input className={claseCampo} {...props} />
      {ayuda && <span className="mt-1 block text-xs font-normal text-gris">{ayuda}</span>}
    </label>
  );
}

export function AreaTexto({
  etiqueta,
  ayuda,
  ...props
}: { etiqueta: string; ayuda?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm font-medium text-carbon">
      {etiqueta}
      <textarea className={claseCampo} rows={4} {...props} />
      {ayuda && <span className="mt-1 block text-xs font-normal text-gris">{ayuda}</span>}
    </label>
  );
}

export function Casilla({ etiqueta, ...props }: { etiqueta: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-carbon">
      <input type="checkbox" className="h-4 w-4 accent-[#b3140a]" {...props} />
      {etiqueta}
    </label>
  );
}

export function Tarjeta({ titulo, children, acciones }: { titulo?: string; children: ReactNode; acciones?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-carbon/5 sm:p-6">
      {(titulo || acciones) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {titulo && <h2 className="font-serif text-lg font-semibold text-carbon">{titulo}</h2>}
          {acciones}
        </div>
      )}
      {children}
    </section>
  );
}

export function TituloPagina({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-2xl font-bold text-carbon sm:text-3xl">{titulo}</h1>
      {texto && <p className="mt-1 text-gris">{texto}</p>}
    </div>
  );
}

export async function Avisos({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { guardado, error } = await searchParams;
  if (error) {
    return (
      <p role="alert" className="mb-5 rounded-lg border border-rojo/30 bg-rosa px-4 py-3 text-sm font-medium text-rojo-profundo">
        {String(error)}
      </p>
    );
  }
  if (guardado) {
    return (
      <p role="status" className="mb-5 rounded-lg border border-green-700/20 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        ✓ Cambios guardados. Ya se ven en el sitio.
      </p>
    );
  }
  return null;
}
