'use client';
// Luis
// filepath: /c:/DAW/desenvolupament web client/next/nextjs-dashboard/app/ui/users/create-form.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
// Importa la interfaz User desde definitions.ts
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import Cookies from 'js-cookie';


// definimos la interfaz CreateUserFormProps
// el ? indica que es opcional
interface CreateUserFormProps {
  user?: User[];
}

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
  const [state, setState] = useState<{
    errors: {
      name?: string[];
      email?: string[];
      password?: string[];
      type?: string[]
    },
    message: string
  }>({ errors: {}, message: '' });

  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const data: Omit<User, "id"> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      token: Cookies.get('token') as string,
      type: formData.get('type') as 'admin' | 'user',
    };

    try {
      await createUser(data);
      router.push('/dashboard/users');
    } catch (error) {
      if (error instanceof Error) {
        setState({ errors: (error as any).errors || {}, message: error.message });
      }
    }
  };
  return (
    <form onSubmit={formAction}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Nombre
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Introduce el nombre del usuario"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="name-error"
            />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Introduce el email del usuario"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="email-error"
            />
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Introduce la contraseña del usuario"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="password-error"
            />
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Tipo de usuario */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Selecciona rol de usuario
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="type-error"
              required
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{state.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Usuario</Button>
      </div>
    </form>
  );

};

export default CreateUserForm;