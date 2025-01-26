import { fetchFilteredCustomers, fetchCustomersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import CustomersTable from '@/app/ui/customers/table';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clientes',
};

export default async function Page(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const query = Array.isArray(searchParams?.query) ? searchParams.query.join(' ') : searchParams?.query || '';
  const currentPage = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;

  const totalPages = await fetchCustomersPages(query);
  const customers = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>Clientes</h1>
        <CreateCustomer />
      </div>
      <CustomersTable customers={customers} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
