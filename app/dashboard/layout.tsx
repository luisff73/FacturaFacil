
import SideNav from '@/app/ui/dashboard/sidenav';
import FacturaFacilLogo, { FacturaFacilUser } from '@/app/ui/factura-facil';
//import { inter } from '@/app/ui/fonts';

export const dynamic = 'force-dynamic';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col print:h-auto print:block">
            <div className="w-full flex-none flex justify-between items-end bg-green-500 print:hidden">
                <FacturaFacilLogo size="small" /> {/* pasamos el parametro size para que el logo se muestre en tamaño pequeño */}
                <FacturaFacilUser />
            </div>
            <div className="flex flex-grow flex-col md:flex-row md:overflow-hidden">


            <div className="w-full flex-none md:w-64 print:hidden">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12 print:p-0 print:overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
}
