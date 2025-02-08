import Image from 'next/image';
import { UpdateCustomer, DeleteCustomer } from '@/app/ui/customers/buttons';
import Search from '@/app/ui/search';

interface CustomersTableProps {
  customers: {
    total_pendiente: string;
    total_pagada: string;
    total_proforma: string;
    id: string;
    name: string;
    email: string;
    image_url: string;
    total_invoices: number;
  }[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="w-full">
      <Search placeholder="Buscar clientes..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white dark:bg-gray-900 p-4"
                  >
                    <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image_url}
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p className="dark:text-white">{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <UpdateCustomer id={customer.id} />
                        <DeleteCustomer id={customer.id} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b dark:border-gray-700 py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs dark:text-gray-400">Pendiente</p>
                        <p className="font-medium dark:text-white">{customer.total_pendiente}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs dark:text-gray-400">Pagado</p>
                        <p className="font-medium dark:text-white">{customer.total_pagada}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm dark:text-gray-300">
                      <p>{customer.total_invoices} invoices</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 dark:text-white md:table">
                <thead className="rounded-md bg-gray-50 dark:bg-gray-800 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200 sm:pl-6">
                      Nombre
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Correo Electronico
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Total Facturas
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Total Pendiente
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200">
                      Total Pagado
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200">
                      Total Proforma
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group">
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 py-5 pl-4 pr-3 text-sm text-black dark:text-white group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {customer.total_invoices}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {customer.total_pendiente}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200 group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.total_pagada}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200 group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.total_proforma}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm">
                        <div className="flex items-center gap-2">
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
