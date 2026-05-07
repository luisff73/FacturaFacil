"use client";

import {
  UserGroupIcon,
  UserCircleIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  TagIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'; // importa el componente Link de next
import { usePathname } from 'next/navigation';// importa el hook usePathname de next
import clsx from 'clsx'; // importa la libreria clsx


export default function NavLinks({ user }: { user?: { type?: 'admin' | 'user', id_empresa?: number } }) {
  const pathname = usePathname();

  // Map of links to display in the side navigation.
  const links = [
    { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
    { name: 'Facturación', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
    { name: 'Clientes', href: '/dashboard/customers', icon: UserGroupIcon },
    { name: 'Artículos', href: '/dashboard/articulos', icon: TagIcon },
    { name: 'Usuarios', href: '/dashboard/users', icon: UserCircleIcon, adminOnly: true },
    { name: 'Empresa', href: `/dashboard/empresas/${user?.id_empresa}/edit`, icon: BuildingOfficeIcon, adminOnly: true },
  ];

  // Filtramos los enlaces según el tipo de usuario
  const visibleLinks = links.filter(link => {
    // Si el enlace tiene adminOnly, solo lo mostramos si el usuario es admin
    if (link.adminOnly) {
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
              'flex h-[48px] grow items-center justify-center gap-4 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-color-user-200 dark:hover:bg-grey-900 hover:text-color-user-600 dark:text-white',
              {
                'bg-color-user-100 text-color-user-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
