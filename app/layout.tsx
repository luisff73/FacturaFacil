import '@/app/ui/global.css'; // viculamos el css para la pagina
import { inter } from '@/app/ui/fonts'; // importamos las fuentes del fichero fonts.ts
import { Metadata } from 'next'; // importamos Metadata de next
 
export const metadata: Metadata = {
  // title: 'Facturas | FacturaFacil',  // esto funcionaria pero es estatico y no se puede cambiar
  title: { 
    template: '%s | FacturaFacil', // esto es dinamico y se puede cambiar
    default: 'Panel FacturaFacil',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}{/*aqui con el inter. utilizamos la fuente de fonts.ts, antialiased es de tailwind */}</body>
    </html>
  );
}
