'use client';
import { Customer, Invoice, invoices_lines } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CloudIcon,
  CurrencyEuroIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice, State } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import InvoiceLinesForm from '@/app/ui/invoices/invoice-lines-form';
import React from 'react';

export default function EditInvoiceForm({
  invoice,
  customers,
  lines,
  empresaIva,
}: {
  invoice: Invoice;
  customers: Customer[];
  lines: invoices_lines[];
  empresaIva: number;
}) {
  const initialState: State = { message: '', errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction] = useActionState(updateInvoiceWithId, initialState);
  const [selectedCustomerId, setSelectedCustomerId] = useState(invoice.customer_id);
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

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
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Seleccione un cliente
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id}
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



        {/* Invoice Lines Subformulario */}
        <InvoiceLinesForm initialLines={lines} customer={selectedCustomer} invoice={invoice} empresaIva={empresaIva} />

        <div className="mt-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          {/* Invoice Status */}
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
                    id="Proforma"
                    name="status"
                    type="radio"
                    value="Proforma"
                    defaultChecked={invoice.status === 'Proforma'}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="Proforma"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Proforma <CloudIcon className="h-4 w-4" />
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
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
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

          {/* Invoice Totals Breakdown */}
          <div className="w-full md:w-auto mt-6 md:mt-0">
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 shadow-sm min-w-[280px]">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Base Imponible</span>
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <span id="base_imponible-display">{invoice.base_imponible}</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">IVA ({empresaIva}%)</span>
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <span id="total_iva-display">{invoice.total_iva}</span>
                    <CurrencyEuroIcon className="h-4 w-4" />
                  </div>
                </div>

                {(selectedCustomer?.tiene_re || (invoice && Number(invoice.total_recargo) > 0)) && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">Recargo (RE)</span>
                    <div className="flex items-center gap-1 font-bold text-gray-700">
                      <span id="total_recargo-display">{invoice.total_recargo}</span>
                      <CurrencyEuroIcon className="h-4 w-4" />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-gray-900 font-extrabold uppercase tracking-widest text-[12px] mb-1">Total Factura</span>
                  <div className="flex items-center gap-1 text-2xl font-black text-green-600">
                    <span id="total_factura-display">{invoice.total_factura}</span>
                    <CurrencyEuroIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <input
                id="base_imponible"
                name="base_imponible"
                type="hidden"
                defaultValue={invoice.base_imponible}
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
        <Button type="submit">Actualizar Factura</Button>
      </div>
    </form>
  );
}
