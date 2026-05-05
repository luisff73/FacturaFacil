import { PencilIcon, PlusIcon, TrashIcon, PrinterIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-color-user-600 px-4 text-sm font-medium text-white transition-colors hover:bg-color-user-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-user-600 shadow-sm active:scale-95"
    >
      <span className="hidden md:block">Crear documento</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function PrintInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/view`}
      className="rounded-md border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <PrinterIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id); // bind es para pasarle el id a la función deleteInvoice

  return (
    <form action={deleteInvoiceWithId as any}>
      <button className="rounded-md border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
        <span className="sr-only">Borrar</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
