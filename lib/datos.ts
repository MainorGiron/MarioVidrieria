import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { contenidoInicial } from "./contenido-inicial";
import { BUCKET_IMAGENES, clienteConSesion, clientePublico, usaSupabase } from "./supabase";
import type { Contenido, Mensaje } from "./tipos";

// Aquí se decide DÓNDE se guarda el contenido:
// - Con las variables de Supabase en .env.local → Supabase (tabla "sitio", tabla "mensajes", bucket "imagenes").
// - Sin ellas → archivos locales en la carpeta /data (útil para probar sin internet).
// El resto del sitio solo usa las funciones de este archivo.

const CARPETA_DATOS = path.join(process.cwd(), "data");
const ARCHIVO = path.join(CARPETA_DATOS, "contenido.json");
export const CARPETA_IMAGENES = path.join(CARPETA_DATOS, "imagenes");

/** Rellena con los valores iniciales los campos que falten (por si se agregan campos nuevos). */
function completar(guardado: Partial<Contenido>): Contenido {
  return {
    ...structuredClone(contenidoInicial),
    ...guardado,
    ajustes: { ...contenidoInicial.ajustes, ...guardado.ajustes },
    portada: { ...contenidoInicial.portada, ...guardado.portada },
    nosotros: { ...contenidoInicial.nosotros, ...guardado.nosotros },
  };
}

// ---------- contenido del sitio ----------

/** Contenido público del sitio. En Supabase no incluye los mensajes (usa leerMensajes). */
export async function leerContenido(): Promise<Contenido> {
  if (usaSupabase()) {
    const { data, error } = await clientePublico().from("sitio").select("datos").eq("id", 1).maybeSingle();
    if (error) throw new Error(`No se pudo leer el contenido de Supabase: ${error.message}`);
    return completar({ ...(data?.datos ?? {}), mensajes: [] });
  }
  try {
    return completar(JSON.parse(await fs.readFile(ARCHIVO, "utf8")));
  } catch {
    return structuredClone(contenidoInicial);
  }
}

async function guardarContenido(contenido: Contenido): Promise<void> {
  if (usaSupabase()) {
    const datos: Partial<Contenido> = { ...contenido };
    delete datos.mensajes;
    const supabase = await clienteConSesion();
    const { error } = await supabase
      .from("sitio")
      .upsert({ id: 1, datos, actualizado: new Date().toISOString() });
    if (error) throw new Error(`No se pudo guardar en Supabase: ${error.message}`);
    return;
  }
  await fs.mkdir(CARPETA_DATOS, { recursive: true });
  const temporal = `${ARCHIVO}.tmp`;
  await fs.writeFile(temporal, JSON.stringify(contenido, null, 2), "utf8");
  await fs.rename(temporal, ARCHIVO);
}

export async function modificarContenido(cambio: (contenido: Contenido) => void): Promise<void> {
  const contenido = await leerContenido();
  cambio(contenido);
  await guardarContenido(contenido);
}

// ---------- mensajes de contacto ----------

type FilaMensaje = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  servicio: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
};

/** Solo para el panel: requiere sesión de administrador en Supabase. */
export async function leerMensajes(): Promise<Mensaje[]> {
  if (usaSupabase()) {
    const supabase = await clienteConSesion();
    const { data, error } = await supabase.from("mensajes").select("*").order("fecha", { ascending: false });
    if (error) throw new Error(`No se pudieron leer los mensajes: ${error.message}`);
    return (data ?? []) as FilaMensaje[];
  }
  try {
    const guardado = JSON.parse(await fs.readFile(ARCHIVO, "utf8")) as Partial<Contenido>;
    return guardado.mensajes ?? [];
  } catch {
    return [];
  }
}

export async function agregarMensaje(m: Omit<Mensaje, "id" | "fecha" | "leido">): Promise<void> {
  if (usaSupabase()) {
    // Insert sin .select(): el público puede crear mensajes pero no leerlos.
    const { error } = await clientePublico().from("mensajes").insert(m);
    if (error) throw new Error(`No se pudo enviar el mensaje: ${error.message}`);
    return;
  }
  await modificarContenido((c) => {
    c.mensajes.unshift({ ...m, id: nuevoId("msg"), fecha: new Date().toISOString(), leido: false });
  });
}

export async function alternarLeido(id: string): Promise<void> {
  if (usaSupabase()) {
    const supabase = await clienteConSesion();
    const { data } = await supabase.from("mensajes").select("leido").eq("id", id).maybeSingle();
    if (!data) return;
    const { error } = await supabase.from("mensajes").update({ leido: !data.leido }).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await modificarContenido((c) => {
    const m = c.mensajes.find((x) => x.id === id);
    if (m) m.leido = !m.leido;
  });
}

export async function eliminarMensaje(id: string): Promise<void> {
  if (usaSupabase()) {
    const supabase = await clienteConSesion();
    const { error } = await supabase.from("mensajes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  await modificarContenido((c) => {
    c.mensajes = c.mensajes.filter((m) => m.id !== id);
  });
}

// ---------- imágenes ----------

const TIPOS_PERMITIDOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const TAMANO_MAXIMO = 8 * 1024 * 1024; // 8 MB

/** Guarda una imagen subida y devuelve su URL pública, o null si no venía archivo. */
export async function guardarImagen(archivo: FormDataEntryValue | null): Promise<string | null> {
  if (!archivo || typeof archivo === "string" || archivo.size === 0) return null;
  const extension = TIPOS_PERMITIDOS[archivo.type];
  if (!extension) throw new Error("Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF.");
  if (archivo.size > TAMANO_MAXIMO) throw new Error("La imagen pesa más de 8 MB.");
  const nombre = `${randomUUID()}.${extension}`;

  if (usaSupabase()) {
    const supabase = await clienteConSesion();
    const { error } = await supabase.storage
      .from(BUCKET_IMAGENES)
      .upload(nombre, archivo, { contentType: archivo.type, cacheControl: "31536000" });
    if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);
    return supabase.storage.from(BUCKET_IMAGENES).getPublicUrl(nombre).data.publicUrl;
  }

  await fs.mkdir(CARPETA_IMAGENES, { recursive: true });
  await fs.writeFile(path.join(CARPETA_IMAGENES, nombre), Buffer.from(await archivo.arrayBuffer()));
  return `/media/${nombre}`;
}

/** Borra una imagen subida antes (ignora las fotos de /public y las vacías). */
export async function borrarImagen(url: string): Promise<void> {
  const marcaSupabase = `/storage/v1/object/public/${BUCKET_IMAGENES}/`;
  if (url.includes(marcaSupabase) && usaSupabase()) {
    const supabase = await clienteConSesion();
    await supabase.storage.from(BUCKET_IMAGENES).remove([url.split(marcaSupabase)[1]]);
    return;
  }
  if (url.startsWith("/media/")) {
    await fs.rm(path.join(CARPETA_IMAGENES, path.basename(url)), { force: true });
  }
}

// ---------- utilidades ----------

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
