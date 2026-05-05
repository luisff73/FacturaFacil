'use client';
import { Customer, Invoice, invoices_lines } from '@/app/lib/definitions';
import { CheckIcon, ClockIcon, CloudIcon, CurrencyEuroIcon, UserCircleIcon, CalendarIcon, HashtagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState, useState, useEffect } from 'react';
import InvoiceLinesForm from '@/app/ui/invoices/invoice-lines-form';
import QRCodePreview from '@/app/ui/invoices/qrcode-preview';
import React from 'react';

export default function EditInvoiceForm({ invoice, customers, lines }: {
  invoice: Invoice;
  customers: Customer[];
  lines: invoices_lines[];
}) {
  const initialState: State = { message: '', errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id); //bind para pasar el id de la factura
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState); //useActionState para manejar el estado de la accion de editar la factura
  const [selectedCustomerId, setSelectedCustomerId] = useState(state.values?.customerId || invoice.customer_id); //useState para manejar el id del cliente seleccionado
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId); //find para encontrar el cliente seleccionado

  // Sincronizar el cliente seleccionado si hay un error de validación
  React.useEffect(() => {
    if (state.values?.customerId) {
      setSelectedCustomerId(state.values.customerId);
    }
  }, [state.values?.customerId]);

  // Calcular la tasa de RE basada en el IVA (Estándares en España)
  // Como empresaIva ya no existe, usamos 21 como valor por defecto para el cálculo de RE si fuera necesario
  const defaultIva = 21;
  let empresaRe = 0.5;
  if (defaultIva === 21) empresaRe = 5.2;
  else if (defaultIva === 10) empresaRe = 1.4;
  else if (defaultIva === 5 || defaultIva === 4) empresaRe = 0.5;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'TEXTAREA' ||
        (target.tagName === 'BUTTON' && (target as HTMLButtonElement).type === 'submit')
      ) {
        return;
      }

      e.preventDefault();
      const form = e.currentTarget;
      const focusableElements = Array.from(
        form.querySelectorAll('input:not([type="hidden"]), select, textarea, button:not([disabled])')
      ) as HTMLElement[];

      const index = focusableElements.indexOf(target);
      if (index > -1 && index < focusableElements.length - 1) {
        focusableElements[index + 1].focus();
      }
    }
  };

  return (
    <form action={formAction} onKeyDown={handleKeyDown}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Nombre, fecha y numero de la factura */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Seleccion de cliente */}
          <div className="flex flex-col col-span-1 md:col-span-5">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
              Seleccione un cliente
            </label>
            <div className="relative">
              <select
                id="customer"
                name="customerId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                aria-describedby="customer-error"
              >
                <option value="" disabled>
                  Seleccione un cliente
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.customerId &&
                state.errors.customerId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Selector de Tipo de Documento */}
          <div className="mb-4 col-span-1 md:col-span-2">
            <label htmlFor="tipo" className="mb-2 block text-sm font-medium">
              Tipo de Documento
            </label>
            <div className="relative">
              <select
                id="tipo"
                name="tipo"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={state.values?.tipo || invoice.tipo || "Factura"}
                aria-describedby="tipo-error"
              >
                <option value="Factura">Factura</option>
                <option value="Pedido">Pedido</option>
              </select>
            </div>
            <div id="tipo-error" aria-live="polite" aria-atomic="true">
              {state.errors?.tipo &&
                state.errors.tipo.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Seleccion de serie */}
          <div className="mb-4 col-span-1 md:col-span-1">
            <label htmlFor="invoice_serie" className="mb-2 block text-sm font-medium text-center">
              Serie
            </label>

              <input
                id="invoice_serie"
                name="invoice_serie"
                type="text"
                placeholder="A, B..."
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 text-center"
                defaultValue={state.values?.invoice_serie || invoice.invoice_serie}
                aria-describedby="serie-error"
              />

            <div id="serie-error" aria-live="polite" aria-atomic="true">
              {state.errors?.invoice_serie &&
                state.errors.invoice_serie.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Seleccion de numero de factura */}
          <div className="mb-4 col-span-1 md:col-span-2">
            <label htmlFor="invoiceNumber" className="mb-2 block text-sm font-medium text-center">
              Número
            </label>
            <input
              id="invoiceNumber"
              name="invoiceNumber"
              type="number"
              step="any"
              lang="en"
              className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 text-center"
              defaultValue={invoice.invoice_number}
              aria-describedby="invoiceNumber-error"
            />
            <div id="invoiceNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.invoiceNumber &&
                state.errors.invoiceNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Seleccion de fecha */}
          <div className="col-span-2">
            <label htmlFor="fecha" className="mb-2 block text-sm font-medium text-center">
              Fecha
            </label>
            <div className="relative">
              <input
                id="fecha"
                name="fecha"
                type="date"
                className="text-left peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-6 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={
                  state.values?.fecha || (invoice.date
                    ? (typeof invoice.date === 'string'
                      ? invoice.date.split('T')[0]
                      : (invoice.date as any).toISOString().split('T')[0])
                    : '')
                }
                aria-describedby="fecha-error"
              />
              {/*<CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />*/}
            </div>
            <div id="fecha-error" aria-live="polite" aria-atomic="true">
              {state.errors?.fecha &&
                state.errors.fecha.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>





        {/* Subformulario lineas de factura */}
        <InvoiceLinesForm initialLines={lines} customer={selectedCustomer} invoice={invoice} />

        <div className="mt-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          {/* Estado de la factura */}
          <fieldset className="w-full md:w-auto">
            <legend className="mb-2 block text-sm font-medium">
              Estado de la factura
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    id="Pendiente"
                    name="status"
                    type="radio"
                    value="Pendiente"
                    defaultChecked={invoice.status === 'Pendiente'}
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="Pendiente"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Pendiente <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="Pagada"
                    name="status"
                    type="radio"
                    value="Pagada"
                    defaultChecked={invoice.status === 'Pagada'}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="Pagada"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-color-user-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Pagada <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </fieldset>

          {/* Totales de la factura y Vista Previa QR */}
          <div className="w-full md:w-auto mt-6 md:mt-0 flex flex-col md:flex-row gap-6 items-start">
            
            {/* QR de Verifactu (Vista previa) */}
            {invoice.tipo !== 'Pedido' && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Vista previa QR Hacienda</p>
                <div className="relative w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                  <QRCodePreview 
                    cif={(invoice as any).cif || ''}
                    serie={invoice.invoice_serie}
                    numero={invoice.invoice_number}
                    fecha={invoice.date}
                    importe={invoice.total_factura}
                  />
                </div>
                <p className="text-[8px] text-gray-500 text-center max-w-[120px]">Este código QR se incluirá automáticamente en el PDF oficial.</p>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm min-w-[280px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Base Imponible</span>
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <span id="base_imponible-display">{(invoice.base_imponible / 100).toFixed(2)}</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">IVA (21%)</span>
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <span id="total_iva-display">{(invoice.total_iva / 100).toFixed(2)}</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>


                {(selectedCustomer?.tiene_re || (invoice && Number(invoice.total_recargo) > 0)) && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">RE ({empresaRe}%)</span>
                    <div className="flex items-center gap-1 font-bold text-gray-700">
                      <span id="total_recargo-display">{(invoice.total_recargo / 100).toFixed(2)}</span>
                      <CurrencyEuroIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-gray-900 font-extrabold uppercase tracking-widest text-[12px] mb-1">Total Factura</span>
                  <div className="flex items-center gap-1 font-black text-color-user-600">
                    <span id="total_factura-display">{(invoice.total_factura / 100).toFixed(2)}</span>
                    <CurrencyEuroIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <input
                id="base_imponible"
                name="base_imponible"
                type="hidden"
                defaultValue={(invoice.base_imponible / 100).toFixed(2)}
              />

              <div id="base_imponible-error" aria-live="polite" aria-atomic="true">
                {state.errors?.base_imponible &&
                  state.errors.base_imponible.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar documento</Button>
      </div>
    </form>
  );
}
