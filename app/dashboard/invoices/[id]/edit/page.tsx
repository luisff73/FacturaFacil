import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchinvoices_lines, fetchEmpresaById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modificacion de documentos',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [invoice, customers, lines] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
    fetchinvoices_lines(id),
  ]);

  if (!invoice) {
    notFound();
  }

  const empresa = await fetchEmpresaById(invoice.id_empresa.toString());

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Documentos', href: '/dashboard/invoices' },
          {
            label: 'Modificacion de documentos',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form 
        invoice={invoice} 
        customers={customers} 
        lines={lines} 
      />
    </main>
  );
}
