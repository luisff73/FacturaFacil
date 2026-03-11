import Pagination from '@/app/ui/empresas/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/empresas/table';
import { CreateEmpresa } from '@/app/ui/empresas/buttons';
import { lusitana } from '@/app/ui/fonts';
import { EmpresasTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchEmpresasPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Empresas',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // Fetch the total number of pages para la búsqueda de empresas
  const totalPages = await fetchEmpresasPages(query);

  return (
    <div className="w-full p-8">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Empresas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Busqueda de empresas ..." />
        <CreateEmpresa />
      </div>
      <Suspense key={query + currentPage} fallback={<EmpresasTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
