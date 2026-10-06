// Copia a Supabase lo que editaste en modo local (data/contenido.json y data/imagenes/).
// Uso:  npm run migrar
// Necesita en .env.local: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SECRET_KEY.
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secreta = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secreta) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}
const supabase = createClient(url, secreta, { auth: { persistSession: false } });

let contenido;
try {
  contenido = JSON.parse(await readFile("data/contenido.json", "utf8"));
} catch {
  console.log("No hay data/contenido.json: no hay nada que migrar. El sitio usará el contenido inicial.");
  process.exit(0);
}

const tipos = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };
const subidas = new Map();

async function migrarUrl(valor) {
  if (typeof valor !== "string" || !valor.startsWith("/media/")) return valor;
  if (subidas.has(valor)) return subidas.get(valor);
  const nombre = path.basename(valor);
  const archivo = await readFile(path.join("data", "imagenes", nombre));
  const { error } = await supabase.storage
    .from("imagenes")
    .upload(nombre, archivo, { contentType: tipos[nombre.split(".").pop()], upsert: true });
  if (error) throw new Error(`No se pudo subir ${nombre}: ${error.message}`);
  const publica = supabase.storage.from("imagenes").getPublicUrl(nombre).data.publicUrl;
  subidas.set(valor, publica);
  console.log(`  ✓ imagen ${nombre}`);
  return publica;
}

// Recorre todo el contenido y cambia las rutas /media/... por las de Supabase.
async function recorrer(nodo) {
  if (Array.isArray(nodo)) return Promise.all(nodo.map(recorrer));
  if (nodo && typeof nodo === "object") {
    const salida = {};
    for (const [k, v] of Object.entries(nodo)) salida[k] = await recorrer(v);
    return salida;
  }
  return migrarUrl(nodo);
}

const { mensajes = [], ...datos } = contenido;
console.log("Subiendo imágenes…");
const datosMigrados = await recorrer(datos);

const { error: errorSitio } = await supabase
  .from("sitio")
  .upsert({ id: 1, datos: datosMigrados, actualizado: new Date().toISOString() });
if (errorSitio) throw new Error(`No se pudo guardar el contenido: ${errorSitio.message}`);
console.log("✓ Contenido del sitio guardado");

if (mensajes.length) {
  const filas = mensajes.map(({ nombre, telefono, correo, servicio, mensaje, fecha, leido }) => ({
    nombre, telefono, correo, servicio, mensaje, fecha, leido,
  }));
  const { error } = await supabase.from("mensajes").insert(filas);
  if (error) throw new Error(`No se pudieron copiar los mensajes: ${error.message}`);
  console.log(`✓ ${filas.length} mensaje(s) copiados`);
}
console.log("¡Listo! Ya puedes usar el sitio con Supabase.");
