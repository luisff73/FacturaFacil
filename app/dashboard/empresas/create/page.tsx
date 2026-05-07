
import Form from '@/app/ui/empresas/create-form';
import Breadcrumbs from '@/app/ui/empresas/breadcrumbs';
import { Metadata } from 'next';
import {lusitana} from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Crea tu Empresa',
};

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Panel de entrada', href: '/dashboard' },
          {
            label: 'Crear Empresa',
            href: '/dashboard/empresas/create',
            active: true,
          },
        ]}
      />
      <div className="mb-8 rounded-xl bg-gray-50 p-6 border border-gray-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
        <h1 className={`${lusitana.className} text-2xl leading-relaxed font-bold text-gray-600 dark:text-white mb-2`}>
          ¡ Bienvenido a FacturaFácil !
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          Para comenzar a emitir facturas, el primer paso es registrar los datos de su empresa (o sus datos de autónomo) y crear su cuenta de usuario que será el administrador. 
          No se preocupe, la app es multiusuario y siempre podrá añadir más usuarios después. Una vez tenga creada la empresa podra hacer login y comenzar a usar la app.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li><strong>Datos de la empresa:</strong> Es importante que sean correctos, ya que aparecerán automáticamente en las cabeceras de todas sus facturas.</li>
          <li><strong>Usuario administrador:</strong> Será su cuenta de acceso principal. Use un email válido y recuerde su contraseña para poder iniciar sesión después.</li>
          <li><strong>No olvide</strong> cargar la imagen de su empresa para que aparezca en el membrete de laslas facturas.</li>
        </ul>
      </div>

      {/* renderiza el formulario reutilizable */}
      <Form />
    </main>
  );
}
