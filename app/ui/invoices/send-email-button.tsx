'use client';

import { EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { sendInvoiceEmailAction, sendInvoiceEmailByIdAction } from '@/app/lib/actions';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import clsx from 'clsx';

interface SendInvoiceEmailButtonProps {
  invoice?: Invoice;
  lines?: invoices_lines[];
  customer?: Customer;
  empresa?: Empresas;
  invoiceId?: string;
  showText?: boolean; // Para ocultar el texto en la tabla y dejar solo el icono
}

export default function SendInvoiceEmailButton({
  invoice,
  lines,
  customer,
  empresa,
  invoiceId,
  showText = true,
}: SendInvoiceEmailButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    if (status === 'sending') return;

    setStatus('sending');
    try {
      let result;
      if (invoiceId) {
        result = await sendInvoiceEmailByIdAction(invoiceId);
      } else if (invoice && lines && customer && empresa) {
        result = await sendInvoiceEmailAction(invoice, lines, customer, empresa);
      } else {
        throw new Error('Faltan datos para el envío');
      }

      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
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

      {/* Mini notificación flotante */}
      {status !== 'idle' && status !== 'sending' && (
        <div className={clsx(
          "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded text-xs font-bold animate-bounce shadow-lg z-50",
          {
            "bg-color-user-100 text-color-user-800 border border-color-user-200": status === 'success',
            "bg-red-100 text-red-800 border border-red-200": status === 'error'
          }
        )}>
          {message}
        </div>
      )}
    </div>
  );
}
