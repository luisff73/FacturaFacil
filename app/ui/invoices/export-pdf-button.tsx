'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDFDocument from './invoice-pdf-document';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ExportPDFButton({
  invoice,
  lines,
  customer,
  empresa,
}: {
  invoice: Invoice;
  lines: invoices_lines[];
  customer: Customer;
  empresa: Empresas;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-color-user-600 text-white px-6 py-2 rounded-lg shadow opacity-50 flex items-center gap-2 font-bold cursor-not-allowed print:hidden">
        <ArrowDownTrayIcon className="w-5 h-5" />
        Cargando...
      </div>
    );
  }

  const isProforma = invoice.tipo === 'Pedido';
  const fileNamePrefix = isProforma ? 'Pedido' : 'Factura';

  return (
    <PDFDownloadLink
      document={<InvoicePDFDocument invoice={invoice} lines={lines} customer={customer} empresa={empresa} />}
      fileName={`${fileNamePrefix}_${invoice.id.substring(0, 8).toUpperCase()}.pdf`}
      className="bg-color-user-600 text-white px-6 py-2 rounded-lg shadow hover:bg-color-user-700 transition-colors flex items-center gap-2 font-bold print:hidden"
    >
      {({ loading }) => (
        <>
          <ArrowDownTrayIcon className="w-5 h-5" />
          {loading ? 'Preparando...' : 'Descargar PDF'}
        </>
      )}
    </PDFDownloadLink>
  );
}
