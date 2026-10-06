import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clienteConSesion, usaSupabase } from "./supabase";

// Inicio de sesión del panel:
// - Con Supabase: usuarios con correo y contraseña creados en Supabase → Authentication → Users.
// - Sin Supabase (modo local): una sola contraseña en la variable ADMIN_PASSWORD.

const COOKIE = "indurocer_admin";
const DURACION_SEGUNDOS = 60 * 60 * 24 * 7; // 7 días

// ---------- modo local ----------

function contrasenaAdmin(): string {
  const valor = process.env.ADMIN_PASSWORD;
  if (valor) return valor;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Falta la variable ADMIN_PASSWORD en producción.");
  }
  return "indurocer"; // solo para desarrollo local
}

function secreto(): string {
  return process.env.SESSION_SECRET || `indurocer:${contrasenaAdmin()}`;
}

function firmar(valor: string): string {
  return createHmac("sha256", secreto()).update(valor).digest("hex");
}

function iguales(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// ---------- funciones usadas por el panel ----------

/** Devuelve un mensaje de error, o null si la sesión se inició bien. */
export async function iniciarSesion(correo: string, contrasena: string): Promise<string | null> {
  if (usaSupabase()) {
    const supabase = await clienteConSesion();
    const { error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena });
    return error ? "Correo o contraseña incorrectos." : null;
  }

  if (!iguales(firmar(contrasena), firmar(contrasenaAdmin()))) return "Contraseña incorrecta.";
  const expira = Date.now() + DURACION_SEGUNDOS * 1000;
  (await cookies()).set(COOKIE, `${expira}.${firmar(String(expira))}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
  });
  return null;
}

export async function cerrarSesion(): Promise<void> {
  if (usaSupabase()) {
    await (await clienteConSesion()).auth.signOut();
    return;
  }
  (await cookies()).delete(COOKIE);
}

export async function haySesion(): Promise<boolean> {
  if (usaSupabase()) {
    const { data } = await (await clienteConSesion()).auth.getUser();
    return Boolean(data.user);
  }
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return false;
  const [expira, firma] = valor.split(".");
  if (!expira || !firma || Number(expira) < Date.now()) return false;
  return iguales(firma, firmar(expira));
}

/** Úsalo al inicio de cada página o acción del panel. */
export async function exigirSesion(): Promise<void> {
  if (!(await haySesion())) redirect("/admin/login");
}
