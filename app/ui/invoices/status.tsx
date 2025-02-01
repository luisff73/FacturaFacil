import { CheckIcon, ClockIcon, CloudIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';  /* importamos el fichero para aplicar las clases condicionalmente dependiendo de su estado */

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'Pendiente', /*aqui el estado Pendiente/pagado*/
          'bg-green-500 text-white': status === 'Pagada',
          'bg-red-500 text-white': status === 'Proforma',
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
          Pagada
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'Proforma' ? (
        <>
          Proforma
          <CloudIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
