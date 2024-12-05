import { lusitana, roboto } from '@/app/ui/fonts';

export default function FacturaFacilLogo() {
  return (
    <div
      className={`${roboto.className} flex flex-row items-center leading-none text-white`}
    >
      <img
        src="/facturafacil_logo.png" // Ruta pública

        alt="Logo Factura Fácil"
        // className="h-20 w-21 rotate-[0deg]"
        className="h-40 w-42 self-start"
      />
      <p className="text-[30px] ml-4 self-start ">Tu programa de gestión</p>
    </div>
  );
}