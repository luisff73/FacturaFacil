import { fetchCustomers, fetchEmpresaById, requireEmpresaId, fetchSeries } from '@/app/lib/data';
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creación de documentos',
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
          { label: 'Documentos', href: '/dashboard/invoices' },
          {
            label: 'Creación de documentos',
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
