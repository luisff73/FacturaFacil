/* eslint-disable @typescript-eslint/no-unused-vars */
import FacturaFacilLogo from '@/app/ui/factura-facil';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css'; // esto importaria mi css personalizado esto permite aplicar este estilo solo a este fichero
import { lusitana, roboto, montserrat } from '@/app/ui/fonts'; // importa las fuentes de google de fonts.ts
import Image from '../components/image';
import { Metadata } from 'next'; // importamos Metadata de next

export const metadata: Metadata = {
  title: 'Panel',  // esto funcionaria pero es estatico y no se puede cambiar
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* <div className={styles.shape}  ejemplo de utilizacion de css personalizado esta clase esta en home.module.css/>  */}

      {/* ahora este componente esta en el layout */}
      <div className="flex h-auto w-full shrink-0 items-end rounded-lg bg-green-500 p-4 md:h-50 md:w-full">
        <FacturaFacilLogo />
      </div>

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div
            className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-amber-950"
          />
          <p className={`${roboto.className} text-xl text-gray-600 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-green-500">#a3e635
              Next.js Learn Course
            </a><strong>
              , brought to you by Vercel.</strong>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={760}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
