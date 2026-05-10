'use client';

import { PencilIcon, PlusIcon, TrashIcon, PrinterIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { useState } from 'react';

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

export function PrintInvoice({ id, showText = false }: { id: string, showText?: boolean }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/view`}
      className={
        showText
          ? "flex h-10 items-center rounded-lg bg-white px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 gap-2 border border-gray-200 shadow-sm"
          : "rounded-md border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 flex items-center justify-center"
      }
    >
      <PrinterIcon className="w-5 h-5" />
      {showText && <span>Imprimir</span>}
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

export function AnnulInvoice({ id }: { id: string }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        className="rounded-md border p-2 hover:bg-red-50 text-red-600 border-red-200"
        title="Anular Factura"
      >
        <XCircleIcon className="w-5" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800">¿Anular Factura?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Esta acción generará un registro de anulación oficial en la cadena VeriFactu. No se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <form action={async () => {
                const { annulInvoice } = await import('@/app/lib/actions');
                await annulInvoice(id);
                setShowConfirm(false);
              }}>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-lg shadow-red-200"
                >
                  Confirmar Anulación
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
