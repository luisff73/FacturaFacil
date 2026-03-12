'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEmpresa } from '@/app/lib/actions';
import Cookies from 'js-cookie';
import { Empresas, User } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

// type for errors map
type FieldErrors = Record<string, string[]>;

function ErrorMessages({ field, errors }: { field: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div id={`${field}-error`} aria-live="polite" aria-atomic="true">
      {errors.map((msg) => (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={msg}>
          {msg}
        </p>
      ))}
    </div>
  );
}

const FIELDS: Array<{
  name: keyof Omit<Empresas, 'id' | 'fecha_creacion' | 'css'>;
  label: string;
  type: string;
  placeholder: string;
}> = [
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Introduce el nombre de la empresa' },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Introduce la dirección de la empresa' },
    { name: 'c_postal', label: 'Código Postal', type: 'text', placeholder: 'Introduce el código postal de la empresa' },
    { name: 'poblacion', label: 'Población', type: 'text', placeholder: 'Introduce la población de la empresa' },
    { name: 'provincia', label: 'Provincia', type: 'text', placeholder: 'Introduce la provincia de la empresa' },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Introduce el teléfono de la empresa' },
    { name: 'cif', label: 'CIF', type: 'text', placeholder: 'Introduce el CIF de la empresa' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Introduce el email de la empresa' },
    { name: 'iva', label: 'IVA', type: 'number', placeholder: 'Introduce el IVA de la empresa' },
    { name: 'recargo_equivalencia', label: 'Recargo de Equivalencia', type: 'number', placeholder: 'Introduce el recargo de equivalencia de la empresa' },

  ];

const CreateEmpresaForm: React.FC = () => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const empresaData: Omit<Empresas, 'id'> = {
      nombre: (form.nombre as HTMLInputElement).value.trim(),
      direccion: (form.direccion as HTMLInputElement).value.trim(),
      c_postal: (form.c_postal as HTMLInputElement).value.trim(),
      poblacion: (form.poblacion as HTMLInputElement).value.trim(),
      provincia: (form.provincia as HTMLInputElement).value.trim(),
      telefono: (form.telefono as HTMLInputElement).value.trim(),
      cif: (form.cif as HTMLInputElement).value.trim(),
      email: (form.email as HTMLInputElement).value.trim(),
      iva: parseFloat((form.iva as HTMLInputElement).value) || 0,
      recargo_equivalencia: parseFloat((form.recargo_equivalencia as HTMLInputElement).value) || 0,
      password: (form.password as HTMLInputElement).value,
      activa: (form.activa as HTMLInputElement).checked,
      fecha_creacion: new Date(),
    };


    const initialUser: Omit<User, 'id' | 'id_empresa'> = {
      name: (form.user_name as HTMLInputElement).value.trim(),
      email: (form.user_email as HTMLInputElement).value.trim(),
      password: (form.user_password as HTMLInputElement).value,
      type: 'admin' as const,
      token: Cookies.get('token') || '',
    };

    try {
      await createEmpresa(empresaData, initialUser);
      router.push('/dashboard/empresas');
    } catch (err) {
      if (err instanceof Error) {
        const e: any = err;
        setErrors(e.errors || {});
        setMessage(e.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {FIELDS.map(({ name, label, type, placeholder }) => (
          <div key={name} className="mb-4">
            <label htmlFor={name} className="mb-2 block text-sm font-medium dark:text-gray-200">
              {label}
            </label>
            <div className="relative">
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby={`${name}-error`}
              />
            </div>
            <ErrorMessages field={name} errors={errors[name]} />
          </div>
        ))}

        {/* Sección de usuario inicial */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-medium dark:text-gray-200">Usuario administrador inicial</h3>
          <div className="mb-4">
            <label htmlFor="user_name" className="mb-2 block text-sm font-medium dark:text-gray-200">
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                id="user_name"
                name="user_name"
                type="text"
                placeholder="Introduce nombre del usuario admin"
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby="user_name-error"
              />
            </div>
            <ErrorMessages field="user_name" errors={errors.user_name} />
          </div>

          <div className="mb-4">
            <label htmlFor="user_email" className="mb-2 block text-sm font-medium dark:text-gray-200">
              Email de usuario
            </label>
            <div className="relative">
              <input
                id="user_email"
                name="user_email"
                type="email"
                placeholder="Introduce email del usuario admin"
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby="user_email-error"
              />
            </div>
            <ErrorMessages field="user_email" errors={errors.user_email} />
          </div>

          <div className="mb-4">
            <label htmlFor="user_password" className="mb-2 block text-sm font-medium dark:text-gray-200">
              Contraseña de usuario
            </label>
            <div className="relative">
              <input
                id="user_password"
                name="user_password"
                type="password"
                placeholder="Contraseña para el usuario admin"
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby="user_password-error"
              />
            </div>
            <ErrorMessages field="user_password" errors={errors.user_password} />
          </div>
        </div>

        {/* contraseña */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Introduce la contraseña de la empresa"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="password-error"
            />
          </div>
          <ErrorMessages field="password" errors={errors.password} />
        </div>

        {/* activa */}
        <div className="mb-4 flex items-center">
          <input
            id="activa"
            name="activa"
            type="checkbox"
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="activa" className="text-sm dark:text-gray-200">
            Activa
          </label>
          <ErrorMessages field="activa" errors={errors.activa} />
        </div>

        {message && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400" aria-live="polite">
            {message}
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/empresas"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Empresa</Button>
      </div>
    </form>
  );

};

export default CreateEmpresaForm;