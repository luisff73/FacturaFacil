// archivo de importacion de fuentes
// next incluye las fuentes que importamos para que no haya dependencias ni precargas de terceros

import { Inter, Lusitana, Roboto, Montserrat } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const roboto = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const montserrat = Montserrat({
    weight: ["400", "700"],
    subsets: ["latin"],
  });
  
