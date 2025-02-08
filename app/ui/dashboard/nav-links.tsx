"use client";

import {
  UserGroupIcon,
  UserCircleIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'; // importa el componente Link de next
import { usePathname } from 'next/navigation';// importa el hook usePathname de next
import clsx from 'clsx'; // importa la libreria clsx


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Facturas', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Clientes', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Productos', href: '/dashboard/articulos', icon: TagIcon },
  { name: 'Usuarios_protegido', href: '/dashboard/users', icon: UserCircleIcon, adminOnly: true },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserCircleIcon },
];

export default function NavLinks({ user }: { user?: { type?: 'admin' | 'user' } }) {
  const pathname = usePathname();

  // Filtramos los enlaces según el tipo de usuario
  const visibleLinks = links.filter(link => {
    // Si el enlace tiene adminOnly, solo lo mostramos si el usuario es admin
    if (link.adminOnly) {
      console.log('Tipo de usuario:', user?.type);
      return user?.type === 'admin';
    }
    // Si no tiene adminOnly, lo mostramos siempre
    return true;
  });

  return (
    <>
      {visibleLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link // Link es un componente de next que permite navegar entre paginas sin recargar la pagina
            key={link.name}
            href={link.href}
            className={clsx( // clsx es una libreria que permite concatenar clases de forma dinamica
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-900 hover:text-green-600 dark:text-white',
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
