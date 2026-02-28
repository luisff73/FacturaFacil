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
  metadataBase: new URL("https://tu-dominio.com"), // Actualiza esto con tu dominio real
  manifest: "/manifest.json", // Añade esto para el manifiesto de la PWA
  themeColor: "#22c55e", // Ajusta este color según tu diseño
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FacturaFacil",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="light">
      <body
        className={`${inter.className} antialiased dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300`}
      >
        <div className="fixed top-4 right-4 z-50">
          <BarraTemas />
        </div>
        {children}
        {/* <RegisterSW /> */}
      </body>
    </html>
  )
}

