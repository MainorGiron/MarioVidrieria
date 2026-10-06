"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cerrarSesion, contrasenaValida, exigirSesion, iniciarSesion } from "./auth";
import { borrarImagen, crearSlug, guardarImagen, leerContenido, modificarContenido, nuevoId } from "./datos";
import type { Contenido } from "./tipos";

// ---------- utilidades ----------

function txt(form: FormData, campo: string): string {
  return String(form.get(campo) ?? "").trim();
}

function num(form: FormData, campo: string, porDefecto = 0): number {
  const n = Number(form.get(campo));
  return Number.isFinite(n) ? n : porDefecto;
}

function marcado(form: FormData, campo: string): boolean {
  return form.get(campo) === "on";
}

/** Si pegan el código <iframe> completo de Google Maps, se queda solo con el enlace. */
function limpiarMapa(valor: string): string {
  const src = valor.match(/src="([^"]+)"/)?.[1] ?? valor;
  return src.startsWith("https://") ? src : "";
}

/**
 * Ejecuta un cambio protegido: verifica sesión, procesa la imagen (si viene),
 * guarda, refresca el sitio y vuelve a la página con un aviso.
 */
async function ejecutar(ruta: string, cambio: () => Promise<void>): Promise<never> {
  await exigirSesion();
  let error = "";
  try {
    await cambio();
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudo guardar.";
  }
  revalidatePath("/", "layout");
  redirect(error ? `${ruta}?error=${encodeURIComponent(error)}` : `${ruta}?guardado=1`);
}

/** Devuelve la URL de la imagen nueva, la actual, o "" si se pidió quitarla. */
async function resolverImagen(form: FormData, campo = "imagen"): Promise<string> {
  const actual = txt(form, `${campo}_actual`);
  const nueva = await guardarImagen(form.get(campo));
  if (nueva) {
    await borrarImagen(actual);
    return nueva;
  }
  if (marcado(form, `${campo}_quitar`)) {
    await borrarImagen(actual);
    return "";
  }
  return actual;
}

// ---------- sesión ----------

export async function entrar(_prev: string | null, form: FormData): Promise<string | null> {
  if (!contrasenaValida(txt(form, "contrasena"))) return "Contraseña incorrecta.";
  await iniciarSesion();
  redirect("/admin");
}

export async function salir(): Promise<void> {
  await cerrarSesion();
  redirect("/admin/login");
}

// ---------- datos de la empresa ----------

export async function guardarEmpresa(form: FormData) {
  await ejecutar("/admin/empresa", () =>
    modificarContenido((c) => {
      c.ajustes = {
        nombre: txt(form, "nombre"),
        razonSocial: txt(form, "razonSocial"),
        eslogan: txt(form, "eslogan"),
        telefonos: txt(form, "telefonos").split(/[\n,]/).map((t) => t.trim()).filter(Boolean),
        whatsapp: txt(form, "whatsapp").replace(/\D/g, ""),
        correo: txt(form, "correo"),
        direccion: txt(form, "direccion"),
        ciudad: txt(form, "ciudad"),
        horarios: txt(form, "horarios"),
        urlMapa: limpiarMapa(txt(form, "urlMapa")),
        redes: {
          facebook: txt(form, "facebook"),
          instagram: txt(form, "instagram"),
          tiktok: txt(form, "tiktok"),
        },
      };
    }),
  );
}

// ---------- portada ----------

export async function guardarPortada(form: FormData) {
  await ejecutar("/admin/portada", async () => {
    const imagen = await resolverImagen(form);
    await modificarContenido((c) => {
      c.portada = { titulo: txt(form, "titulo"), subtitulo: txt(form, "subtitulo"), imagen };
    });
  });
}

// ---------- nosotros ----------

export async function guardarNosotros(form: FormData) {
  await ejecutar("/admin/nosotros", async () => {
    const imagen = await resolverImagen(form);
    const titulos = form.getAll("ventaja_titulo").map(String);
    const textos = form.getAll("ventaja_texto").map(String);
    await modificarContenido((c) => {
      c.nosotros = {
        titulo: txt(form, "titulo"),
        historia: txt(form, "historia"),
        mision: txt(form, "mision"),
        vision: txt(form, "vision"),
        imagen,
        ventajas: titulos
          .map((titulo, i) => ({ titulo: titulo.trim(), texto: (textos[i] ?? "").trim() }))
          .filter((v) => v.titulo),
      };
    });
  });
}

// ---------- servicios ----------

export async function guardarServicio(form: FormData) {
  await ejecutar("/admin/servicios", async () => {
    const id = txt(form, "id");
    const imagen = await resolverImagen(form);
    const nombre = txt(form, "nombre");
    if (!nombre) throw new Error("El servicio necesita un nombre.");
    const datos = {
      nombre,
      slug: crearSlug(nombre),
      descripcionCorta: txt(form, "descripcionCorta"),
      descripcion: txt(form, "descripcion"),
      imagen,
      orden: num(form, "orden", 99),
      visible: marcado(form, "visible"),
    };
    await modificarContenido((c) => {
      const existente = c.servicios.find((s) => s.id === id);
      if (existente) Object.assign(existente, datos);
      else c.servicios.push({ id: nuevoId("srv"), ...datos });
    });
  });
}

