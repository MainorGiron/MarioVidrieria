export function enlaceWhatsApp(numero: string, texto?: string): string | null {
  const limpio = numero.replace(/\D/g, "");
  if (!limpio) return null;
  const mensaje = texto ? `?text=${encodeURIComponent(texto)}` : "";
  return `https://wa.me/${limpio}${mensaje}`;
}

export function enlaceTelefono(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" });
}
