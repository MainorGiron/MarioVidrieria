import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Vidriería Indurocer | Vidrio y aluminio",
    template: "%s | Vidriería Indurocer",
  },
  description:
    "Ventanas, puertas de vidrio, divisiones de baño, espejos y vitrinas en vidrio y aluminio. Medición a domicilio y cotización sin compromiso.",
  openGraph: {
    title: "Vidriería Indurocer",
    description: "Vidrio y aluminio a la medida de tu hogar y negocio.",
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
