
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteArticulo } from '@/app/lib/actions';

export function CreateArticulo() {
  return (
    <Link
      href="/dashboard/articulos/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <span className="hidden md:block">Nuevo articulo</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateArticulo({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/articulos/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteArticulo({ id }: { id: string }) {
  const deleteArticuloWithId = deleteArticulo.bind(null, id);

  return (
    <form action={deleteArticuloWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Borrar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}