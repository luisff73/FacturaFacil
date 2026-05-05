// Este componente es el que se encarga de generar el PDF de la lista de facturas
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicesListPDF from './invoices-list-pdf';
import { InvoicesTable } from '@/app/lib/definitions';
import { formatDateToLocal } from '@/app/lib/utils';
import { DocumentArrowDownIcon, FunnelIcon, XMarkIcon, ChevronDownIcon, TableCellsIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useMemo, useRef } from 'react';

export default function ExportListButton({ invoices, companyName }: { invoices: InvoicesTable[], companyName: string }) {
  const [isClient, setIsClient] = useState(false);


  // estados para los filtros
  const [desdeFecha, setdesdeFecha] = useState('');
  const [hastaFecha, sethastaFecha] = useState('');
  const [filtroCliente, setfiltroCliente] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [numberFilter, setNumberFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false); // showExportMenu es el valor actual del desplegable de exportación el valor es true si el desplegable esta abierto y false si esta cerrado
  const menuRef = useRef<HTMLDivElement>(null); // menuRef es la referencia al elemento que contiene el desplegable de exportación


  useEffect(() => {
    setIsClient(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    const headers = ['Serie', 'Nº Factura', 'Fecha', 'Cliente', 'CIF', 'Base Imponible', 'IVA', 'Recargo', 'Total', 'Estado'];
    
    const csvContent = [
      headers.join(';'),
      ...filteredInvoices.map(invoice => [
        `"${invoice.invoice_serie}"`,
        `"${new Date(invoice.date).getFullYear()}/${invoice.invoice_number}"`,
        `"${formatDateToLocal(invoice.date)}"`,
        `"${invoice.name}"`,
        `"${invoice.cif}"`,
        (invoice.base_imponible / 100).toString().replace('.', ','),
        (invoice.total_iva / 100).toString().replace('.', ','),
        (invoice.total_recargo / 100).toString().replace('.', ','),
        (invoice.total_factura / 100).toString().replace('.', ','),
        `"${invoice.status}"`
      ].join(';'))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Listado_Facturas_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportMenu(false);
  };

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
      <div 
        className="bg-color-user-600 text-white px-4 py-2 rounded-lg shadow opacity-50 flex items-center gap-2 text-sm font-medium cursor-not-allowed"
      >
        <DocumentArrowDownIcon className="w-5 h-5" />
        Cargando...
      </div>
    );
  }

  return (

    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">

        {/* Botón de Exportación con Desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)} // al hacer clic en el botón se abre o se cierra el desplegable
            className="bg-color-user-600 text-white px-4 py-2 rounded-lg shadow hover:bg-color-user-500 transition-all flex items-center gap-2 text-sm font-medium"
            aria-label="Opciones de exportación"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            <span>Exportar ({filteredInvoices.length})</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <PDFDownloadLink
                key={`pdf-${filteredInvoices.length}-${desdeFecha}-${hastaFecha}-${filtroCliente}-${statusFilter}-${numberFilter}`}
                document={<InvoicesListPDF invoices={filteredInvoices} companyName={companyName} />}
                fileName={`Listado_Facturas_${new Date().toISOString().split('T')[0]}.pdf`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors w-full"
              >
                {({ loading }) => (
                  <>
                    <PrinterIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    <span>{loading ? 'Generando PDF...' : 'Imprimir PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors w-full text-left"
              >
                <TableCellsIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span>Exportar a CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Botón para mostrar/ocultar filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${showFilters || desdeFecha || hastaFecha || numberFilter || filtroCliente || statusFilter
            ? 'bg-color-user-600 border-transparent text-white shadow-sm'
            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          title="Filtrar listado"
          aria-label="Filtrar listado"
        >
          {desdeFecha || hastaFecha || numberFilter || filtroCliente || statusFilter ? (
            <div className="relative">
              <FunnelIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
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
