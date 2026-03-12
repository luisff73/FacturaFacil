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
  metadataBase: new URL("https://proyecto-next-git-vercel-react-server-c-1c3ef9-jvrluis-projects.vercel.app/"), // Actualiza esto con tu dominio real
  manifest: "/manifest.json", // Añade esto para el manifiesto de la PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FacturaFacil",
  },
}

export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    themeColor: "#22c55e",
  };
}

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const userColor = (session?.user as any)?.css || '#4CAF50';

  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300`}
      >
        <div className="fixed top-4 right-4 z-50">
          <BarraTemas initialColor={userColor} />
        </div>
        {children}
        {/* <RegisterSW /> */}
      </body>
    </html>
  )
}

