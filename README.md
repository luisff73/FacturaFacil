# Proyecto Facturas

Este proyecto es una aplicación web para la gestión de facturas y clientes, desarrollada utilizando tecnologías modernas de desarrollo web. A continuación se detalla la información relevante sobre el proyecto, incluyendo las tecnologías utilizadas, el flujo de la aplicación y los componentes de React empleados.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Next.js**: Framework de React para la creación de aplicaciones web y sitios estáticos.
- **Tailwind CSS**: Framework CSS para un diseño moderno y responsivo.
- **TypeScript**: Superset de JavaScript que añade tipos estáticos.
- **PostgreSQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar datos.
- **NextAuth.js**: Librería para la autenticación en aplicaciones Next.js.
- **Heroicons**: Conjunto de íconos SVG para React.

## Flujo de la Aplicación

1. **Autenticación**: Los usuarios pueden iniciar sesión utilizando credenciales o proveedores externos como Google y GitHub. La autenticación se maneja a través de NextAuth.js.
   
2. **Gestión de Clientes**: Los usuarios pueden agregar, editar y eliminar clientes. La información de los clientes se almacena en una base de datos PostgreSQL.

3. **Gestión de Facturas**: Los usuarios pueden crear y gestionar facturas asociadas a los clientes. Esto incluye la visualización de facturas existentes y la creación de nuevas.

4. **Interfaz de Usuario**: La aplicación utiliza componentes de React para crear una interfaz de usuario interactiva y responsiva. Los estilos se gestionan mediante Tailwind CSS.

## Componentes de React Utilizados

- **Image**: Componente para manejar imágenes, utilizando `next/image` para optimización.
- **Breadcrumbs**: Componente para mostrar la navegación jerárquica en la aplicación.
- **EditForm**: Componente para editar la información de clientes y facturas.
- **CreateForm**: Componente para crear nuevos clientes y facturas.
- **ThemeToggle**: Componente para alternar entre el modo claro y oscuro de la aplicación.
- **SelectorColores**: Componente para seleccionar colores personalizados que se aplican a la interfaz.
- **FacturaFacilLogo**: Componente que muestra el logo de la aplicación.

## Estructura del Proyecto

La estructura del proyecto está organizada de la siguiente manera:

/app
  /api
    /auth
      [...nextauth]
    /customers
    /invoices
  /ui
    /customers
      - breadcrumbs.tsx
      - edit-form.tsx
      - create-form.tsx
    /invoices
      - breadcrumbs.tsx
      - edit-form.tsx
      - create-form.tsx
    /users
      - edit-form.tsx
      - create-form.tsx
    - theme-toggle.tsx
    - selector-colores.tsx
  /fonts.ts
  - layout.tsx
  - page.tsx
/components
  - image.tsx
  - logo.tsx
  - navbar.tsx
  - footer.tsx
/tailwind.config.ts
/next.config.ts
/middleware.ts
/global.css

git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>

npm install

npm run dev

## Abre tu navegador y visita http://localhost:3000.