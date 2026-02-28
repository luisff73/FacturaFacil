import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mi app PWA hecha con Next.js",
    short_name: "Factura Fácil",
    description:
      "Una aplicación web progresiva de facturación construida con Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4CAF50",
    icons: [
      {
        src: "/facturafacil_logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/hero-mobile.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
