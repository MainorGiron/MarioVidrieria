"use client";

import { useActionState } from "react";
import { enviarCotizacion, type EstadoFormulario } from "@/lib/acciones-publicas";

const campo =
  "mt-1.5 w-full rounded-xl border border-carbon/15 bg-white px-4 py-3 text-carbon placeholder:text-gris/70 focus:border-rojo-oscuro focus:outline-none focus:ring-4 focus:ring-rosa";

export function FormularioContacto({ servicios, servicioInicial }: { servicios: string[]; servicioInicial?: string }) {
  const [estado, accion, enviando] = useActionState<EstadoFormulario, FormData>(enviarCotizacion, null);

  if (estado?.ok) {
    return (
      <div className="rounded-3xl bg-rosa-suave p-10 text-center ring-1 ring-rosa" role="status">
        <p className="font-serif text-2xl font-bold text-rojo-oscuro">¡Mensaje enviado!</p>
        <p className="mt-3 text-gris">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={accion} className="space-y-5 rounded-3xl bg-white p-6 shadow-xl shadow-rojo/5 ring-1 ring-rosa sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-carbon">
          Nombre *
          <input name="nombre" required className={campo} placeholder="Tu nombre" autoComplete="name" />
        </label>
        <label className="block text-sm font-medium text-carbon">
          Teléfono
          <input name="telefono" type="tel" className={campo} placeholder="Tu número" autoComplete="tel" />
        </label>
      </div>
      <label className="block text-sm font-medium text-carbon">
        Correo electrónico
        <input name="correo" type="email" className={campo} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
      </label>
      <label className="block text-sm font-medium text-carbon">
        Servicio de interés
        <select name="servicio" defaultValue={servicioInicial ?? ""} className={campo}>
          <option value="">Selecciona un servicio</option>
          {servicios.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Otro">Otro</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-carbon">
        Mensaje *
        <textarea name="mensaje" required rows={5} className={campo} placeholder="Cuéntanos qué necesitas, medidas aproximadas, ubicación…" />
      </label>
      <input type="text" name="sitio" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {estado && !estado.ok && <p className="rounded-lg bg-rosa px-4 py-2 text-sm text-rojo-profundo" role="alert">{estado.mensaje}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-full bg-rojo-oscuro px-6 py-3.5 font-semibold text-white shadow-lg shadow-rojo/20 transition hover:bg-rojo-profundo disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Enviar solicitud"}
      </button>
      <p className="text-center text-xs text-gris">Debes dejar al menos un teléfono o un correo para responderte.</p>
    </form>
  );
}
