import Link from 'next/link';
import { 
  ArrowRightIcon, 
  CheckCircleIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';
import FacturaFacilLogo from '@/app/ui/factura-facil';
//import styles from '@/app/ui/home.module.css'; // esto importaria mi css personalizado esto permite aplicar este estilo solo a este fichero
import { roboto } from '@/app/ui/fonts'; // importa las fuentes de google de fonts.ts
import Image from '../components/image';
import { Metadata } from 'next'; // importamos Metadata de next
//import CreateUserForm from './ui/users/create-form';


export const metadata: Metadata = {
  title: 'FacturaFácil | Facturación para autónomos y pymes', // esto funcionaria pero es estatico y no se puede cambiar dinamicamente
  description: 'Programa de facturación compatible con AEAT y VeriFactu. Prueba gratis hasta 5 facturas.',
};

export default function Page() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans selection:bg-gray-600 selection:text-white">
      <main className="flex min-h-screen flex-col p-6 overflow-hidden">
        <div className="flex h-36 shrink-0 items-end rounded-lg bg-gray-600 p-6 md:h-48">
          <div className='w-full h-full object-contain'><FacturaFacilLogo /></div>
       </div>

        <div className="mt-2 flex flex-col gap-6 overflow-hidden md:flex-row md:items-stretch">
          <div className="flex flex-col justify-start gap-6 rounded-lg bg-gray-50 shadow-sm border border-slate-100 px-6 py-8 md:w-2/5 md:px-6">

            <div className="inline-flex items-center gap-2 bg-green-50 border border-gray-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium w-fit">
              <ShieldCheckIcon className="w-5 h-5" />
              100% Compatible AEAT
            </div>

            <p className={`${roboto.className} text-xl text-gray-600 md:text-3xl md:leading-normal`}>
              <strong>Bienvenido a Factura Facil.</strong> <br></br> Tu programa de gestión autónomo.
            </p>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Link
                href="/login"
                className="flex items-center gap-5 self-start rounded-lg bg-gray-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-400 md:text-base"
              >
                <span>Log in</span> <ArrowRightIcon className="w-5" />
              </Link>

              <Link
                href="/dashboard/empresas/create"
                className="flex items-center gap-5 self-start rounded-lg bg-gray-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-500 md:text-base shadow-md shadow-gray-500/20"
              >
                Prueba Gratis <ArrowRightIcon className="ml-auto w-5 text-gray-50" />
              </Link>
            </div>

          </div>

          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 bg-white rounded-lg shadow-sm border border-slate-100">
            <Image
              src="/grafico_escritorio.png"
              width={760}
              height={700}
              className="hidden md:block rounded-xl shadow-lg border border-slate-100"
              alt="imagen del programa de gestión de facturas para la versión de escritorio"
              priority
            />
            <Image
              src="/grafico_movil.png"
              width={560}
              height={620}
              className="block md:hidden rounded-xl shadow-lg border border-slate-100"
              alt="imagen del programa de gestión de facturas para la versión móvil"
              priority
            />
          </div>
        </div>
      </main>

      {/* Características */}
      <section id="caracteristicas" className="py-24 bg-white px-4 sm:px-6 lg:px-8 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Todo lo que necesitas para tu negocio</h2>
            <p className="text-lg text-slate-500">Herramientas profesionales diseñadas para simplificar tu día a día.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-gray-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center mb-6 text-gray-600 group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Normativa AEAT</h3>
              <p className="text-slate-600 leading-relaxed">Totalmente adaptado a la ley Antifraude y sistemas Veri*Factu. Generación de códigos QR y huellas digitales automáticas.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-gray-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center mb-6 text-gray-600 group-hover:scale-110 transition-transform">
                <DocumentTextIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">PDFs Profesionales</h3>
              <p className="text-slate-600 leading-relaxed">Tus facturas en formato PDF con un diseño limpio, moderno y con tu logotipo. Listas para descargar y enviar a tus clientes.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-gray-200 hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center mb-6 text-gray-600 group-hover:scale-110 transition-transform">
                <DevicePhoneMobileIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Multi-Dispositivo</h3>
              <p className="text-slate-600 leading-relaxed">Accede desde tu ordenador, tablet o móvil. La interfaz se adapta perfectamente a cualquier tamaño de pantalla.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Precios simples y transparentes</h2>
            <p className="text-lg text-slate-500">Prueba el sistema sin compromiso. Pásate al plan profesional cuando estés listo.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Demo */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Prueba Demo</h3>
                <p className="text-slate-500">Para conocer la plataforma</p>
              </div>
              <div className="mb-8">
                <span className="text-5xl font-black text-slate-900">0€</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600"><CheckCircleIcon className="w-5 h-5 text-gray-500" /> <strong>Máximo 5 facturas</strong> en total</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircleIcon className="w-5 h-5 text-gray-500" /> Gestión de clientes</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircleIcon className="w-5 h-5 text-gray-500" /> Gestión de productos</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircleIcon className="w-5 h-5 text-gray-500" /> Generación de PDFs</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircleIcon className="w-5 h-5 text-gray-500" /> <strong>Sin tarjeta de crédito</strong></li>
              </ul>
              <Link href="/dashboard/empresas/create" className="w-full block text-center bg-slate-100 text-slate-800 font-semibold py-4 rounded-xl hover:bg-slate-200 transition-colors">
                Comenzar Demo
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative flex flex-col h-full hover:shadow-gray-500/20 transition-all">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-gray-500 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-lg">El más popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Plan Pro</h3>
                <p className="text-slate-400">Todo lo necesario para tu negocio</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">9.99€</span>
                <span className="text-slate-400 font-medium">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300"><CheckCircleIcon className="w-5 h-5 text-gray-400" /> <strong>Facturas ilimitadas</strong></li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircleIcon className="w-5 h-5 text-gray-400" /> Cumplimiento AEAT Veri*Factu</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircleIcon className="w-5 h-5 text-gray-400" /> PDFs profesionales</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircleIcon className="w-5 h-5 text-gray-400" /> Soporte prioritario</li>
                <li className="flex items-center gap-3 text-slate-300"><CheckCircleIcon className="w-5 h-5 text-gray-400" /> Actualizaciones normativas</li>
              </ul>
              <Link href="/dashboard/empresas/create" className="w-full block text-center bg-gray-600 text-white font-semibold py-4 rounded-xl hover:bg-gray-500 transition-colors shadow-lg shadow-gray-500/30">
                Suscribirse ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-slate-400">
               <DocumentTextIcon />
            </div>
            <span className="font-semibold text-slate-500">FacturaFácil</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link href="/login" className="hover:text-slate-900 transition-colors">Iniciar Sesión</Link>
            <a href="#" className="hover:text-slate-900 transition-colors">Aviso legal</a>
            <a href="mailto:info@facturafacil.pro" className="hover:text-slate-900 transition-colors">Contacto</a>
          </div>
          <p className="text-sm text-slate-400">© 2026 FacturaFácil. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
