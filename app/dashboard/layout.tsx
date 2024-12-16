/* eslint-disable @typescript-eslint/no-unused-vars */
import SideNav from '@/app/ui/dashboard/sidenav';
import FacturaFacilLogo from '@/app/ui/factura-facil';
import { inter } from '@/app/ui/fonts';
export const experimental_ppr = true;  //esto es para activar el ppr (rencerizado parcial) (ver next.config.ts)

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <div className="w-full flex-none">
                <FacturaFacilLogo />
            </div>
            <div className="flex flex-grow flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-64">
                    <SideNav />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    {children}
                </div>
            </div>
        </div>
    );
}