import { promises as fs } from "fs";
import path from "path";
import { CARPETA_IMAGENES } from "@/lib/datos";

// Sirve las imágenes subidas desde el panel (temporal hasta usar Supabase Storage).

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(_req: Request, ctx: RouteContext<"/media/[archivo]">) {
  const { archivo } = await ctx.params;
  const nombre = path.basename(archivo);
  const tipo = TIPOS[nombre.split(".").pop() ?? ""];
  if (!tipo) return new Response("No encontrado", { status: 404 });
  try {
    const datos = await fs.readFile(path.join(CARPETA_IMAGENES, nombre));
    return new Response(datos, {
      headers: { "Content-Type": tipo, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
