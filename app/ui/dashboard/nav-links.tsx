'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'; // importa el componente Link de next
import { usePathname } from 'next/navigation';// importa el hook usePathname de next
import clsx from 'clsx'; // importa la libreria clsx


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Facturas',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Clientes', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon; // LinkIcon es el icono que se va a mostrar en el link
        return (
          <Link // Link es un componente de next que permite navegar entre paginas sin recargar la pagina
            key={link.name}
            href={link.href}
            className={clsx( // clsx es una libreria que permite concatenar clases de forma dinamica
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-green-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p> {/*este parrafo solo se muestra en pantallas grandes*/}
          </Link>
        );
      })}
    </>
  );
}
