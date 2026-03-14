
'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow hover:bg-black transition-colors flex items-center gap-2 font-bold print:hidden"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.89V8.25m0 0l4.47-4.471M6.72 8.25l-4.47-4.471M18.75 8.25H5.25a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25ZM6.75 19.5v-3h10.5v3M16.5 8.25v-3H7.5v3m9 3.75h.008v.008H16.5v-.008Z" />
      </svg>
      Imprimir / Guardar PDF
    </button>
  );
}
