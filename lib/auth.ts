import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Inicio de sesión TEMPORAL con una sola contraseña (variable ADMIN_PASSWORD).
// Se reemplazará por Supabase Auth (usuarios con correo y contraseña).

const COOKIE = "indurocer_admin";
const DURACION_SEGUNDOS = 60 * 60 * 24 * 7; // 7 días

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

export function contrasenaValida(intento: string): boolean {
  return iguales(firmar(intento), firmar(contrasenaAdmin()));
}

export async function iniciarSesion(): Promise<void> {
  const expira = Date.now() + DURACION_SEGUNDOS * 1000;
  const valor = `${expira}.${firmar(String(expira))}`;
  (await cookies()).set(COOKIE, valor, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
  });
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function haySesion(): Promise<boolean> {
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
