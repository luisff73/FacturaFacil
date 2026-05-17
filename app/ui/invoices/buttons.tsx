'use client';

import { PencilIcon, PlusIcon, TrashIcon, PrinterIcon, XCircleIcon, EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, sendInvoiceEmailByIdAction } from '@/app/lib/actions';
import { useState, useActionState } from 'react';
import clsx from 'clsx';

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
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const [state, formAction] = useActionState(deleteInvoiceWithId as any, { message: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setShowConfirm(!showConfirm)}
        className="rounded-md border p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <span className="sr-only">Borrar</span>
        <TrashIcon className="w-5" />
      </button>

      {showConfirm && !state?.message && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 shadow-lg min-w-[200px]">
          <p className="text-xs text-gray-700 dark:text-gray-200 mb-2">¿Estás seguro de que quieres borrar esta factura?</p>
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

interface SendInvoiceEmailButtonProps {
  invoiceId: string;
  showText?: boolean;
}

export function SendInvoiceEmailButton({
  invoiceId,
  showText = true,
}: SendInvoiceEmailButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    if (status === 'sending') return;

    setStatus('sending');
    try {
      const result = await sendInvoiceEmailByIdAction(invoiceId);

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setMessage('Error al conectar con el servidor');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={handleSendEmail}
        disabled={status === 'sending'}
        className={clsx(
          'flex items-center justify-center gap-2 rounded-md transition-all active:scale-95 border',
          showText ? 'h-10 px-4 text-sm font-medium shadow-sm' : 'p-2',
          {
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700': status === 'idle',
            'bg-gray-400 text-white cursor-not-allowed border-transparent': status === 'sending',
            'bg-color-user-600 text-white border-transparent': status === 'success',
            'bg-red-600 text-white border-transparent': status === 'error',
          }
        )}
        title="Enviar factura por email al cliente"
      >
        {status === 'idle' && (
          <>
            <EnvelopeIcon className="w-5" />
            {showText && <span>Enviar Email</span>}
          </>
        )}
        {status === 'sending' && (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {showText && <span>Enviando...</span>}
          </>
        )}
        {status === 'success' && (
          <>
            <CheckIcon className="h-5 w-5" />
            {showText && <span>¡Enviado!</span>}
          </>
        )}
        {status === 'error' && (
          <>
            <XMarkIcon className="h-5 w-5" />
            {showText && <span>Error</span>}
          </>
        )}
      </button>

      {status !== 'idle' && status !== 'sending' && (
        <div
          className={clsx(
            'absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded text-xs font-bold animate-bounce shadow-lg z-50',
            {
              'bg-color-user-100 text-color-user-800 border border-color-user-200': status === 'success',
              'bg-red-100 text-red-800 border border-red-200': status === 'error',
            }
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}
