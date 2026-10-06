import { enlaceWhatsApp } from "@/lib/util";
import { IconoWhatsApp } from "./Iconos";

export function BotonWhatsApp({ numero }: { numero: string }) {
  const url = enlaceWhatsApp(numero, "Hola, quisiera una cotización.");
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <IconoWhatsApp className="h-7 w-7" />
    </a>
  );
}
