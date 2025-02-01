
import { fetchFilteredUsers } from '@/app/lib/data';
import UsersTable from '@/app/ui/users/table';
import Search from '@/app/ui/search';
import { CreateUser } from '@/app/ui/users/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alta de usuarios',
};

export default async function Page(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams?.query) ? searchParams.query.join(' ') : searchParams?.query || '';
  //const currentPage = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;

  const users = await fetchFilteredUsers(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Usuarios</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Busqueda de usuarios ..." />
        <CreateUser />
      </div>
      <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
        <UsersTable users={users} />
      </Suspense>
    </div>
  );
}