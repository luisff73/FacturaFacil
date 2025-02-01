import { fetchUsers } from '@/app/lib/data';
import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Usuario',
};

export default async function Page() {
  const users = await fetchUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuarios', href: '/dashboard/users' },
          {
            label: 'Crear Usuario',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <Form user={users} />
    </main>
  );
}
