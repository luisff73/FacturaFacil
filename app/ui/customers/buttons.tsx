'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteCustomers } from '@/app/lib/actions';
import { useActionState, useState } from 'react';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-color-user-600 px-4 text-sm font-medium text-white transition-colors hover:bg-color-user-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-user-600"
    >
      <span className="hidden md:block">Nuevo cliente</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteCustomer({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomers.bind(null, id);
  const [state, formAction] = useActionState(deleteCustomerWithId, { message: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowConfirm(!showConfirm)}
        className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span className="sr-only">Borrar</span>
        <TrashIcon className="w-5" />
      </button>

      {showConfirm && !state?.message && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 shadow-lg min-w-[200px]">
          <p className="text-xs text-gray-700 dark:text-gray-200 mb-2">¿Estás seguro de que quieres borrar este cliente?</p>
          <div className="flex justify-end gap-2">
            <button 
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancelar
            </button>
            <form action={formAction}>
              <button 
                type="submit"
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Borrar
              </button>
            </form>
          </div>
        </div>
      )}

      {state?.message && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-md p-2 shadow-lg min-w-[200px]">
          <p className="text-red-500 text-xs">{state.message}</p>
          <button 
            type="button"
            onClick={() => { state.message = ''; setShowConfirm(false); }}
            className="text-[10px] text-gray-500 mt-1 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
