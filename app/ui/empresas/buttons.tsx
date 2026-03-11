
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteEmpresa } from '@/app/lib/actions';

export function CreateEmpresa() {
  return (
    <Link
      href="/dashboard/empresas/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <span className="hidden md:block">Crear empresa</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEmpresa({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/empresas/${id}/edit`}
      //href={`/empresas/edit-form`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteEmpresa({ id }: { id: string }) {

  const deleteEmpresaWithId = deleteEmpresa.bind(null, id); // se crea una función deleteEmpresaWithId que llama a la función deleteEmpresa con el id de la empresa

  // cuando se haga click en el botón se ejecutará la función deleteEmpresaWithId
  return (
    <form action={deleteEmpresaWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Borrar empresa</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}


