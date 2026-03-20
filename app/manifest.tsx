// este archivo es para crear el manifest de la aplicacion
// y que se pueda instalar como una aplicacion web progresiva

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Factura Fácil - Gestión Pura y Verifactu",
    short_name: "Factura Fácil",
    description: "Gestión avanzada de facturas con cumplimiento Verifactu y QR AEAT.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2c3032ff",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/facturafacil_logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/grafico_movil.png",
        sizes: "512x512",
        type: "image/png",

      },
    ],
  };
}
