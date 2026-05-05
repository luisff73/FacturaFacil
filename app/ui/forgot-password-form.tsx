'use client';

import { AtSymbolIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/lib/actions';

export default function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await requestPasswordReset(prevState, formData);
      if (!result) {
        setIsSuccess(true);
        return undefined;
      }
      return result;
    },
    undefined,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-4 pt-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold dark:text-white mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Introduce tu email y te enviaremos un enlace para que puedas crear una nueva contraseña.
        </p>

        {isSuccess ? (
          <div className="bg-color-user-50 dark:bg-color-user-900/30 border border-color-user-200 dark:border-color-user-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-color-user-600 dark:text-color-user-400" />
              <p className="text-sm text-color-user-800 dark:text-color-user-200 font-medium">
                ¡Email enviado! Revisa tu bandeja de entrada.
              </p>
            </div>
            <p className="text-xs text-color-user-700 dark:text-color-user-300 mt-2 ml-8">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="text-sm font-bold text-color-user-600 hover:text-color-user-500 flex items-center gap-2"
              >
                Volver al login <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-inner">
            <div>
              <label
                className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-color-user-500 focus:border-transparent transition-all dark:text-white"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  required
                  autoComplete="email"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-color-user-500 transition-colors" />
              </div>
            </div>

            <Button className="mt-8 w-full bg-color-user-600 hover:bg-color-user-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-color-user-500/20" aria-disabled={isPending}>
              {isPending ? 'Enviando...' : 'Enviar enlace de recuperación'}
              {!isPending && <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />}
            </Button>

            <div className="flex justify-center mt-6">
              <Link
                href="/login"
                className="text-xs text-gray-500 hover:text-color-user-600 transition-colors"
              >
                Recordé mi contraseña, volver al login
              </Link>
            </div>
          </div>
        )}

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
