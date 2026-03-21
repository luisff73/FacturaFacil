'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createEmpresa, uploadImage } from '@/app/lib/actions';
import Cookies from 'js-cookie';
import { Empresas, User } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import { z } from 'zod';

// type for errors map
type FieldErrors = Record<string, string[]>;

// Esquema de validación para la empresa
const EmpresaSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio." }),
  direccion: z.string().min(1, { message: "La dirección es obligatoria." }),
  c_postal: z.string().min(1, { message: "El código postal es obligatorio." }),
  poblacion: z.string().min(1, { message: "La población es obligatoria." }),
  provincia: z.string().min(1, { message: "La provincia es obligatoria." }),
  telefono: z.string().default(''),
  cif: z.string().min(1, { message: "El CIF es obligatorio y debe ser válido." }),
  email: z.string().email({ message: "Introduce un email válido." }),
  iva: z.number({
    invalid_type_error: "El IVA debe ser un número."
  }).min(1, { message: "El IVA es obligatorio y debe ser mayor que 0." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  activa: z.boolean().default(true),
});

// Esquema de validación para el usuario inicial
const UserSchema = z.object({
  name: z.string().min(1, { message: "El nombre del administrador es obligatorio." }),
  email: z.string().email({ message: "Introduce un email válido para el administrador." }),
  password: z.string().min(6, { message: "La contraseña del administrador debe tener al menos 6 caracteres." }),
});

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
  autoComplete?: string;
}> = [
    { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Introduce el nombre de la empresa', autoComplete: 'organization' },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Introduce la dirección de la empresa', autoComplete: 'address-line1' },
    { name: 'c_postal', label: 'Código Postal', type: 'text', placeholder: 'Introduce el código postal de la empresa', autoComplete: 'postal-code' },
    { name: 'poblacion', label: 'Población', type: 'text', placeholder: 'Introduce la población de la empresa', autoComplete: 'address-level2' },
    { name: 'provincia', label: 'Provincia', type: 'text', placeholder: 'Introduce la provincia de la empresa', autoComplete: 'address-level1' },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Introduce el teléfono de la empresa', autoComplete: 'tel' },
    { name: 'cif', label: 'CIF', type: 'text', placeholder: 'Introduce el CIF de la empresa' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Introduce el email de la empresa', autoComplete: 'email' },
    { name: 'iva', label: 'IVA', type: 'number', placeholder: 'Introduce el IVA de la empresa' },
  ];

const CreateEmpresaForm: React.FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setMessage('');

    const form = event.currentTarget;

    // Validación con Zod
    const validatedEmpresa = EmpresaSchema.safeParse({
      nombre: (form.nombre as HTMLInputElement).value,
      direccion: (form.direccion as HTMLInputElement).value,
      c_postal: (form.c_postal as HTMLInputElement).value,
      poblacion: (form.poblacion as HTMLInputElement).value,
      provincia: (form.provincia as HTMLInputElement).value,
      telefono: (form.telefono as HTMLInputElement).value,
      cif: (form.cif as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      iva: parseFloat((form.iva as HTMLInputElement).value),
      password: (form.password as HTMLInputElement).value,
      activa: (form.activa as HTMLInputElement).checked,
    });

    const validatedUser = UserSchema.safeParse({
      name: (form.user_name as HTMLInputElement).value,
      email: (form.user_email as HTMLInputElement).value,
      password: (form.user_password as HTMLInputElement).value,
    });

    if (!validatedEmpresa.success || !validatedUser.success) {
      const allErrors: any = {};

      if (!validatedEmpresa.success) {
        Object.assign(allErrors, validatedEmpresa.error.flatten().fieldErrors);
      }
      if (!validatedUser.success) {
        // Mapeamos los errores del usuario a prefijos para no chocar
        const userErrors = validatedUser.error.flatten().fieldErrors;
        if (userErrors.name) allErrors.user_name = userErrors.name;
        if (userErrors.email) allErrors.user_email = userErrors.email;
        if (userErrors.password) allErrors.user_password = userErrors.password;
      }

      setErrors(allErrors);
      setMessage("Por favor, corrige los errores del formulario.");
      return;
    }

    const empresaData: Omit<Empresas, 'id'> = {
      ...validatedEmpresa.data,
      fecha_creacion: new Date(),
    };

    const initialUser: Omit<User, 'id' | 'id_empresa'> = {
      ...validatedUser.data,
      type: 'admin' as const,
      token: Cookies.get('token') || '',
      css: '#1a1c1eff',
      image_url: '',
    };

    const fileInput = inputFileRef.current?.files?.[0];
    if (fileInput && fileInput.size > 0) {
      const uploadData = new FormData();
      uploadData.append('file', fileInput);

      const uploadedPath = await uploadImage(uploadData);
      if (uploadedPath) {
        initialUser.image_url = uploadedPath;
      }
    }

    try {
      await createEmpresa(empresaData, initialUser);
      router.push('/dashboard/empresas');
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
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
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="new-password"
                placeholder="Contraseña para el usuario admin"
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby="user_password-error"
              />
            </div>
            <ErrorMessages field="user_password" errors={errors.user_password} />
          </div>

          <div className="mb-4">
            <label htmlFor="user_image" className="mb-2 block text-sm font-medium dark:text-gray-200">
              Imagen de perfil del administrador
            </label>
            <div className="relative">
              <input
                id="user_image"
                name="file"
                ref={inputFileRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
                aria-describedby="user_image-error"
              />
            </div>
            <ErrorMessages field="user_image" errors={errors.user_image} />
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