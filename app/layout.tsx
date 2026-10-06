import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Vidriería Indurocer | Aluminio, vidrio y PVC en El Progreso",
    template: "%s | Vidriería Indurocer",
  },
  description:
    "Ventanas PVC y de aluminio, vitrinas, espejos, enmarcados, puertas comerciales y tablilla de PVC en El Progreso, Yoro, Honduras.",
  openGraph: {
    title: "Vidriería Indurocer",
    description: "La vidriería que te brinda calidad y confianza.",
    images: ["/logo.jpeg"],
    locale: "es",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
