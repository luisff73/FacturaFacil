// Este componente es el que se encarga de generar el PDF de la lista de facturas
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicesListPDF from './invoices-list-pdf';
import { InvoicesTable } from '@/app/lib/definitions';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ExportListButton({ invoices }: { invoices: InvoicesTable[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow opacity-50 flex items-center gap-2 text-sm font-medium cursor-not-allowed">
        <DocumentArrowDownIcon className="w-5 h-5" />
        Cargando...
      </div>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoicesListPDF invoices={invoices} />}
      fileName={`Listado_Facturas_${new Date().toISOString().split('T')[0]}.pdf`}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
    >
      {({ loading }) => (
        <>
          <DocumentArrowDownIcon className="w-5 h-5" />
          {loading ? 'Preparando...' : 'Exportar Listado (PDF)'}
        </>
      )}
    </PDFDownloadLink>
  );
}
