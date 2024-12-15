// en este fichero podriamos añadir un componente Loading que se renderizara mientras se resuelven las promesas
// una barra de carga o un spinner


// version 1 con tailwindcss
// import React from 'react';

// export default function Loading() {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="w-1/2 bg-gray-200 rounded-full h-4">
//         <div className="bg-green-600 h-4 rounded-full animate-pulse" style={{ width: '50%' }}></div>
//       </div>
//       <p className="ml-4 text-gray-700">Cargando...</p>
//     </div>
//   );
// }

// version 2
import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
    return <DashboardSkeleton />;
  }