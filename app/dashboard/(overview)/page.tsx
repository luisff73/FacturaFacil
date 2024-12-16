
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Card } from '@/app/ui/dashboard/cards'; // Importamos el componente Card para usarlo en el dashboard
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // Importamos la función fetchRevenue de data.ts
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton,} from '@/app/ui/skeletons';

export default async function Page() { // componente asiincrono para poder hacer la peticion a la api
    // remove fetchrevenue const revenue = await fetchRevenue(); // Llamamos a la función fetchRevenue y guardamos el resultado en la variable revenue
    // hasta que no se resuelva la promesa no se renderiza el componente y no continua latestInvoices
    // const latestInvoices = await fetchLatestInvoices(); // Llamamos a la función fetchLatestInvoices y guardamos el resultado en la variable latestInvoices
    // hasta que no se resuelva la promesa no se renderiza el componente y no continua fetchCardData
    // Llamamos a la función fetchCardData y guardamos el resultado en las variables numberOfInvoices, numberOfCustomers, totalPaidInvoices y totalPendingInvoices    
    const { numberOfInvoices, numberOfCustomers, totalPaidInvoices, totalPendingInvoices } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Panel resumen
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">

                {/*<RevenueChart revenue={revenue} />*/}
                <Suspense fallback={<RevenueChartSkeleton />}> {/* Hasta que no se resuelva la promesa no se renderiza el componente esto es renderizacion parcial*/}    
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices />
                </Suspense>
            </div>
        </main>
    );
}