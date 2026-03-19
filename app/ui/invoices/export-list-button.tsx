// Este componente es el que se encarga de generar el PDF de la lista de facturas
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicesListPDF from './invoices-list-pdf';
import { InvoicesTable } from '@/app/lib/definitions';
import { DocumentArrowDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useMemo } from 'react';

export default function ExportListButton({ invoices, companyName }: { invoices: InvoicesTable[], companyName: string }) {
  const [isClient, setIsClient] = useState(false);


  // estados para los filtros
  const [desdeFecha, setdesdeFecha] = useState('');
  const [hastaFecha, sethastaFecha] = useState('');
  const [filtroCliente, setfiltroCliente] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [numberFilter, setNumberFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  // Función para filtrar las facturas
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const d = new Date(invoice.date);
      const fechaFactura = d.getFullYear() + '-' + 
        String(d.getMonth() + 1).padStart(2, '0') + '-' + 
        String(d.getDate()).padStart(2, '0');
      
      const matchesFecha = (!desdeFecha && !hastaFecha) ? true : (desdeFecha ? fechaFactura >= desdeFecha : true) && (hastaFecha ? fechaFactura <= hastaFecha : true);
      const matchesCliente = filtroCliente ? invoice.name.toLowerCase().includes(filtroCliente.toLowerCase()) : true;
      const matchesEstado = statusFilter ? invoice.status === statusFilter : true;
      const matchesFactura = numberFilter ? invoice.invoice_number.toString().includes(numberFilter) : true;
      return matchesFecha && matchesCliente && matchesEstado && matchesFactura;
    });
  }, [invoices, desdeFecha, hastaFecha, filtroCliente, statusFilter, numberFilter]);

  if (!isClient) {
    return (
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow opacity-50 flex items-center gap-2 text-sm font-medium cursor-not-allowed">
        <DocumentArrowDownIcon className="w-5 h-5" />
        Cargando...
      </div>
    );
  }

  return (

    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">

        {/* Botón de Descarga */}

        <PDFDownloadLink
          document={<InvoicesListPDF invoices={filteredInvoices} companyName={companyName} />}
          fileName={`Listado_Facturas_${new Date().toISOString().split('T')[0]}.pdf`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          aria-label="Exportar listado de facturas"
        >
          {({ loading }) => (
            <>
              <DocumentArrowDownIcon className="w-5 h-5" />
              {loading ? 'Preparando...' : `Exportar (${filteredInvoices.length}) PDF`}
            </>
          )}
        </PDFDownloadLink>

        {/* Botón para mostrar/ocultar filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${showFilters || desdeFecha || hastaFecha || numberFilter || filtroCliente || statusFilter
            ? 'bg-blue-50 border-blue-200 text-blue-600'
            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          title="Filtrar listado"
          aria-label="Filtrar listado"
        >
          {desdeFecha || hastaFecha || numberFilter || filtroCliente || statusFilter ? (
            <div className="relative">
              <FunnelIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
          ) : (
            <FunnelIcon className="w-5 h-5" />
          )}
        </button>

      </div>

      {/* Panel de Filtros */}
      {showFilters && (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 px-1">Desde Fecha</label>
            <input
              type="date"
              value={desdeFecha}
              onChange={(e) => setdesdeFecha(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 px-1">Hasta Fecha</label>
            <input
              type="date"
              value={hastaFecha}
              onChange={(e) => sethastaFecha(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 px-1">Nº Factura</label>
            <input
              type="text"
              placeholder="Ej: 125"
              value={numberFilter}
              onChange={(e) => setNumberFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 w-24"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 px-1">Cliente</label>
            <input
              type="text"
              placeholder="Ej: Juan"
              value={filtroCliente}
              onChange={(e) => setfiltroCliente(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 w-24"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 px-1">Estado</label>
            <select
              name="statusFilter"
              id="statusFilter"
              aria-label="Filtro de estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 w-24"
            >
              <option value="">Todos</option>
              <option value="Pagada">Pagada</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          {(desdeFecha || hastaFecha || numberFilter || filtroCliente || statusFilter) && (
            <button
              onClick={() => { setdesdeFecha(''); sethastaFecha(''); setNumberFilter(''); setfiltroCliente(''); setStatusFilter(''); }}
              className="self-end p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Limpiar filtros"
              aria-label="Limpiar filtros"  
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
