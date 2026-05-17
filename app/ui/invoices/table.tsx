import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice, PrintInvoice, AnnulInvoice, SendInvoiceEmailButton } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || '';

export default async function InvoicesTable({query,currentPage,}: {query: string;currentPage: number;}) {

  const invoices = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
          <div className="md:hidden"> {/* Este div es para móviles */}
            {invoices?.map((invoice) => (
              <div key={invoice.id} className="mb-4 w-full rounded-md bg-white dark:bg-gray-900 p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center min-w-[28px] h-7 rounded-full text-xs font-bold text-white ${
                          invoice.tipo === 'Factura' ? 'bg-color-user-500' : 'bg-gray-400'
                        }`}
                        title={invoice.tipo}
                      >
                        {invoice.tipo === 'Factura' ? 'VF' : 'VP'}
                      </div>
                      <p className="text-sm font-bold dark:text-white">
                        {new Date(invoice.date).getFullYear()}/{invoice.invoice_serie}/{invoice.invoice_number}
                      </p>
                      <p className="dark:text-white ml-2 truncate">{invoice.name}</p>
                    </div>
                  </div>
                  {/* <InvoiceStatus status={invoice.status} tipo={invoice.tipo} bloqueada={invoice.bloqueada} /> */}
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <p className="dark:text-gray-300">{formatDateToLocal(invoice.date)}</p>
                    <p className="text-lg font-medium dark:text-white">
                      {formatCurrency(invoice.total_factura)}
                    </p>

                  </div>
                  <div className="flex justify-end gap-2 px-2 py-4 text-sm flex-wrap">
                    <SendInvoiceEmailButton invoiceId={invoice.id} showText={false} />
                    <PrintInvoice id={invoice.id} />
                    <UpdateInvoice id={invoice.id} />
                    {invoice.bloqueada && invoice.status !== 'Anulada' ? (
                      <AnnulInvoice id={invoice.id} />
                    ) : !invoice.bloqueada && (
                      <DeleteInvoice id={invoice.id} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 dark:text-white md:table"><thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200 sm:pl-6">
                  Documento
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Fecha
                </th>
                <th scope="col" className="w-[40%] px-3 py-5 font-medium dark:text-gray-200">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                  Estado
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b dark:border-gray-700 py-1 text-sm last-of-type:border-none hover:bg-gray-100 dark:hover:bg-gray-800 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-9 h-7 rounded-full text-xs font-bold text-white ${
                          invoice.tipo === 'Factura' ? 'bg-color-user-500' : 'bg-gray-400'
                        }`}
                        title={invoice.tipo}
                      >
                        {invoice.tipo === 'Factura' ? 'VF' : 'VP'}
                      </div>
                      <span className="font-bold">
                        {new Date(invoice.date).getFullYear()}/{invoice.invoice_serie}/{invoice.invoice_number}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1">
                    <div className="flex items-center gap-3">

                      <p className="dark:text-white">{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1 dark:text-gray-200">
                    {formatCurrency(invoice.total_factura)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1">
                    <InvoiceStatus status={invoice.status} tipo={invoice.tipo} bloqueada={invoice.bloqueada} />
                  </td>
                  <td className="flex justify-end gap-2 whitespace-nowrap px-2 py-1 text-sm">
                    <SendInvoiceEmailButton invoiceId={invoice.id} showText={false} />
                    <PrintInvoice id={invoice.id} />
                    <UpdateInvoice id={invoice.id} />
                    {invoice.bloqueada && invoice.status !== 'Anulada' ? (
                      <AnnulInvoice id={invoice.id} />
                    ) : !invoice.bloqueada && (
                      <DeleteInvoice id={invoice.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
