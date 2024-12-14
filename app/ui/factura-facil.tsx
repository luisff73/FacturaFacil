import React from 'react';
import { roboto } from '@/app/ui/fonts';
import Image from 'next/image';

export default function FacturaFacilLogo() {
  return (
    <div className={`${roboto.className} flex flex-row md:flex-row flex-wrap items-start leading-none text-white`}>
      <Image
        src="/facturafacil_logo.png" // Ruta pública
        width={160}
        height={140}
        alt="Logo Factura Fácil"
        className="h-20 w-20 md:h-36 md:w-36 self-start"
      />
      <div className="flex flex-col md:flex-row ml-4">
        <p className="text-[15px] md:text-[30px] self-start mr-4">Tu programa de gestión</p>
        <p className="text-[15px] md:text-[30px] self-start md:font-bold">AUTONOMO</p>
      </div>
    </div>
  );
}
