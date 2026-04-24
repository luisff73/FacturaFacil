
import SideNav from '@/app/ui/dashboard/sidenav';
import FacturaFacilLogo, { FacturaFacilUser } from '@/app/ui/factura-facil';
//import { inter } from '@/app/ui/fonts';

export const dynamic = 'force-dynamic';

import { auth } from "@/auth";
import BarraTemas from "@/components/BarraTemas";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const Color_usuario = (session?.user as any)?.css || '#2b3643ff';

    return (
        <div className="flex h-full flex-col print:h-auto print:block relative">
            {/* Solo se muestra en el dashboard */}
            <div className="fixed top-4 right-4 z-[60] print:hidden">
                <BarraTemas initialColor={Color_usuario} showUI={true} />
            </div>
            <div className="w-full flex-none flex justify-between items-end bg-green-500 print:hidden">
                <FacturaFacilLogo size="small" /> {/* pasamos el parametro size para que el logo se muestre en tamaño pequeño */}
                <FacturaFacilUser />
            </div>
            <div className="flex flex-grow flex-col md:flex-row md:overflow-hidden">


            <div className="w-full flex-none md:w-64 print:hidden">
                <SideNav />
            </div>
            <div className="flex-grow p-6 overflow-y-auto md:p-12 print:p-0 print:overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
}
