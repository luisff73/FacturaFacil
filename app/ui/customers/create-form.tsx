'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createCustomer, uploadImage } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { Customer } from '@/app/lib/definitions';

interface FormProps {
  customers: Customer[];
}

const CreateCustomerForm: React.FC<FormProps> = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const initialState: any = { errors: {}, message: '', success: false };
  const [state, setState] = useState<any>(initialState);
  const router = useRouter();

  const [redirectPath, setRedirectPath] = useState('/dashboard/customers');

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fileInput = inputFileRef.current?.files?.[0];
    let imageUrl = '';

    if (fileInput && fileInput.name && fileInput.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', fileInput);
      const uploadedPathname = await uploadImage(uploadFormData);
      if (uploadedPathname) {
        imageUrl = uploadedPathname;
      }
    }

    const data = {
      name: (formData.get('name') as string) || '',
      email: (formData.get('email') as string) || '',
      image_url: imageUrl,
      direccion: (formData.get('direccion') as string) || '',
      c_postal: (formData.get('c_postal') as string) || '',
      poblacion: (formData.get('poblacion') as string) || '',
      provincia: (formData.get('provincia') as string) || '',
      pais: (formData.get('pais') as string) || '',
      telefono: (formData.get('telefono') as string) || '',
      cif: (formData.get('cif') as string) || '',
      id_empresa: 1,
    };

    try {
      const result = await createCustomer(data);
      if (result.success) {
        router.push(redirectPath);
      } else {
        setState(result);
      }
    } catch (error) {
      setState({
        errors: {},
        message: 'Error inesperado al intentar crear el cliente.',
        success: false
      });
    }
  };

  return (
    <form onSubmit={formAction}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium dark:text-white">
            Nombre del cliente
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Introduce el nombre del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

        </div>

        {/* Customer Direccion */}
        <div className="mb-4">
          <label htmlFor="direccion" className="mb-2 block text-sm font-medium dark:text-white">
            Dirección
          </label>
          <div className="relative">
            <input
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Introduce la dirección del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="direccion-error"
            />
          </div>
          <div id="direccion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.direccion &&
              state.errors.direccion.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Codigo Postal */}
        <div className="mb-4">
          <label htmlFor="c_postal" className="mb-2 block text-sm font-medium dark:text-white">
            Código Postal
          </label>
          <div className="relative">
            <input
              id="c_postal"
              name="c_postal"
              type="text"
              placeholder="Introduce el código postal del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="c_postal-error"
            />
          </div>
          <div id="c_postal-error" aria-live="polite" aria-atomic="true">
            {state.errors?.c_postal &&
              state.errors.c_postal.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Poblacion */}
        <div className="mb-4">
          <label htmlFor="poblacion" className="mb-2 block text-sm font-medium dark:text-white">
            Población
          </label>
          <div className="relative">
            <input
              id="poblacion"
              name="poblacion"
              type="text"
              placeholder="Introduce la población del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="poblacion-error"
            />
          </div>
          <div id="poblacion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.poblacion &&
              state.errors.poblacion.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="mb-2 block text-sm font-medium dark:text-white">
            Provincia
          </label>
          <div className="relative">
            <input
              id="provincia"
              name="provincia"
              type="text"
              placeholder="Introduce la provincia del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="provincia-error"
            />
          </div>
          <div id="provincia-error" aria-live="polite" aria-atomic="true">
            {state.errors?.provincia &&
              state.errors.provincia.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Pais */}
        <div className="mb-4">
          <label htmlFor="pais" className="mb-2 block text-sm font-medium dark:text-white">
            País
          </label>
          <div className="relative">
            <input
              id="pais"
              name="pais"
              type="text"
              //placeholder="Introduce el país del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="pais-error"
              defaultValue="España"
            />
          </div>
          <div id="pais-error" aria-live="polite" aria-atomic="true">
            {state.errors?.pais &&
              state.errors.pais.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Telefono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="mb-2 block text-sm font-medium dark:text-white">
            Teléfono
          </label>
          <div className="relative">
            <input
              id="telefono"
              name="telefono"
              type="text"
              placeholder="Introduce el teléfono del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="telefono-error"
            />
          </div>
          <div id="telefono-error" aria-live="polite" aria-atomic="true">
            {state.errors?.telefono &&
              state.errors.telefono.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer CIF */}
        <div className="mb-4">
          <label htmlFor="cif" className="mb-2 block text-sm font-medium dark:text-white">
            CIF
          </label>
          <div className="relative">
            <input
              id="cif"
              name="cif"
              type="text"
              placeholder="Introduce el CIF del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="cif-error"
            />
          </div>
          <div id="cif-error" aria-live="polite" aria-atomic="true">
            {state.errors?.cif &&
              state.errors.cif.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium dark:text-white">
            Correo electrónico del cliente
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Introduce el correo electrónico del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white"
              aria-describedby="email-error"
            />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Customer Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium dark:text-white">
            URL de la imagen del cliente
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="file"
              ref={inputFileRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-200"
              aria-describedby="image_url-error"
            />
          </div>
          <div id="image_url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url &&
              state.errors.image_url.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-200 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          onClick={() => setRedirectPath('/dashboard/customers')}
        >
          Crear Cliente
        </Button>
        <Button
          type="submit"
          onClick={() => setRedirectPath('/dashboard/invoices')}
          className="!bg-green-400 dark:!bg-green-700 !text-white dark:!text-white hover:!bg-green-200 dark:hover:!bg-gray-600"
        >
          Crear Factura
        </Button>
      </div>
    </form>
  );
};

export default CreateCustomerForm;
