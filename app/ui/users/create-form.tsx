'use client';
// Luis
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, uploadImage } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import Cookies from 'js-cookie';
//import { getUserColor } from '@/app/lib/utils';


// definimos la interfaz CreateUserFormProps
// el ? indica que es opcional
interface CreateUserFormProps {
  user?: User[];
}

const CreateUserForm: React.FC<CreateUserFormProps> = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{
    errors: {
      name?: string[];
      email?: string[];
      password?: string[];
      type?: string[];
      id_empresa?: string[];
      image_url?: string[];
    },
    message: string
  }>({ errors: {}, message: '' });

  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setState({ errors: { password: ["Las contraseñas no coinciden."] }, message: "Por favor, corrige los errores del formulario." });
      return;
    }

    const fileInput = inputFileRef.current?.files?.[0];
    let imageUrl = '';

    if (fileInput && fileInput.size > 0) {
      const uploadData = new FormData();
      uploadData.append('file', fileInput);

      const uploadedPath = await uploadImage(uploadData);
      if (uploadedPath) {
        imageUrl = uploadedPath;
      }
    }

    const data: Omit<User, "id"> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      token: Cookies.get('token') as string || '',
      type: formData.get('type') as 'admin' | 'user',
      id_empresa: Number(formData.get('id_empresa')) || 0,
      css: '', // El servidor se encargará de rellenarlo si llega vacío
      image_url: imageUrl,
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
              autoComplete="name"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="name-error"
              required
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
              autoComplete="email"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="email-error"
              required
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
              autoComplete="new-password"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="password-error"
              required
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

        {/* Repetir Contraseña */}
        <div className="mb-4">
          <label htmlFor="confirm_password" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Repetir Contraseña
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Repite la contraseña para confirmar"
              autoComplete="new-password"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="password-error"
              required
            />
          </div>
        </div>

        {/* User Image */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Imagen de perfil
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="file"
              ref={inputFileRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="image_url-error"
            />
          </div>
          <div id="image_url-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image_url &&
              state.errors.image_url.map((error: string) => (
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