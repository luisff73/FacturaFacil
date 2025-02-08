import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alta de clientes',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main className="dark:bg-gray-900">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Alta de clientes',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
