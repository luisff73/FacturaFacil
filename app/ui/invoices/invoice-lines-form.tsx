'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { invoices_lines, ArticulosTableType, Customer } from '@/app/lib/definitions';
import { getArticulosForInvoice } from '@/app/lib/actions';
import Image from 'next/image';

const BLOB_URL = (process.env.NEXT_PUBLIC_BLOB_URL || 'https://tqqqihkzj4uwev0c.public.blob.vercel-storage.com').replace(/"/g, '');

interface InvoiceLinesFormProps {
  initialLines?: invoices_lines[];
  customer?: Customer;
  invoice?: any; // Usamos any para evitar problemas de tipos circulares o simplemente Invoice
  empresaIva?: number;
}

export default function InvoiceLinesForm({ initialLines = [], customer, invoice, empresaIva = 21 }: InvoiceLinesFormProps) {
  const [lines, setLines] = useState<Partial<invoices_lines>[]>(
    initialLines.length > 0
      ? initialLines
      : [{ linea: 1, descripcion: '', observaciones: '', cantidad: 1, precio: 0, total: 0, id_articulo: 0 }]
  );

  const [taxDetails, setTaxDetails] = useState({
    bi: 0,
    iva: 0,
    re: 0,
    total: 0
  });

  const [searchResults, setSearchResults] = useState<ArticulosTableType[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateLine = (index: number, field: keyof invoices_lines, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };

    // Recalcular total si cambia cantidad o precio
    if (field === 'cantidad' || field === 'precio') {
      const qty = field === 'cantidad' ? parseFloat(value) || 0 : newLines[index].cantidad || 0;
      const price = field === 'precio' ? parseFloat(value) || 0 : newLines[index].precio || 0;
      newLines[index].total = Number((qty * price).toFixed(2));
    }

    setLines(newLines);
  };

  useEffect(() => {
    const bi = lines.reduce((acc, line) => acc + (Number(line.total) || 0), 0);
    let tax = 0;
    let surcharge = 0;

    // Priorizar los campos de la factura si existen (para edición), si no, usar los del cliente seleccionado
    const hasIva = invoice ? (Number(invoice.total_iva) > 0) : customer?.tiene_iva;
    const hasRe = invoice ? (Number(invoice.total_recargo) > 0) : customer?.tiene_re;

    if (hasIva) {
      tax = bi * (empresaIva / 100);
      if (hasRe) {
        // Tasa de RE aproximada según IVA
        const reRate = empresaIva === 21 ? 5.2 : (empresaIva === 10 ? 1.4 : 0.5);
        surcharge = bi * (reRate / 100);
      }
    }

    const total = bi + tax + surcharge;

    setTaxDetails({ bi, iva: tax, re: surcharge, total });

    // Actualizar campos del formulario principal mediante el DOM para reflejar el desglose
    const biInput = document.querySelector('input[name="base_imponible"]') as HTMLInputElement;
    const biDisplay = document.querySelector('#base_imponible-display');
    const ivaDisplay = document.querySelector('#total_iva-display');
    const reDisplay = document.querySelector('#total_recargo-display');
    const totalDisplay = document.querySelector('#total_factura-display');

    if (biInput) biInput.value = bi.toFixed(2);
    if (biDisplay) biDisplay.textContent = bi.toFixed(2);
    if (ivaDisplay) ivaDisplay.textContent = tax.toFixed(2);
    if (reDisplay) reDisplay.textContent = surcharge.toFixed(2);
    if (totalDisplay) totalDisplay.textContent = total.toFixed(2);

  }, [lines, customer, empresaIva]);

  const addLine = () => {
    setLines([
      ...lines,
      {
        linea: lines.length + 1,
        descripcion: '',
        observaciones: '',
        cantidad: 1,
        precio: 0,
        total: 0,
        id_articulo: 0
      }
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    const newLines = lines.filter((_, i) => i !== index).map((line, i) => ({
      ...line,
      linea: i + 1
    }));
    setLines(newLines);
  };

  const handleSearch = async (query: string, index: number) => {
    setActiveSearchIndex(index);
    if (!query) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      const results = await getArticulosForInvoice(query);
      setSearchResults(results);
    }, 300);
  };

  const selectArticle = (article: ArticulosTableType, index: number) => {
    const newLines = [...lines];
    newLines[index] = {
      ...newLines[index],
      id_articulo: Number(article.id),
      descripcion: article.descripcion,
      precio: Number(article.precio),
      cantidad: 1,
      total: Number(article.precio)
    };
    setLines(newLines);
    setSearchResults([]);
    setActiveSearchIndex(null);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Líneas de Factura</h3>
      <div className="space-y-1">
        {/* Cabecera para detalle de lineas de factura */}
        <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 pb-1 border-b dark:border-gray-700 text-[10px] font-semibold uppercase text-gray-500 tracking-wider">
          <div className="md:col-span-4">Artículo / Descripción</div>
          <div className="md:col-span-3">Observaciones</div>
          <div className="md:col-span-1 text-center">Cantidad</div>
          <div className="md:col-span-2 text-center">Precio</div>
          <div className="md:col-span-1 text-center">Total línea</div>
          <div className="md:col-span-1"></div>
        </div>

        {lines.map((line, index) => (
          <div key={index} className="flex flex-col gap-1 p-2 md:p-1 border md:border-none rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 md:bg-transparent transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 items-center">
              {/* Búsqueda/Descripción */}
              <div className="md:col-span-4 relative">
                <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Artículo / Descripción</label>
                <div className="relative">
                  <input
                    type="text"
                    value={line.descripcion || ''}
                    onChange={(e) => {
                      updateLine(index, 'descripcion', e.target.value);
                      handleSearch(e.target.value, index);
                    }}
                    placeholder="Buscar o escribir descripción..."
                    className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1"
                  />
                  <MagnifyingGlassIcon className="absolute right-2 top-1.5 h-3.5 w-3.5 text-gray-400" />
                </div>

                {activeSearchIndex === index && searchResults.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-2xl max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                    {searchResults.map((art) => (
                      <li
                        key={art.id}
                        onClick={() => selectArticle(art, index)}
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative">
                            {art.imagen && art.imagen[0] ? (
                              <Image
                                src={art.imagen[0].ruta.startsWith('http') ? art.imagen[0].ruta : `${BLOB_URL}/${art.imagen[0].ruta}`}
                                alt={art.descripcion}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 uppercase">S/F</div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                              {art.descripcion}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] px-1 py-0 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 font-mono">
                                {art.codigo}
                              </span>
                              <span className="text-[10px] text-green-600 font-medium">
                                {art.precio}€
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {activeSearchIndex === index && (
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                      setSearchResults([]);
                      setActiveSearchIndex(null);
                    }}
                  />
                )}
              </div>

              {/* Observaciones */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Observaciones</label>
                <input
                  type="text"
                  value={line.observaciones || ''}
                  onChange={(e) => updateLine(index, 'observaciones', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1"
                />
              </div>

              {/* Cantidad */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Cantidad</label>
                <input
                  type="number"
                  value={line.cantidad || 1}
                  onChange={(e) => updateLine(index, 'cantidad', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1 text-center"
                />
              </div>

              {/* Precio */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={line.precio || 0}
                  onChange={(e) => updateLine(index, 'precio', e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1 text-center"
                />
              </div>

              {/* Total */}
              <div className="md:col-span-1 text-center">
                <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Total línea</label>
                <div className="text-sm font-semibold md:pt-0 dark:text-white">
                  {line.total}€
                </div>
              </div>

              {/* Eliminar */}
              <div className="md:col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeLine(index)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                  title="Eliminar línea"
                >
                  <span className="sr-only">Eliminar línea</span>
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLine}
        className="mt-4 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
      >
        <PlusIcon className="h-4 w-4" /> Añadir línea
      </button>

      {/* Resumen de totales */}
      <div className="mt-6 flex justify-end">
        <div className="w-full md:w-64 space-y-2 border-t dark:border-gray-700 pt-4">
          {taxDetails.iva > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">IVA ({empresaIva}%):</span>
              <span className="font-medium dark:text-white">{taxDetails.iva.toFixed(2)}€</span>
            </div>
          )}
          {taxDetails.re > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Recargo (RE):</span>
              <span className="font-medium dark:text-white">{taxDetails.re.toFixed(2)}€</span>
            </div>
          )}
        </div>
      </div>

      {/* Input oculto para enviar las líneas como JSON */}
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
    </div>
  );
}
