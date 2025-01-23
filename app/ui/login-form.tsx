/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button'; // Importamos el componente Button
import { useState, useActionState } from 'react';
import { authenticate } from '@/app/lib/actions'; // importamos la funcion authenticate de actions.ts
import { signIn } from 'next-auth/react'; // Importamos la función signIn de next-auth
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await authenticate(formData);

    if (result) { // Si hay un error, mostrarlo
      setErrorMessage(result);
    } else {
      // Redirigir manualmente si la autenticación fue exitosa
      console.log('Autenticación exitosaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit} method="POST" className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Por favor haz login para continuar.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>
          {errorMessage && (
            <div className="mt-3 text-sm text-red-600">
              <ExclamationCircleIcon className="inline h-5 w-5" />
              {errorMessage}
            </div>
          )}
          <Button type="submit" className="mt-5 w-full flex justify-center items-center">
            Iniciar sesión
          </Button>
          <div className="mt-5 flex items-center justify-center space-x-3">
            <Button
              type="button"
              className="h-full flex flex-col items-center"
              onClick={() => signIn('google')}
            >
              <span>Iniciar sesión con Google</span>
              <FaGoogle className="mt-2 mb-2 text-2xl" />
            </Button>
            <Button
              type="button"
              className="h-full flex flex-col items-center"
              onClick={() => signIn('facebook')}
            >
              <span>Iniciar sesión con Facebook</span>
              <FaFacebook className="mt-2 mb-2 text-2xl" />
            </Button>
            <Button
              type="button"
              className="h-full flex flex-col items-center"
              onClick={() => signIn('github')}
            >
              <span>Iniciar sesión con GitHub</span>
              <FaGithub className="mt-2 mb-2 text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}