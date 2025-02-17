
import FacturaFacilLogo from '@/app/ui/factura-facil';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
//import styles from '@/app/ui/home.module.css'; // esto importaria mi css personalizado esto permite aplicar este estilo solo a este fichero
import { roboto } from '@/app/ui/fonts'; // importa las fuentes de google de fonts.ts
import Image from '../components/image';
import { Metadata } from 'next'; // importamos Metadata de next
//import CreateUserForm from './ui/users/create-form';


export const metadata: Metadata = {
  title: 'Panel de entrada',  // esto funcionaria pero es estatico y no se puede cambiar
};

export default function Page() {
  return (

    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-auto w-full shrink-0 items-end rounded-lg bg-green-500 p-4 md:h-50 md:w-full">
        <FacturaFacilLogo />
      </div>

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">

          <p className={`${roboto.className} text-xl text-gray-600 md:text-3xl md:leading-normal`}>
            <strong>Bienvenido a Factura Facil.</strong> <br></br> Tu programa de gestión autónomo.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
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
