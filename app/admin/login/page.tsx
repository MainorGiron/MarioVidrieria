import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { haySesion } from "@/lib/auth";
import { usaSupabase } from "@/lib/supabase";
import { FormularioEntrar } from "./FormularioEntrar";

export const metadata: Metadata = { title: "Entrar al panel", robots: { index: false } };

export default async function Login() {
  if (await haySesion()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rosa-suave via-white to-rosa px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl shadow-rojo/10 ring-1 ring-rosa">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="Vidriería Indurocer" className="mx-auto h-28 w-auto" />
        <h1 className="mt-4 text-center font-serif text-2xl font-bold text-carbon">Panel administrativo</h1>
        <p className="mt-1 text-center text-sm text-gris">{usaSupabase() ? "Ingresa tu correo y contraseña." : "Ingresa la contraseña para continuar."}</p>
        <FormularioEntrar conCorreo={usaSupabase()} />
      </div>
    </main>
  );
}
