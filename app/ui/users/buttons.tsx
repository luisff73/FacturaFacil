
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteUser} from '@/app/lib/actions';

export function CreateUser() {
  return (
    <Link
      href="/dashboard/users/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <span className="hidden md:block">Crear usuario</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateUser({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteUser({ id }: { id: string }) {

  const deleteUserWithId = deleteUser.bind(null, id); // se crea una función deleteUserWithId que llama a la función deleteUser con el id del usuario

  // cuando se haga click en el botón se ejecutará la función deleteUserWithId
  return (
    <form action={deleteUserWithId}> 
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Borrar usuario</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}


