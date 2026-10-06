"use client";

import { useActionState } from "react";
import { claseCampo } from "@/components/admin/ui";
import { entrar } from "@/lib/acciones-admin";

export function FormularioEntrar() {
  const [error, accion, entrando] = useActionState(entrar, null);
  return (
    <form action={accion} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-carbon">
        Contraseña
        <input type="password" name="contrasena" required autoFocus className={claseCampo} autoComplete="current-password" />
      </label>
      {error && <p className="text-sm font-medium text-rojo-oscuro" role="alert">{error}</p>}
      <button
        type="submit"
        disabled={entrando}
        className="w-full rounded-lg bg-rojo-oscuro py-3 font-semibold text-white transition hover:bg-rojo-profundo disabled:opacity-60"
      >
        {entrando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
