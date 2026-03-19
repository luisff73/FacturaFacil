'use client';

import { useState, useEffect, useRef } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { invoices_lines, ArticulosTableType, Customer } from '@/app/lib/definitions';
import { getArticulosForInvoice } from '@/app/lib/actions';
import Image from 'next/image';

const BLOB_URL = (process.env.NEXT_PUBLIC_BLOB_URL || '').replace(/"/g, '');

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

  const [ settax_ivaDetails] = useState({
    bi: 0,
    iva: 0,
    re: 0,
    total: 0
  });

  const [searchResults, setSearchResults] = useState<ArticulosTableType[]>([]);
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [observacionesIndex, setObservaciones] = useState<number | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sincronizar líneas con las iniciales si estas cambian (por ejemplo, tras un error de validación)
  useEffect(() => {
    if (initialLines.length > 0) {
      setLines(initialLines);
    }
  }, [initialLines]);

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
    const bi = lines.reduce((acc, line) => acc + (Number(line.total) || 0), 0); // el reduce suma todos los totales de las lineas
    let tax_iva = 0;
    let rec_equivalencia = 0;

    // Priorizar los campos de la factura si existen (para edición), si no, usar los del cliente seleccionado
    const hasIva = invoice ? (Number(invoice.total_iva) > 0) : customer?.tiene_iva;
    const hasRe = invoice ? (Number(invoice.total_recargo) > 0) : customer?.tiene_re;

    if (hasIva) {
      const ivaRate = Number(empresaIva);
      tax_iva = bi * (ivaRate / 100);
      if (hasRe) {
        // Tasa de RE según IVA (Estándares en España)
        let reRate = 0.5; // Por defecto para IVA 4% o inferior
        if (ivaRate === 21) reRate = 5.2;
        else if (ivaRate === 10) reRate = 1.4;
        else if (ivaRate === 5 || ivaRate === 4) reRate = 0.5; // Ajustar si es necesario

        rec_equivalencia = bi * (reRate / 100);
      }
    }

    const total = bi + tax_iva + rec_equivalencia;

    // settax_ivaDetails({ bi, iva: tax_iva, re: rec_equivalencia, total });

    // Actualizar campos del formulario principal mediante el DOM para reflejar el desglose
    const biInput = document.querySelector('input[name="base_imponible"]') as HTMLInputElement;
    const biDisplay = document.querySelector('#base_imponible-display');
    const ivaDisplay = document.querySelector('#total_iva-display');
    const reDisplay = document.querySelector('#total_recargo-display');
    const totalDisplay = document.querySelector('#total_factura-display');

    if (biInput) biInput.value = bi.toFixed(2); // el biInput es el input oculto que se envia al formulario y el tofixed es para que tenga dos decimales
    if (biDisplay) biDisplay.textContent = bi.toFixed(2); // el biDisplay es el input visible que muestra el total de la factura
    if (ivaDisplay) ivaDisplay.textContent = tax_iva.toFixed(2); // el ivaDisplay es el input visible que muestra el total de la factura
    if (reDisplay) reDisplay.textContent = rec_equivalencia.toFixed(2); // el reDisplay es el input visible que muestra el total de la factura
    if (totalDisplay) totalDisplay.textContent = total.toFixed(2); // el totalDisplay es el input visible que muestra el total de la factura

  }, [lines, customer, empresaIva, invoice]); // el useeffect se ejecuta cada vez que cambia lines, customer, empresaIva o invoice

  const addLine = () => { // la funcion addLine se ejecuta cuando se hace clic en el boton de añadir linea
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
          <div className="md:col-span-6">Artículo / Descripción</div>
          <div className="md:col-span-2 text-center">Observaciones</div>
          <div className="md:col-span-1 text-center">Cantidad</div>
          <div className="md:col-span-1 text-center">Precio</div>
          <div className="md:col-span-1 text-center">Total</div>
          <div className="md:col-span-1 text-center">Eliminar</div>
        </div>

        {lines.map((line, index) => (
          <div key={index} className="flex flex-col gap-1 p-2 md:p-1 border md:border-none rounded-md bg-white dark:bg-gray-900 dark:border-gray-700 md:bg-transparent transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 items-center">
              {/* Búsqueda/Descripción */}
              <div className="md:col-span-6 relative">
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
                  <MagnifyingGlassIcon className="absolute right-2 top-1.5 h-3.5 w-3.5 text-gray-400" /> {/* la lupa es para buscar en la base de datos */}
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
              <div className="md:col-span-2 flex items-center justify-right">
                {/* <label className="block text-xs font-medium text-gray-500 mb-1 leading-none md:hidden">Observaciones</label> */}
                <button
                  type="button"
                  onClick={() => setObservaciones(index)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all border ${line.observaciones
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                    }`}
                  title="Editar observaciones"
                >
                  <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                  <span className="truncate max-w-[80px] md:max-w-[120px]">
                    {line.observaciones || 'Observaciones...'}
                  </span>
                </button>
              </div>

              {/* Grupo para móviles: Cantidad, Precio, Total y Eliminar */}
              <div className="md:col-span-4 grid grid-cols-4 gap-2 items-center border-t md:border-t-0 pt-2 md:pt-0 mt-1 md:mt-0">
                {/* Cantidad */}
                <div className="flex flex-col">
                  <label className="block text-[10px] font-medium text-gray-400 mb-1 text-center md:hidden uppercase">Cant.</label>
                  <input
                    type="number"
                    step="any" // permite decimales
                    lang="en" // fuerza el uso del punto como separador decimal
                    value={line.cantidad || 1}
                    onChange={(e) => updateLine(index, 'cantidad', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1 text-center"
                  />
                </div>

                {/* Precio */}
                <div className="flex flex-col">
                  <label className="block text-[10px] font-medium text-gray-400 mb-1 text-center md:hidden uppercase">Precio</label>
                  <input
                    type="number"
                    step="any" // permite decimales
                    lang="en" // fuerza el uso del punto como separador decimal
                    value={line.precio || 0}
                    onChange={(e) => updateLine(index, 'precio', e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 py-1 text-center"
                  />
                </div>

                {/* Total */}
                <div className="flex flex-col text-center">
                  <label className="block text-[10px] font-medium text-gray-400 mb-1 md:hidden uppercase">Total</label>
                  <div className="text-sm font-semibold dark:text-white md:pt-0 pt-1">
                    {line.total}€
                  </div>
                </div>

                {/* Eliminar */}
                <div className="flex flex-col items-center">
                  <label className="block text-[10px] font-medium text-gray-400 mb-1 md:hidden uppercase">Borrar</label>
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors mt-0.5 md:mt-0"
                    title="Eliminar línea"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
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

      {/* Modal para observaciones */}
      {observacionesIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border dark:border-gray-700 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-green-600" />
                Observaciones de la línea {observacionesIndex + 1}
              </h4>
              <button
                type="button"
                onClick={() => setObservaciones(null)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Cerrar"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4"> 
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Añade detalles adicionales o notas específicas para esta línea de la factura.
              </p>
              <textarea
                autoFocus
                value={lines[observacionesIndex].observaciones || ''}
                onChange={(e) => updateLine(observacionesIndex, 'observaciones', e.target.value)}
                placeholder="Escribe aquí las observaciones..."
                className="w-full h-40 text-sm border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-green-500 focus:border-green-500 resize-none p-3 shadow-inner"
              />
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => setObservaciones(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input oculto para enviar las líneas como JSON */}
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
    </div>
  );
}
