
import Form from '@/app/ui/empresas/create-form';
import Breadcrumbs from '@/app/ui/empresas/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Empresa',
};

export default async function Page() {
  // not required right now but kept if you later need list context

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Empresas', href: '/dashboard/empresas' },
          {
            label: 'Crear Empresa',
            href: '/dashboard/empresas/create',
            active: true,
          },
        ]}
      />
      {/* renderiza el formulario reutilizable */}
      <Form />
    </main>
  );
}
