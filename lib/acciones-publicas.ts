"use server";

import { modificarContenido, nuevoId } from "./datos";

export type EstadoFormulario = { ok: boolean; mensaje: string } | null;

function texto(form: FormData, campo: string, max = 500): string {
  return String(form.get(campo) ?? "").trim().slice(0, max);
}

export async function enviarCotizacion(_prev: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  // Campo trampa contra bots: las personas no lo ven ni lo llenan.
  if (texto(form, "sitio")) return { ok: true, mensaje: "¡Gracias! Te contactaremos pronto." };

  const nombre = texto(form, "nombre", 120);
  const telefono = texto(form, "telefono", 40);
  const correo = texto(form, "correo", 120);
  const mensaje = texto(form, "mensaje", 2000);
  if (!nombre || (!telefono && !correo) || !mensaje) {
    return { ok: false, mensaje: "Escribe tu nombre, un teléfono o correo y tu mensaje." };
  }

  await modificarContenido((c) => {
    c.mensajes.unshift({
      id: nuevoId("msg"),
      nombre,
      telefono,
      correo,
      servicio: texto(form, "servicio", 120),
      mensaje,
      fecha: new Date().toISOString(),
      leido: false,
    });
  });
  return { ok: true, mensaje: "¡Gracias! Recibimos tu solicitud y te contactaremos pronto." };
}
