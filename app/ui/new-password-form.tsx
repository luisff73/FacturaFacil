'use client';

import { KeyIcon, ExclamationCircleIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/app/lib/actions';

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errorMessage, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      if (password !== confirmPassword) {
        return "Las contraseñas no coinciden.";
      }

      const result = await resetPassword(prevState, formData, token);
      
      if (!result) {
        setIsSuccess(true);
        return undefined;
      }
      
      return result;
    },
    undefined,
  );

  if (isSuccess) {
    return (
      <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-4 pt-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
          <CheckCircleIcon className="h-12 w-12 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">¡Contraseña actualizada!</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Ir al Login <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-800 px-6 pb-4 pt-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold dark:text-white mb-2">Nueva contraseña</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Por favor, elige una contraseña segura que no hayas usado antes.
        </p>

        <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-inner space-y-4">
          {/* Campo Nueva Contraseña */}
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider" htmlFor="password">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all dark:text-white"
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-500 transition-colors" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all dark:text-white"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-500 transition-colors" />
            </div>
          </div>

          <Button className="mt-8 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-gray-500/20" aria-disabled={isPending}>
            {isPending ? 'Cambiando...' : 'Cambiar contraseña'}
            {!isPending && <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />}
          </Button>
        </div>

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
