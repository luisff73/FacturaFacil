import EditEmpresaForm from '@/app/ui/empresas/edit-form';
import Breadcrumbs from '@/app/ui/empresas/breadcrumbs';
import { fetchEmpresaById, fetchEmpresas } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editar Empresa',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // Promise.all devuelve una tupla; damos nombres separados
  const [empresa, empresas] = await Promise.all([
    fetchEmpresaById(id),
    fetchEmpresas(),
  ]);

  if (!empresa) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Empresas', href: '/dashboard/empresas' },
          {
            label: 'Editar Empresa',
            href: `/dashboard/empresas/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditEmpresaForm empresa={empresa} />
    </main>
  );
}
