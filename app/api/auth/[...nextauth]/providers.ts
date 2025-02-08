"use client";
import { NextApiRequest, NextApiResponse } from 'next';

export default function providers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Devuelve la lista de proveedores de autenticación
    res.status(200).json({
      providers: [
        { name: 'Google', url: '/auth/google' },
        { name: 'GitHub', url: '/auth/github' },
        // Añade más proveedores según sea necesario
      ],
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}