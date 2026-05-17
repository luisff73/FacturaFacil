import { CheckIcon, ClockIcon, CloudIcon, LockClosedIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';  /* importamos el fichero para aplicar las clases en css condicionalmente dependiendo de su estado */

export default function InvoiceStatus({ status, tipo, bloqueada }: { status: string, tipo?: string, bloqueada?: boolean }) {
  const isPedido = tipo === 'Pedido';
  return (
    <div className="flex items-center gap-2">
      <span
        className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-500 text-white': status === 'Pendiente', /*aqui el estado Pendiente/pagado*/
          'bg-color-user-500 text-white': status === 'Pagada',
          'bg-red-100 text-red-700 border border-red-200': !isPedido && status === 'Anulada',
          
        },
      )}
    >
      {status === 'Pendiente' ? (
        <>
          Pendiente
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'Pagada' ? (
        <>
          Pagado
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {!isPedido && status === 'Anulada' ? (
        <>
          Anulada
          <XCircleIcon className="ml-1 w-4 text-red-700" />
        </>
      ) : null}

    </span>
      {bloqueada && (
        <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-1.5 text-red-600" title="Factura bloqueada (VeriFactu)">
          <LockClosedIcon className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
