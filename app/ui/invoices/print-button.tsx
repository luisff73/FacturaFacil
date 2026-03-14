
'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow hover:bg-black transition-colors flex items-center gap-2 font-bold"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.89l-4.47 4.47a.75.75 0 101.06 1.06l4.47-4.47H6.72zm0 0l4.47 4.47a.75.75 0 101.06-1.06l-4.47-4.47h4.47zm0 0V8.25m0 0l4.47-4.47a.75.75 0 10-1.06-1.06L6.72 8.25zm0 0L2.25 3.78a.75.75 0 10-1.06 1.06l4.47 4.47v-4.47z" />
      </svg>
      Imprimir / Guardar PDF
    </button>
  );
}
