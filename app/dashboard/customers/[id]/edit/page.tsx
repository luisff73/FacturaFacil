import EditCustomerForm from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomersById } from '@/app/lib/data'; // obtener los datos de la base de datos
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Customer } from '@/app/lib/definitions'; // definiciones de los datos de la base de datos

export const metadata: Metadata = {
  title: 'Editar Cliente',
};

interface PageProps {
  params: { id: string }; // El tipo esperado para params
}

export default async function Page({ params }: PageProps) {
  const id = params.id;
  const customers = await fetchCustomersById(id);

  if (!customers || customers.length === 0) {
    notFound();
  }

  const customer = customers[0];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Editar Cliente',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} />
    </main>
  );
}