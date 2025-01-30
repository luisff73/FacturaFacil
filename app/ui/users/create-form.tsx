// Luis
// filepath: /c:/DAW/desenvolupament web client/next/nextjs-dashboard/app/ui/users/create-form.tsx
import { useState, useEffect } from 'react';
import { User } from '@/app/lib/definitions'; // Importa la interfaz User desde definitions.ts


// definimos la interfaz CreateUserFormProps
// el ? indica que es opcional
interface CreateUserFormProps {
  user?: User;
}

export default function CreateUserForm({ user }: CreateUserFormProps) {
  const [name, setName] = useState(user?.name || ''); // inicializamos el estado de name
  const [email, setEmail] = useState(user?.email || ''); // inicializamos el estado de email
  const [password, setPassword] = useState(''); // inicializamos el estado de password
  const [type, setType] = useState(user?.type || ''); // inicializamos el estado de type
  const [token, setToken] = useState(''); // inicializamos el estado de token

  const handleSubmit = async (event: React.FormEvent) => { // definimos la funcion handleSubmit
    event.preventDefault();
    const method = user ? 'PUT' : 'POST'; // si user existe entonces method es PUT sino POST
    const endpoint = user ? `/api/users/${user.id}` : '/api/users'; // si user existe entonces endpoint es /api/users/${user.id} sino /api/users
    const response = await fetch(endpoint, { // hacemos una peticion fetch 
      method, // metodo
      headers: { // cabeceras
        'Content-Type': 'application/json', // tipo de contenido application/json
      },
      body: JSON.stringify({ name, email, password, type, token }), // cuerpo de la peticion convertido a string
    });
    if (response.ok) {
      // Handle success
    } else {
      // Handle error
    }
  };

  // useEffect se ejecuta despues de cada renderizado para actualizar el DOM
  // si user existe
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setType(user.type);
    }
  }, [user]);
  // retornamos el formulario con los campos name, email, password y type
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <button type="submit">{user ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
      {/* si user existe entonces Actualizar Usuario sino Crear Usuario */}
    </form>
  );
}

