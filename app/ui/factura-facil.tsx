import React from 'react';
import { roboto } from '@/app/ui/fonts';
import Image from 'next/image';

export default function FacturaFacilLogo() {
  return (
    //<div className={`${roboto.className} flex flex-col md:flex-row flex-wrap items-start leading-none text-white`}>
    //<div className={`${roboto.className} flex flex-col md:flex-row items-center md:items-start leading-none text-white w-full`}>
    <div className={`${roboto.className} flex md:flex-row items-center md:items-start leading-none text-white w-full bg-green-500 p-4`}>

      <Image
        src="/facturafacil_logo.png" // Ruta pública
        width={160}
        height={140}
        alt="Logo Factura Fácil"
        className="h-15 w-15 md:h-36 md:w-36 self-start"
        priority={true}
      />
      <div className="flex flex-col md:flex-row ml-4 items-start">
        <p className="text-[15px] md:text-[30px] self-start mr-4">Tu programa de gestión</p>
        <p className="text-[20px] md:text-[30px] self-start md:font-bold">AUTONOMO</p>
      </div>
    </div>
  );
}
