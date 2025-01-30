import { fetchArticulos } from '@/app/lib/data';
import Form from '@/app/ui/articulos/create-form';
import Breadcrumbs from '@/app/ui/articulos/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alta de artículos',
};

export default async function Page() {
  const articulos = await fetchArticulos();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artículos', href: '/dashboard/articulos' },
          {
            label: 'Alta de artículos',
            href: '/dashboard/articulos/create',
            active: true,
          },
        ]}
      />
      <Form articulos={articulos} />
    </main>
  );
}