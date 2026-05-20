import "@/app/ui/global.css" // Importa los estilos globales y tailwindcss
import { inter } from "@/app/ui/fonts" // Importa la fuente Inter
import type { Metadata } from "next" // Importa el tipo Metadata de Next.js q
import BarraTemas from "@/components/BarraTemas"

import type React from "react" // Import React

export const metadata: Metadata = {
  title: {
    template: "%s | FacturaFacil",
    default: "Panel FacturaFacil",
  },
  description: "Tu programa de gestión autónomo FacturaFacil.",
  metadataBase: new URL("https://facturafacil.pro"), // Actualizar esto con el dominio real
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FacturaFacil",
  },
}

export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    themeColor: "#2c3032",
  };
}

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const Color_usuario = (session?.user as any)?.css || '#2b3643ff';

  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-300`}
      >
        <div className="fixed top-4 right-4 z-50 print:hidden">
          <BarraTemas initialColor={Color_usuario} showUI={false} />
        </div>
        {children}
      </body>
    </html>
  )

}

