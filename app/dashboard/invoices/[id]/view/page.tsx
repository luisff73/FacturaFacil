import PrintButton from '@/app/ui/invoices/print-button';
import ExportPDFButton from '@/app/ui/invoices/export-pdf-button';
import Link from 'next/link';
import { fetchInvoiceById, fetchinvoices_lines, fetchCustomersById, fetchEmpresaById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { roboto } from '@/app/ui/fonts';
import { invoices_lines } from '@/app/lib/definitions';
import QRCodePreview from '@/app/ui/invoices/qrcode-preview';

import SendInvoiceEmailButton from '@/app/ui/invoices/send-email-button';

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
          Volver a documentos
        </Link>
        <div className="flex gap-4">
          <PrintButton />
          {invoice && customer && empresa && (
            <>
                            <ExportPDFButton
                invoice={invoice}
                lines={lines}
                customer={customer}
                empresa={empresa}
              />
              <SendInvoiceEmailButton
                invoice={invoice}
                lines={lines}
                customer={customer}
                empresa={empresa}
              />

            </>
          )}
        </div>
      </div>

      {/* Contenido principal flexible */}
      <div className="flex-grow">
        {/* Cabecera del documento */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-tight mb-2">{invoice.tipo}</h1>
            <p className="text-gray-500 font-medium tracking-wide">
              Nº: {new Date(invoice.date).getFullYear()}/{invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}{invoice.invoice_number}
            </p>
            <p className="text-gray-500 font-medium">Fecha: {formatDateToLocal(invoice.date)}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-color-user-600">{empresa?.nombre}</h2>
            <p className="text-gray-600">{empresa?.direccion}</p>
            <p className="text-gray-600">{empresa?.c_postal} - {empresa?.poblacion}</p>
            <p className="text-gray-600">{empresa?.provincia}</p>
            <p className="text-gray-600">CIF: {empresa?.cif}</p>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="mb-12">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cliente</h3>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-xl font-bold text-gray-800 mb-1">{customer?.name}</p>
            <p className="text-gray-600">{customer?.direccion}</p>
            <p className="text-gray-600">{customer?.c_postal} {customer?.poblacion}</p>
            <p className="text-gray-600">{customer?.provincia}</p>
            <p className="text-gray-600">{customer?.pais}</p>
            <p className="text-gray-600">{customer?.cif}</p>
            <p className="text-gray-600">{customer?.email}</p>

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
                <td className="py-4 text-right text-gray-600">{(line.cantidad / 100).toFixed(2)}</td>
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

        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left text-gray-400 text-xs">
            <p>Gracias por su confianza.</p>
            <p className="mt-1">{empresa?.nombre} - Generado por FacturaFácil</p>
          </div>

          {/* QR de verificación Verifactu (AEAT) */}
          {invoice.tipo === 'Factura' && empresa?.cif && (
            invoice.bloqueada ? (
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 print:bg-transparent print:border-none">
                <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
                  <QRCodePreview
                    cif={empresa.cif}
                    serie={invoice.invoice_serie}
                    numero={invoice.invoice_number}
                    fecha={invoice.date}
                    importe={invoice.total_factura}
                    size={64}
                  />
                </div>
                <div className="text-left max-w-[200px]">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight flex items-center gap-1.5">
                    VERI*FACTU
                    <span className="w-1.5 h-1.5 bg-color-user-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,1)] print:hidden" />
                  </p>
                  <p className="text-[8px] text-gray-500 mt-1 font-medium leading-tight">Esta factura cumple con los requisitos de la normativa de la Agencia Tributaria.</p>
                  {invoice.hash && (
                    <div className="mt-2 text-[7px] text-gray-300 font-mono break-all leading-none bg-gray-50/50 p-1 rounded border border-gray-100/50">
                      ID_HUÉRGARA: {invoice.hash.substring(0, 16)}...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500 print:bg-transparent print:border-l-4 print:border-amber-500">
                <div className="text-left">
                  <p className="text-[12px] font-bold text-amber-600 uppercase tracking-tight mb-1">
                    PENDIENTE DE VALIDACIÓN FISCAL
                  </p>
                  <p className="text-[10px] text-amber-800 font-medium leading-tight">Documento interno sin validez fiscal hasta su confirmación y bloqueo definitivo.</p>
                </div>
              </div>
            )
          )}
        </div>
      </footer>
    </main>
  );
}
