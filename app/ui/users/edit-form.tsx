'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/app/lib/actions';
import { User } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

interface EditFormProps {
  user: User;
}

const EditUsersForm: React.FC<EditFormProps> = ({ user }) => {
  const [state, setState] = useState<{ errors: Partial<Record<keyof User, string[]>>; message: string }>({ errors: {}, message: '' });
  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const data: Omit<User, 'id'> = {
      name: formData.get('name') as string || '',
      email: formData.get('email') as string || '',
      password: formData.get('password') as string || '',
      token: formData.get('token') as string || '',
      type: formData.get('type') as 'admin' | 'user',
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
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              placeholder="Enter user name"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
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

        {/* User Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter user email"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
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

        {/* User Password */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              defaultValue={user.password}
              placeholder="Enter user password"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="password-error"
            />
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Token */}
        <div className="mb-4">
          <label htmlFor="token" className="mb-2 block text-sm font-medium">
            Token
          </label>
          <div className="relative">
            <input
              id="token"
              name="token"
              type="text"
              defaultValue={user.token}
              placeholder="Enter user token"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="token-error"
            />
          </div>
          <div id="token-error" aria-live="polite" aria-atomic="true">
            {state.errors?.token &&
              state.errors.token.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Type
          </label>
          <div className="relative">
            <input
              id="type"
              name="type"
              type="text"
              defaultValue={user.type}
              placeholder="Enter user type"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="type-error"
            />
          </div>
          <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar Usuario</Button>
      </div>
    </form>
  );
};

export default EditUsersForm;