export async function borrarServicio(form: FormData) {
  await ejecutar("/admin/servicios", async () => {
    const id = txt(form, "id");
    const { servicios } = await leerContenido();
    const servicio = servicios.find((s) => s.id === id);
    if (servicio) await borrarImagen(servicio.imagen);
    await modificarContenido((c) => {
      c.servicios = c.servicios.filter((s) => s.id !== id);
    });
  });
}

// ---------- galería ----------

export async function subirFotos(form: FormData) {
  await ejecutar("/admin/galeria", async () => {
    const archivos = form.getAll("fotos").filter((f): f is File => typeof f !== "string" && f.size > 0);
    if (archivos.length === 0) throw new Error("Selecciona al menos una foto.");
    const categoriaId = txt(form, "categoriaId");
    const descripcion = txt(form, "descripcion");
    const urls: string[] = [];
    for (const archivo of archivos) {
      const url = await guardarImagen(archivo);
      if (url) urls.push(url);
    }
    await modificarContenido((c) => {
      let orden = Math.max(0, ...c.galeria.map((g) => g.orden));
      for (const url of urls) {
        c.galeria.push({
          id: nuevoId("img"),
          categoriaId,
          url,
          descripcion: descripcion || "Trabajo realizado por Vidriería Indurocer",
          destacado: marcado(form, "destacado"),
          orden: ++orden,
          fecha: new Date().toISOString(),
        });
      }
    });
  });
}

export async function guardarFoto(form: FormData) {
  await ejecutar("/admin/galeria", async () => {
    const id = txt(form, "id");
    const url = await resolverImagen(form);
    await modificarContenido((c) => {
      const foto = c.galeria.find((g) => g.id === id);
      if (!foto) return;
      foto.url = url;
      foto.descripcion = txt(form, "descripcion");
      foto.categoriaId = txt(form, "categoriaId");
      foto.destacado = marcado(form, "destacado");
      foto.orden = num(form, "orden", foto.orden);
    });
  });
}

export async function borrarFoto(form: FormData) {
  await ejecutar("/admin/galeria", async () => {
    const id = txt(form, "id");
    const { galeria } = await leerContenido();
    const foto = galeria.find((g) => g.id === id);
    if (foto) await borrarImagen(foto.url);
    await modificarContenido((c) => {
      c.galeria = c.galeria.filter((g) => g.id !== id);
    });
  });
}

export async function guardarCategoria(form: FormData) {
  await ejecutar("/admin/galeria", () =>
    modificarContenido((c) => {
      const nombre = txt(form, "nombre");
      if (!nombre) throw new Error("La categoría necesita un nombre.");
      const id = txt(form, "id");
      const existente = c.categorias.find((cat) => cat.id === id);
      if (existente) Object.assign(existente, { nombre, slug: crearSlug(nombre) });
      else c.categorias.push({ id: nuevoId("cat"), nombre, slug: crearSlug(nombre) });
    }),
  );
}

export async function borrarCategoria(form: FormData) {
  await ejecutar("/admin/galeria", () =>
    modificarContenido((c) => {
      const id = txt(form, "id");
      if (c.galeria.some((g) => g.categoriaId === id)) {
        throw new Error("No se puede borrar una categoría que todavía tiene fotos.");
      }
      c.categorias = c.categorias.filter((cat) => cat.id !== id);
    }),
  );
}

// ---------- testimonios ----------

export async function guardarTestimonio(form: FormData) {
  await ejecutar("/admin/testimonios", () =>
    modificarContenido((c) => {
      const id = txt(form, "id");
      const datos = {
        cliente: txt(form, "cliente"),
        comentario: txt(form, "comentario"),
        calificacion: Math.min(5, Math.max(1, num(form, "calificacion", 5))),
        visible: marcado(form, "visible"),
      };
      if (!datos.cliente || !datos.comentario) throw new Error("Escribe el nombre y el comentario.");
      const existente = c.testimonios.find((t) => t.id === id);
      if (existente) Object.assign(existente, datos);
      else c.testimonios.push({ id: nuevoId("tes"), ...datos });
    }),
  );
}

export async function borrarTestimonio(form: FormData) {
  await ejecutar("/admin/testimonios", () =>
    modificarContenido((c) => {
      c.testimonios = c.testimonios.filter((t) => t.id !== txt(form, "id"));
    }),
  );
}

// ---------- mensajes ----------

export async function marcarMensaje(form: FormData) {
  await ejecutar("/admin/mensajes", () =>
    modificarContenido((c: Contenido) => {
      const m = c.mensajes.find((x) => x.id === txt(form, "id"));
      if (m) m.leido = !m.leido;
    }),
  );
}

export async function borrarMensaje(form: FormData) {
  await ejecutar("/admin/mensajes", () =>
    modificarContenido((c) => {
      c.mensajes = c.mensajes.filter((m) => m.id !== txt(form, "id"));
    }),
  );
}
