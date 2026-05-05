import FacturaFacilLogo from '@/app/ui/factura-facil';
import ForgotPasswordForm from '@/app/ui/forgot-password-form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-color-user-50 dark:bg-color-user-100 px-4">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-4">
        <div className="flex h-34 w-full items-center justify-center rounded-lg bg-color-user-500 p-3">
          <div className="h-full w-full text-white flex justify-center">
            <FacturaFacilLogo />
          </div>
        </div>
        <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
          <ForgotPasswordForm />
        </Suspense>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FacturaFacil - Gestión Inteligente para Autónomos
            </p>
        </div>
      </div>
    </main>
  );
}
