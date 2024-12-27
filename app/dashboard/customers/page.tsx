/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from 'next'; // importamos Metadata de next

export const metadata: Metadata = {
    title: 'Clientes',  // esto funcionaria pero es estatico y no se puede cambiar
};
export default function Page() {
    return <p>Customers Page</p>;

}