'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateEmpresa, uploadImage } from '@/app/lib/actions';
import { Empresas } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { getImageUrl } from '@/app/lib/utils';
import Link from 'next/link';

interface EditFormProps {
  empresa: Empresas;
}

const EditEmpresasForm: React.FC<EditFormProps> = ({ empresa }) => {
  const [state, setState] = useState<{ errors: Partial<Record<keyof Empresas, string[]>>; message: string }>({ errors: {}, message: '' });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // 1. Manejar la subida del logotipo si hay un archivo nuevo
    let logotipoUrl = empresa.logotipo || '';
    const file = fileInputRef.current?.files?.[0];

    if (file && file.size > 0) {
      const uploadData = new FormData();
      uploadData.append('logotipo', file);
      const uploadedPath = await uploadImage(uploadData, 'logotipo');
      if (uploadedPath) {
        logotipoUrl = uploadedPath;
      }
    }

    const data = {
      nombre: formData.get('nombre') as string || '',
      direccion: formData.get('direccion') as string || '',
      c_postal: formData.get('c_postal') as string || '',
      poblacion: formData.get('poblacion') as string || '',
      provincia: formData.get('provincia') as string || '',
      telefono: formData.get('telefono') as string || '',
      cif: formData.get('cif') as string || '',
      email: formData.get('email') as string || '',
      logotipo: logotipoUrl, // Usamos la URL (nueva o antigua)
      activa: formData.get('activa') === 'on', // Las checkboxes en FormData son 'on' si están marcadas
      fecha_creacion: empresa.fecha_creacion,
    };

    try {
      await updateEmpresa(empresa.id.toString(), data);
      router.push('/dashboard/empresas');
    } catch (error) {
      if (error instanceof Error) {
        setState({ errors: (error as any).errors || {}, message: error.message });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      const input = e.target as HTMLInputElement;
      if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'checkbox' && input.type !== 'file') {
        e.preventDefault();
        const form = e.currentTarget;
        const index = Array.from(form.elements).indexOf(input);
        const next = form.elements[index + 1] as HTMLElement;
        if (next) next.focus();
      }
    }
  };

  return (
    <form onSubmit={formAction} onKeyDown={handleKeyDown}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* Empresa Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Nombre
          </label>
          <div className="relative">
            <input
              id="nombre"
              name="nombre"
              type="text"
              defaultValue={empresa.nombre}
              placeholder="Introduzca el nombre de la empresa"
              autoComplete="organization"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="nombre-error"
            />
          </div>
          <div id="nombre-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nombre?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* Empresa Dirección */}
        <div className="mb-4">
          <label htmlFor="direccion" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Dirección
          </label>
          <div className="relative">
            <input
              id="direccion"
              name="direccion"
              type="text"
              defaultValue={empresa.direccion}
              placeholder="Introduzca la dirección de la empresa"
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

        {/* Empresa c_postal */}
        <div className="mb-4">
          <label htmlFor="c_postal" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Código Postal
          </label>
          <div className="relative">
            <input
              id="c_postal"
              name="c_postal"
              type="text"
              defaultValue={empresa.c_postal}
              placeholder="Introduzca el código postal de la empresa"
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


        {/* Empresa Población */}
        <div className="mb-4">
          <label htmlFor="poblacion" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Población
          </label>
          <div className="relative">
            <input
              id="poblacion"
              name="poblacion"
              type="text"
              defaultValue={empresa.poblacion}
              placeholder="Introduzca la población de la empresa"
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

        {/* Empresa Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Provincia
          </label>
          <div className="relative">
            <input
              id="provincia"
              name="provincia"
              type="text"
              defaultValue={empresa.provincia}
              placeholder="Introduzca la provincia de la empresa"
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

        {/* Empresa Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Teléfono
          </label>
          <div className="relative">
            <input
              id="telefono"
              name="telefono"
              type="text"
              defaultValue={empresa.telefono}
              placeholder="Introduzca el teléfono de la empresa"
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

        {/* Empresa CIF */}
        <div className="mb-4">
          <label htmlFor="cif" className="mb-2 block text-sm font-medium dark:text-gray-200">
            CIF
          </label>
          <div className="relative">
            <input
              id="cif"
              name="cif"
              type="text"
              defaultValue={empresa.cif}
              placeholder="Introduzca el CIF de la empresa"
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

        {/* Empresa Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={empresa.email}
              placeholder="Introduzca el email de la empresa"
              autoComplete="email"
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

        {/* Empresa Logotipo */}
        <div className="mb-4">
          <label htmlFor="logotipo" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Logotipo
          </label>
          <div className="relative">
            <input
              id="logotipo"
              name="logotipo"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              placeholder="Introduzca el logotipo de la empresa"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="logotipo-error"
            />
            {empresa.logotipo && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Logotipo actual:</p>
                <img
                  src={getImageUrl(empresa.logotipo)}
                  alt="Logotipo actual"
                  className="h-20 w-auto rounded border p-1"
                />
              </div>
            )}
          </div>
          <div id="logotipo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.logotipo?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* activa*/}
        <div className="mb-4">
          <label htmlFor="activa" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Activa
          </label>
          <div className="relative">
            <input
              id="activa"
              name="activa"
              type="checkbox"
              defaultChecked={empresa.activa}
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="activa-error"
            />
          </div>
          <div id="activa-error" aria-live="polite" aria-atomic="true">
            {state.errors?.activa?.map((error: string) => (
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
          href="/dashboard/empresas"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar Empresa</Button>
      </div>
    </form>
  );

};

export default EditEmpresasForm;