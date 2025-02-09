import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import ThemeToggle from '@/components/BarraTemas';

export const metadata: Metadata = {
  title: {
    template: '%s | FacturaFacil',
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
    <html lang="en" className="light">
      <body className={`${inter.className} antialiased dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300`}>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
