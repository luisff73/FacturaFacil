import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card title="Facturado" value={totalPaidInvoices} type="collected" />
      <Card title="Pendiente" value={totalPendingInvoices} type="pending" />
      <Card title="Total Facturas" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Clientes"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" /> : null}
        <h3 className="ml-2 text-sm font-medium dark:text-gray-200">{title}</h3>
      </div>
      <p className={`${lusitana.className}
    truncate rounded-xl bg-white dark:bg-gray-900 px-4 py-8 text-center text-2xl dark:text-white`}>
        {value}
      </p>
    </div>
  );
}
