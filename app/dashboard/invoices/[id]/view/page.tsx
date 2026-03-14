import PrintButton from '@/app/ui/invoices/print-button';
import Link from 'next/link';
import { fetchInvoiceById, fetchinvoices_lines, fetchCustomersById, fetchEmpresaById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { roboto } from '@/app/ui/fonts';
import { invoices_lines } from '@/app/lib/definitions';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const invoice = await fetchInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const [lines, customer] = await Promise.all([
    fetchinvoices_lines(id),
    fetchCustomersById(invoice.customer_id),
  ]);

  const empresa = await fetchEmpresaById(invoice.id_empresa.toString());

  return (
    <main className={`${roboto.className} p-6 max-w-4xl mx-auto bg-white text-black min-h-screen shadow-2xl my-10 rounded-2xl border border-gray-100 flex flex-col print:m-0 print:shadow-none print:border-none print:rounded-none print:min-h-0 print:p-0`}>
      {/* Controles de la página (se ocultan al imprimir) */}
      <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-100 print:hidden">
        <Link
          href="/dashboard/invoices"
          className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a facturas
        </Link>
        <PrintButton />
      </div>

      {/* Contenido principal flexible */}
      <div className="flex-grow">
        {/* Cabecera de la factura */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-tight mb-2">Factura</h1>
            <p className="text-gray-500 font-medium">Nº: {invoice.id.substring(0, 8).toUpperCase()}</p>
            <p className="text-gray-500 font-medium">Fecha: {formatDateToLocal(invoice.date)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-green-600">{empresa?.nombre}</h2>
            <p className="text-gray-600">{empresa?.direccion}</p>
            <p className="text-gray-600">{empresa?.c_postal} - {empresa?.poblacion}</p>
            <p className="text-gray-600">CIF: {empresa?.cif}</p>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cliente</h3>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-xl font-bold text-gray-800 mb-1">{customer?.name}</p>
            <p className="text-gray-600">{customer?.email}</p>
            <p className="text-gray-600">{customer?.direccion}</p>
            <p className="text-gray-600">{customer?.c_postal} {customer?.poblacion}</p>
            <p className="text-gray-600">{customer?.cif}</p>
          </div>
        </div>

        {/* Tabla de líneas */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-gray-800 text-left">
              <th className="py-4 font-bold uppercase text-sm text-gray-600">Descripción</th>
              <th className="py-4 font-bold uppercase text-sm text-gray-600 text-right">Cantidad</th>
              <th className="py-4 font-bold uppercase text-sm text-gray-600 text-right">Precio</th>
              <th className="py-4 font-bold uppercase text-sm text-gray-600 text-right">Total línea</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line: invoices_lines) => (
              <tr key={line.linea} className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium text-gray-800">{line.descripcion}</p>
                  {line.observaciones && <p className="text-sm text-gray-500 italic">{line.observaciones}</p>}
                </td>
                <td className="py-4 text-right text-gray-600">{line.cantidad}</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(line.precio)}</td>
                <td className="py-4 text-right font-bold text-gray-800">{formatCurrency(line.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie de página (Totales y mensaje de cierre) */}
      <footer className="mt-auto pt-8 print:pt-4">
        {/* Totales */}
        <div className="flex justify-end mb-12 print:mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Base Imponible</span>
              <span className="font-medium">{formatCurrency(invoice.base_imponible)}</span>
            </div>

            {invoice.total_iva > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">IVA</span>
                <span className="font-medium">{formatCurrency(invoice.total_iva)}</span>
              </div>
            )}

            {invoice.total_recargo > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Recargo (RE)</span>
                <span className="font-medium">{formatCurrency(invoice.total_recargo)}</span>
              </div>
            )}

            <div className="flex justify-between py-4 mt-2 bg-gray-800 text-white px-4 rounded-lg print:bg-gray-100 print:text-black print:border print:border-gray-200">
              <span className="font-bold uppercase tracking-wider">Total</span>
              <span className="text-2xl font-bold">{formatCurrency(invoice.total_factura)}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 text-center text-gray-400 text-xs">
          <p>Gracias por su confianza.</p>
          <p className="mt-1">{empresa?.nombre} - Generado por FacturaFácil</p>
        </div>
      </footer>
    </main>
  );
}
