'use client';

import { EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { sendInvoiceEmailAction } from '@/app/lib/actions';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import clsx from 'clsx';

interface SendInvoiceEmailButtonProps {
  invoice: Invoice;
  lines: invoices_lines[];
  customer: Customer;
  empresa: Empresas;
}

export default function SendInvoiceEmailButton({
  invoice,
  lines,
  customer,
  empresa,
}: SendInvoiceEmailButtonProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    if (status === 'sending') return;

    setStatus('sending');
    try {
      const result = await sendInvoiceEmailAction(invoice, lines, customer, empresa);
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
          'flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all shadow-sm active:scale-95',
          {
            'bg-blue-600 text-white hover:bg-blue-500': status === 'idle',
            'bg-gray-400 text-white cursor-not-allowed': status === 'sending',
            'bg-green-600 text-white': status === 'success',
            'bg-red-600 text-white': status === 'error',
          }
        )}
        title="Enviar factura por email al cliente"
      >
        {status === 'idle' && (
          <>
            <EnvelopeIcon className="h-5 w-5" />
            <span>Enviar Email</span>
          </>
        )}
        {status === 'sending' && (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Enviando...</span>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckIcon className="h-5 w-5" />
            <span>¡Enviado!</span>
          </>
        )}
        {status === 'error' && (
          <>
            <XMarkIcon className="h-5 w-5" />
            <span>Error</span>
          </>
        )}
      </button>

      {/* Mini notificación flotante */}
      {status !== 'idle' && status !== 'sending' && (
        <div className={clsx(
          "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded text-xs font-bold animate-bounce shadow-lg z-50",
          {
            "bg-green-100 text-green-800 border border-green-200": status === 'success',
            "bg-red-100 text-red-800 border border-red-200": status === 'error'
          }
        )}>
          {message}
        </div>
      )}
    </div>
  );
}
