
import FacturaFacilLogo from '../ui/factura-facil';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen mt-4 lg:mt-8">
      <div className=" body relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
        <div className="flex h-34 w-full items-center justify-center rounded-lg bg-green-400 p-3">
          <div className="h-full w-full text-white flex justify-center">
            <FacturaFacilLogo />
          </div>
        </div>
        <Suspense fallback={<div>Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
