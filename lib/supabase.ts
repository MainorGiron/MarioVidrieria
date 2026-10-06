import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Si estas variables existen, el sitio usa Supabase. Si no, usa archivos locales (carpeta /data).
// Acepta la URL aunque la peguen con "/rest/v1/" o "/" al final.
const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  .replace(/\/(rest|auth|storage)\/v1\/?.*$/, "")
  .replace(/\/+$/, "");
const CLAVE_PUBLICA =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const BUCKET_IMAGENES = "imagenes";

export function usaSupabase(): boolean {
  return Boolean(URL_SUPABASE && CLAVE_PUBLICA);
}

/** Cliente sin sesión: para que el público lea el contenido y envíe mensajes. */
export function clientePublico() {
  return createClient(URL_SUPABASE!, CLAVE_PUBLICA!, { auth: { persistSession: false } });
}

/** Cliente con la sesión del administrador (cookies): para guardar cambios. */
export async function clienteConSesion() {
  const almacen = await cookies();
  return createServerClient(URL_SUPABASE!, CLAVE_PUBLICA!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // En componentes de servidor no se pueden escribir cookies; el proxy las renueva.
        }
      },
    },
  });
}
