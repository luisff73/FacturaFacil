
import FacturaFacilLogo from '../ui/factura-facil';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-green-400 p-3 md:h-36">
          <div className="flex-grow text-white md:w-36 md:h-36">
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
