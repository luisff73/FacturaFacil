import { fetchCustomers, fetchEmpresaById, requireEmpresaId, fetchSeries } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creación de facturas',
};

export default async function Page() {
  const [customers, empresaId, series] = await Promise.all([
    fetchCustomers(),
    requireEmpresaId(),
    fetchSeries(),
  ]);
  const empresa = await fetchEmpresaById(empresaId.toString());

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Facturas', href: '/dashboard/invoices' },
          {
            label: 'Creación de facturas',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form 
        customers={customers} 
        series={series}
        empresaCif={empresa?.cif || ''} 
      />
    </main>
  );
}
