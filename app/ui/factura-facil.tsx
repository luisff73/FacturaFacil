import React from 'react';
import { roboto } from '@/app/ui/fonts';
import Image from 'next/image';
import { auth } from '@/auth';
import { fetchEmpresaById } from '@/app/lib/data';
import { fetchUsersById } from '@/app/lib/data';

const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || 'https://tqqqihkzj4uwev0c.public.blob.vercel-storage.com';

export default async function FacturaFacilLogo() {
  let nombreEmpresa = null;

  try {
    const session = await auth();
    if (session?.user) {
      const empresa = await fetchEmpresaById(session.user.id_empresa.toString());
      if (empresa?.nombre) {
        nombreEmpresa = empresa.nombre;
      }
    }
  } catch (error) {
    console.error("Error obteniendo la info de la empresa:", error);
    nombreEmpresa = "Error BD";
  }



  return (
    //<div className={`${roboto.className} flex flex-col md:flex-row flex-wrap items-start leading-none text-white`}>
    //<div className={`${roboto.className} flex flex-col md:flex-row items-center md:items-start leading-none text-white w-full`}>
    <div className={`${roboto.className} flex md:flex-row items-center md:items-start leading-none text-white p-4`}>

      <Image
        src="/facturafacil_logo.png" // Ruta pública
        width={160}
        height={140}
        alt="Logo Factura Fácil"
        className="h-15 w-15 md:h-36 md:w-36 self-start"
        priority={true}
      />
      <div className="flex flex-col ml-4 items-start">
        <div className="flex flex-col md:flex-row items-start">
          <p className="text-[15px] md:text-[30px] self-start mr-4">Tu programa de gestión</p>
          <p className="text-[20px] md:text-[30px] self-start md:font-bold">AUTONOMO</p>
        </div>
        {nombreEmpresa && (
          <p className="text-[14px] md:text-[24px] mt-1 md:mt-2 text-green-100 font-medium uppercase tracking-wide">
            {nombreEmpresa}
          </p>
        )}
      </div>


    </div>
  );
}

export async function FacturaFacilUser() {
  let nombreUsuario = null;
  let imagenUsuario = "/user.png"; // Imagen por defecto mejorada

  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const usuario = await fetchUsersById(userId);
      if (usuario) {
        nombreUsuario = usuario.name;
        if (usuario.image_url) {
          // Si ya es una URL completa o ruta absoluta, la dejamos. Si no, ponemos el prefijo del Blob
          imagenUsuario = usuario.image_url.startsWith('http') || usuario.image_url.startsWith('/')
            ? usuario.image_url
            : `${BLOB_URL}/${usuario.image_url}`;
        }
      }
    }
  } catch (error) {
    console.error("Error obteniendo la info del usuario:", error);
    nombreUsuario = "Error BD";
  }

  return (
    <div className={`${roboto.className} flex md:flex-row items-center md:items-start leading-none text-white p-4`}>
      <Image
        src={imagenUsuario}
        width={60}
        height={60}
        alt="Logo Usuario"
        className="h-10 w-10 md:h-10 md:w-10 self-start"
        priority={true}
      />
      <div className="flex flex-col ml-3 items-center">
        {nombreUsuario && (
          <p className="text-[14px] md:text-[20px] mt-1 md:mt-2 text-green-100 font-medium uppercase tracking-wide">
            {nombreUsuario}
          </p>
        )}
      </div>
    </div>
  );
}
