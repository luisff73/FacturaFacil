import '@/app/ui/global.css'; // viculamos el css para la pagina
import { inter } from '@/app/ui/fonts'; // importamos las fuentes del fichero fonts.ts

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
