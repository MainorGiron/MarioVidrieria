import type { Metadata } from "next";
import Link from "next/link";
import { exigirSesion } from "@/lib/auth";
import { salir } from "@/lib/acciones-admin";
import { leerMensajes } from "@/lib/datos";
import { MenuAdmin } from "./MenuAdmin";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LayoutPanel({ children }: LayoutProps<"/admin">) {
  await exigirSesion();
  const mensajes = await leerMensajes();
  const sinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="min-h-screen bg-[#f6f4f4] lg:flex">
      <aside className="bg-carbon text-white lg:fixed lg:inset-y-0 lg:w-64">
        <div className="h-1 bg-gradient-to-r from-rojo via-coral to-rojo" />
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icono.svg" alt="" className="h-8 w-auto" />
            <span className="font-serif font-bold leading-tight">
              Indurocer
              <span className="block text-[11px] font-sans font-medium tracking-widest text-coral-claro">PANEL</span>
            </span>
          </Link>
          <Link href="/" target="_blank" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 lg:hidden">
            Ver sitio
          </Link>
        </div>
        <MenuAdmin sinLeer={sinLeer} />
        <div className="hidden px-5 py-6 lg:absolute lg:bottom-0 lg:block lg:w-full">
          <Link href="/" target="_blank" className="block rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-semibold hover:bg-white/20">
            Ver sitio público ↗
          </Link>
          <form action={salir} className="mt-2">
            <button className="w-full rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-8 lg:ml-64">
        <div className="mx-auto max-w-5xl">{children}</div>
        <form action={salir} className="mx-auto mt-10 max-w-5xl lg:hidden">
          <button className="text-sm text-gris underline">Cerrar sesión</button>
        </form>
      </main>
    </div>
  );
}
