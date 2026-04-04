import "@/app/ui/global.css" // Importa los estilos globales y tailwindcss
import { inter } from "@/app/ui/fonts" // Importa la fuente Inter
import type { Metadata } from "next" // Importa el tipo Metadata de Next.js q
import BarraTemas from "@/components/BarraTemas"
//import { RegisterSW } from "@/register-sw"
import type React from "react" // Import React

export const metadata: Metadata = {
  title: {
    template: "%s | FacturaFacil",
    default: "Panel FacturaFacil",
  },
  description: "Tu programa de gestión autónomo FacturaFacil.",
  metadataBase: new URL("https://proyecto-next-git-vercel-react-server-c-1c3ef9-jvrluis-projects.vercel.app/"), // Actualizar esto con el dominio real
  manifest: "/manifest.json", // Añadir esto para el manifiesto de la PWA
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
    <html lang="es" className="light" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300`}
      >
        <div className="fixed top-4 right-4 z-50 print:hidden">
          <BarraTemas initialColor={Color_usuario} showUI={false} />
        </div>
        {children}
        {/* <RegisterSW /> */}
      </body>
    </html>
  )
}

