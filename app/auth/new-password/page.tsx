import FacturaFacilLogo from '@/app/ui/factura-facil';
import NewPasswordForm from '@/app/ui/new-password-form';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Nueva contraseña',
};

export default function NewPasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-4">
        <div className="flex h-34 w-full items-center justify-center rounded-lg bg-gray-400 p-3">
          <div className="h-full w-full text-white flex justify-center">
            <FacturaFacilLogo />
          </div>
        </div>
        <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
          <NewPasswordForm />
        </Suspense>
        
        <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} FacturaFacil - Seguridad Garantizada
            </p>
        </div>
      </div>
    </main>
  );
}
