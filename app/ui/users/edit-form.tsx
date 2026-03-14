'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser, uploadImage } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

interface EditFormProps {
  user: User;
}

const EditUsersForm: React.FC<EditFormProps> = ({ user }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ errors: Partial<Record<keyof User, string[]>>; message: string }>({ errors: {}, message: '' });
  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fileInput = inputFileRef.current?.files?.[0];
    let imageUrl = user.image_url;

    if (fileInput && fileInput.size > 0) {
      const uploadData = new FormData();
      uploadData.append('file', fileInput);
      
      const uploadedPath = await uploadImage(uploadData);
      if (uploadedPath) {
        imageUrl = uploadedPath;
      }
    }

    const data: Omit<User, 'id'> = {
      id_empresa: user.id_empresa,
      name: formData.get('name') as string || '',
      email: formData.get('email') as string || '',
      password: formData.get('password') as string || '',
      token: formData.get('token') as string || '',
      type: formData.get('type') as 'admin' | 'user',
      css: user.css,
      image_url: imageUrl,
    };

    try {
      await updateUser(user.id, data);
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
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Nombre
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              placeholder="Introduce el nombre del usuario"
              autoComplete="name"
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

        {/* User Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Introduce el email del usuario"
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

        {/* User Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              defaultValue={user.password}
              placeholder="Introduce la contraseña del usuario"
              autoComplete="new-password"
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="password-error"
            />
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

 {/* User Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium dark:text-gray-200">
            URL de la imagen del usuario
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
            {state.errors?.image_url?.map((error: string) => (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {/* User Type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium dark:text-gray-200">
            Selecciona rol de usuario
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue={user.type}
              className="peer block w-full rounded-md border border-gray-200 dark:border-gray-700 py-1 pl-2 text-sm outline-2 dark:bg-gray-900 dark:text-gray-200"
              aria-describedby="type-error"
              required
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type?.map((error: string) => (
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
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar Usuario</Button>
      </div>
    </form>
  );

};

export default EditUsersForm;