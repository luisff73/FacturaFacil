'use client';
import { Customer } from '@/app/lib/definitions';
import { Series } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CloudIcon,
  CurrencyEuroIcon,
  UserCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState, useState, useEffect } from 'react';
import InvoiceLinesForm from '@/app/ui/invoices/invoice-lines-form';
import QRCodePreview from '@/app/ui/invoices/qrcode-preview';
import React from 'react';

export default function Form({ customers, series, empresaCif }: { customers: Customer[], series: Series[], empresaCif: string }) {
  const initialState: State = { message: '', errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState(state.values?.customerId || '');
  const [realTimeTotal, setRealTimeTotal] = React.useState(0);
  const [currentDate, setCurrentDate] = React.useState(state.values?.fecha || new Date().toISOString().split('T')[0]);
  const [currentSerie, setCurrentSerie] = React.useState(state.values?.invoice_serie || series[0]?.id || '');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Sincronizar el cliente seleccionado si hay un error de validación
  React.useEffect(() => {
    if (state.values?.customerId) {
      setSelectedCustomerId(state.values.customerId);
    }
  }, [state.values?.customerId]);



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
        <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="flex flex-col md:col-span-7">
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
                <option value="" disabled>Seleccione un cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.customerId &&
                state.errors.customerId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>

          {/* Selector de Serie */}
          <div className="mb-4 md:col-span-2">
            <label htmlFor="invoice_serie" className="mb-2 block text-sm font-medium">
              Serie
            </label>
            <div className="relative">
              <select
                id="invoice_serie"
                name="invoice_serie"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                // Usamos el valor recuperado de state.values o la primera serie por defecto
                defaultValue={state.values?.invoice_serie || series[0]?.id || ""}
                onChange={(e) => setCurrentSerie(e.target.value)}
                aria-describedby="serie-error"
              >
                <option value="" disabled>--- Selecciona una serie ---</option>
                {series.map((serie: Series) => (
                  <option key={serie.id} value={serie.id}>
                    {serie.id} - {serie.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Manejo de errores de validación (idéntico a customers) */}
            <div id="serie-error" aria-live="polite" aria-atomic="true">
              {state.errors?.invoice_serie &&
                state.errors.invoice_serie.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>


          <div className="flex flex-col md:col-span-3">
            <label htmlFor="fecha" className="mb-2 block text-sm font-medium">Fecha</label>
            <div className="relative">
              <input
                id="fecha"
                name="fecha"
                type="date"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                aria-describedby="fecha-error"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <InvoiceLinesForm
          customer={selectedCustomer}
          initialLines={state.values?.lines ? JSON.parse(state.values.lines) : []}
          onTotalChange={(total) => setRealTimeTotal(total)}
        />

        <div className="mt-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <fieldset className="w-full md:w-auto">
            <legend className="mb-2 block text-sm font-medium">Estado</legend>
            <div className="rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input id="Pendiente" name="status" type="radio" value="Pendiente" defaultChecked className="h-4 w-4 cursor-pointer" />
                  <label htmlFor="Pendiente" className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    Pendiente <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="Proforma" name="status" type="radio" value="Proforma" className="h-4 w-4 cursor-pointer" />
                  <label htmlFor="Proforma" className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    Proforma <CloudIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="Pagada" name="status" type="radio" value="Pagada" className="h-4 w-4 cursor-pointer" />
                  <label htmlFor="Pagada" className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
                    Pagada <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="w-full md:w-auto mt-6 md:mt-0 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Vista previa QR Hacienda</p>
              <div className="relative w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                <QRCodePreview
                  cif={empresaCif}
                  serie={currentSerie}
                  numero={0}
                  fecha={currentDate}
                  importe={realTimeTotal}
                />
              </div>
              <p className="text-[8px] text-gray-500 text-center max-w-[120px]">Basado en los estándares de VERI*FACTU.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm min-w-[280px]">
              <div className="space-y-3 font-bold text-gray-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Base Imponible</span>
                  <div className="flex items-center gap-1">
                    <span id="base_imponible-display">0.00</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">IVA</span>
                  <div className="flex items-center gap-1">
                    <span id="total_iva-display">0.00</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>

                {selectedCustomer?.tiene_re && (
                  <div className="flex justify-between items-center text-sm text-blue-600">
                    <span className="font-medium uppercase tracking-wider text-[10px]">RE</span>
                    <div className="flex items-center gap-1">
                      <span id="total_recargo-display">0.00</span>
                      <CurrencyEuroIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-gray-900 font-black uppercase tracking-widest text-[12px] mb-1">Total Factura</span>
                  <div className="flex items-center gap-1 text-2xl font-black text-green-600">
                    <span id="total_factura-display">0.00</span>
                    <CurrencyEuroIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <input id="base_imponible" name="base_imponible" type="hidden" defaultValue="0" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/invoices" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200">Cancelar</Link>
        <Button type="submit">Crear Factura</Button>
      </div>
    </form>
  );
}