import EditArticulosForm from '@/app/ui/articulos/edit-form';
import Breadcrumbs from '@/app/ui/articulos/breadcrumbs';
import { fetchArticulosById } from '@/app/lib/data'; // obtener los datos de la base de datos
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArticulosTableType } from '@/app/lib/definitions'; // definiciones de los datos de la base de datos

export const metadata: Metadata = {
  title: 'Editar Articulo',
};

// interface PageProps {
//   params: { id: string }; // El tipo esperado para params
// }

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const articulo = await fetchArticulosById(id);

  if (!articulo) {
    notFound();
  }

  const articulos: ArticulosTableType = articulo; // Aquí uso la interfaz ArticulosTableType

  return (
    <main className="dark:bg-gray-900 min-h-screen p-4">
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Artículos', href: '/dashboard/articulos' },
          {
            label: 'Editar Articulo',
            href: `/dashboard/articulos/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="dark:bg-gray-800 rounded-lg">
        <EditArticulosForm articulo={articulos} />
      </div>
    </main>
  );
  
}