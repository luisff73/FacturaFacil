'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCustomer } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { Customer } from '@/app/lib/definitions';

interface EditFormProps {
  customer: Customer;
}

const EditCustomerForm: React.FC<EditFormProps> = ({ customer }) => {
  const [state, setState] = useState<{ errors: { name?: string[]; email?: string[]; image_url?: string[]; direccion?: string[]; c_postal?: string[]; poblacion?: string[]; provincia?: string[]; telefono?: string[]; cif?: string[]; pais?: string[] }, message: string }>({ errors: {}, message: '' });
  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fileInput = formData.get('image_url') as File;
    let imageUrl = customer.image_url;

    if (fileInput && fileInput.name) {
      // Aquí puedes manejar la carga del archivo y obtener la ruta local
      const filePath = `/uploads/${fileInput.name}`;
      imageUrl = filePath;

      // Aquí puedes agregar la lógica para guardar el archivo en el servidor
    }

    const data = {
      id: customer.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      image_url: imageUrl,
      direccion: formData.get('direccion') as string,
      c_postal: formData.get('c_postal') as string,
      poblacion: formData.get('poblacion') as string,
      provincia: formData.get('provincia') as string,
      pais: formData.get('pais') as string,
      telefono: formData.get('telefono') as string,
      cif: formData.get('cif') as string
    };

    try {
      await updateCustomer(customer.id, data);
      router.push('/dashboard/customers');
    } catch (error) {
      if (error instanceof Error) {
        setState({ errors: (error as any).errors || {}, message: error.message });
      }
    }
  };

  return (
    <form onSubmit={formAction}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* All fields will follow this pattern */}
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Nombre del cliente
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={customer.name}
              placeholder="Introduce el nombre del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Correo electrónico del cliente
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={customer.email}
              placeholder="Introduce el correo electrónico del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="email-error"
            />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium dark:text-gray-200">
            URL de la imagen del cliente
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="file"
              placeholder="Introduce la URL de la imagen del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="image_url-error"
            />
          </div>
          <div id="image_url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Direccion */}
        <div className="mb-4">
          <label htmlFor="direccion" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Dirección
          </label>
          <div className="relative">
            <input
              id="direccion"
              name="direccion"
              type="text"
              defaultValue={customer.direccion}
              placeholder="Introduce la dirección del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="direccion-error"
            />
          </div>
          <div id="direccion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.direccion?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Codigo Postal */}
        <div className="mb-4">
          <label htmlFor="c_postal" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Código Postal
          </label>
          <div className="relative">
            <input
              id="c_postal"
              name="c_postal"
              type="text"
              defaultValue={customer.c_postal}
              placeholder="Introduce el código postal del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="c_postal-error"
            />
          </div>
          <div id="c_postal-error" aria-live="polite" aria-atomic="true">
            {state.errors?.c_postal?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Poblacion */}
        <div className="mb-4">
          <label htmlFor="poblacion" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Población
          </label>
          <div className="relative">
            <input
              id="poblacion"
              name="poblacion"
              type="text"
              defaultValue={customer.poblacion}
              placeholder="Introduce la población del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="poblacion-error"
            />
          </div>
          <div id="poblacion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.poblacion?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Provincia
          </label>
          <div className="relative">
            <input
              id="provincia"
              name="provincia"
              type="text"
              defaultValue={customer.provincia}
              placeholder="Introduce la provincia del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="provincia-error"
            />
          </div>
          <div id="provincia-error" aria-live="polite" aria-atomic="true">
            {state.errors?.provincia?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Pais */}
        <div className="mb-4">
          <label htmlFor="pais" className="mb-2 block text-sm font-medium dark:text-gray-200">
            País
          </label>
          <div className="relative">
            <input
              id="pais"
              name="pais"
              type="text"
              defaultValue={customer.pais}
              placeholder="Introduce el país del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="pais-error"
            />
          </div>
          <div id="pais-error" aria-live="polite" aria-atomic="true">
            {state.errors?.pais?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer Telefono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Teléfono
          </label>
          <div className="relative">
            <input
              id="telefono"
              name="telefono"
              type="text"
              defaultValue={customer.telefono}
              placeholder="Introduce el teléfono del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="telefono-error"
            />
          </div>
          <div id="telefono-error" aria-live="polite" aria-atomic="true">
            {state.errors?.telefono?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Customer CIF */}
        <div className="mb-4">
          <label htmlFor="cif" className="mb-2 block text-sm font-medium dark:text-gray-200">
            CIF
          </label>
          <div className="relative">
            <input
              id="cif"
              name="cif"
              type="text"
              defaultValue={customer.cif}
              placeholder="Introduce el CIF del cliente"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="cif-error"
            />
          </div>
          <div id="cif-error" aria-live="polite" aria-atomic="true">
            {state.errors?.cif?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{state.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar Cliente</Button>
      </div>
    </form>
);

};

export default EditCustomerForm;