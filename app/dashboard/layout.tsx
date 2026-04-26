
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
        <div className="flex h-auto md:h-screen flex-col md:flex-row md:overflow-hidden print:h-auto print:block relative">
            {/* Barra de temas fija */}
            <div className="fixed top-4 right-4 z-[60] print:hidden">
                <BarraTemas initialColor={Color_usuario} showUI={true} />
            </div>

            {/* BARRA SUPERIOR (Logo y Usuario) - Global */}
            <div className="w-full flex-none flex justify-between items-end bg-green-500 p-2 print:hidden">
                <FacturaFacilLogo size="small" />
                <FacturaFacilUser />
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex flex-grow flex-col md:flex-row w-full h-full">
                {/* SIDEBAR */}
                <div className="w-full flex-none md:w-64 print:hidden">
                    {/* En escritorio podemos poner aqui el logo si queremos, o dejarlo en el sidenav */}
                    <SideNav />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-grow p-4 md:p-12 overflow-y-auto print:p-0 print:overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
}
