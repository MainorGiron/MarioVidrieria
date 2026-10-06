import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { contenidoInicial } from "./contenido-inicial";
import type { Contenido } from "./tipos";

// Almacenamiento TEMPORAL en archivos locales (carpeta /data).
// Cuando se conecte Supabase, solo cambia este archivo: el resto del sitio
// usa leerContenido / guardarContenido / guardarImagen y no se entera.

const CARPETA_DATOS = path.join(process.cwd(), "data");
const ARCHIVO = path.join(CARPETA_DATOS, "contenido.json");
export const CARPETA_IMAGENES = path.join(CARPETA_DATOS, "imagenes");

export async function leerContenido(): Promise<Contenido> {
  try {
    const texto = await fs.readFile(ARCHIVO, "utf8");
    const guardado = JSON.parse(texto) as Partial<Contenido>;
    // Mezcla con los valores iniciales por si se agregan campos nuevos.
    return {
      ...contenidoInicial,
      ...guardado,
      ajustes: { ...contenidoInicial.ajustes, ...guardado.ajustes },
      portada: { ...contenidoInicial.portada, ...guardado.portada },
      nosotros: { ...contenidoInicial.nosotros, ...guardado.nosotros },
    };
  } catch {
    return structuredClone(contenidoInicial);
  }
}

export async function guardarContenido(contenido: Contenido): Promise<void> {
  await fs.mkdir(CARPETA_DATOS, { recursive: true });
  const temporal = `${ARCHIVO}.tmp`;
  await fs.writeFile(temporal, JSON.stringify(contenido, null, 2), "utf8");
  await fs.rename(temporal, ARCHIVO);
}

export async function modificarContenido(
  cambio: (contenido: Contenido) => void,
): Promise<void> {
  const contenido = await leerContenido();
  cambio(contenido);
  await guardarContenido(contenido);
}

const TIPOS_PERMITIDOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const TAMANO_MAXIMO = 8 * 1024 * 1024; // 8 MB

/** Guarda una imagen subida y devuelve la URL pública, o null si no venía archivo. */
export async function guardarImagen(archivo: FormDataEntryValue | null): Promise<string | null> {
  if (!archivo || typeof archivo === "string" || archivo.size === 0) return null;
  const extension = TIPOS_PERMITIDOS[archivo.type];
  if (!extension) throw new Error("Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF.");
  if (archivo.size > TAMANO_MAXIMO) throw new Error("La imagen pesa más de 8 MB.");
  await fs.mkdir(CARPETA_IMAGENES, { recursive: true });
  const nombre = `${randomUUID()}.${extension}`;
  await fs.writeFile(path.join(CARPETA_IMAGENES, nombre), Buffer.from(await archivo.arrayBuffer()));
  return `/media/${nombre}`;
}

/** Borra del disco una imagen subida (ignora URLs externas o vacías). */
export async function borrarImagen(url: string): Promise<void> {
  if (!url.startsWith("/media/")) return;
  const nombre = path.basename(url);
  await fs.rm(path.join(CARPETA_IMAGENES, nombre), { force: true });
}

export function nuevoId(prefijo: string): string {
  return `${prefijo}-${randomUUID().slice(0, 8)}`;
}

export function crearSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
