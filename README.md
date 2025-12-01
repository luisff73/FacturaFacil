# Proyecto FacturaFácil

**FacturaFácil** es una aplicación web completa para la gestión de facturas y clientes, diseñada para ser intuitiva, eficiente y escalable. Este documento sirve como una guía completa para que nuevos desarrolladores puedan entender la arquitectura, tecnologías y lógica del proyecto para poder continuarlo.

## 🚀 Tecnologías y Herramientas

El proyecto está construido sobre un stack moderno de JavaScript, aprovechando las siguientes tecnologías:

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router) - Framework de React para renderizado en servidor (SSR), generación de sitios estáticos (SSG) y optimizaciones de rendimiento.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript que añade tipado estático para mejorar la robustez y mantenibilidad del código.
- **UI**: [React](https://reactjs.org/) - Biblioteca para construir interfaces de usuario declarativas y componentizadas.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS "utility-first" para un diseño rápido y personalizable.
- **Iconos**: [Heroicons](https://heroicons.com/) - Conjunto de iconos SVG de alta calidad.

### Backend y Base de Datos
- **Base de Datos**: [Vercel Postgres](https://vercel.com/storage/postgres) - Base de datos PostgreSQL serverless, optimizada para despliegues en Vercel.
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/) - Solución completa de autenticación para aplicaciones Next.js.
- **Validación**: [Zod](https://zod.dev/) - Biblioteca de validación de esquemas para TypeScript.

### Despliegue y CI/CD
- **Hosting**: [Vercel](https://vercel.com/) - Plataforma para el despliegue y alojamiento de aplicaciones frontend.
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - Automatización de flujos de trabajo para testing y despliegue continuo.
- **Testing E2E**: [Cypress](https://www.cypress.io/) - Herramienta para pruebas de extremo a extremo automatizadas.

## ⚙️ Lógica y Flujo de la Aplicación

### 1. Autenticación
La autenticación se gestiona con **NextAuth.js** y está configurada en `auth.ts`.
- **Proveedor de Credenciales**: Permite a los usuarios iniciar sesión con email y contraseña.
- **Verificación**: Las contraseñas se verifican usando `bcrypt` contra el hash almacenado en la base de datos.
- **Sesión y Tokens (JWT)**: Al iniciar sesión, se crea un token JWT que incluye información del usuario, como su `id`, `name`, `email` y un campo `type` (probablemente para roles como 'admin' o 'user'). Este token se propaga a la sesión del cliente, permitiendo la implementación de lógica de acceso condicional en la UI.
- **Rutas Protegidas**: El archivo `middleware.ts` intercepta las peticiones para proteger las rutas del dashboard, redirigiendo a los usuarios no autenticados a la página de login.

### 2. Gestión de Datos (CRUD)
La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) para clientes y facturas.
- **Clientes**: Los usuarios pueden ver un listado, añadir, editar y eliminar clientes.
- **Facturas**: Se pueden crear facturas asociadas a clientes, ver su estado (pendiente, pagada), editarlas y eliminarlas.
- **Interacción con la BD**: La lógica para interactuar con la base de datos PostgreSQL se encuentra centralizada en archivos de acceso a datos (ej. `app/lib/data.ts`), utilizando el paquete `@vercel/postgres`.

### 3. Progressive Web App (PWA)
El proyecto está configurado como una PWA a través del archivo `public/manifest.json`. Esto permite que los usuarios puedan "instalar" la aplicación en sus dispositivos para un acceso más rápido y una experiencia similar a una app nativa.

## 📂 Estructura del Proyecto

La estructura sigue las convenciones del App Router de Next.js, promoviendo la colocalización de componentes, páginas y lógica.

```
facturas/
├── .github/
│   └── workflows/
│       └── vercel_workflow.yml  # Flujo de CI/CD con GitHub Actions
├── app/
│   ├── dashboard/               # Rutas y UI protegidas por autenticación
│   │   ├── customers/           # Páginas y componentes para clientes
│   │   ├── invoices/            # Páginas y componentes para facturas
│   │   └── layout.tsx           # Layout principal del dashboard (con sidebar, etc.)
│   ├── lib/
│   │   ├── actions.ts           # Server Actions para mutaciones de datos (formularios)
│   │   ├── data.ts              # Funciones para obtener datos de la BD
│   │   └── definitions.ts       # Definiciones de tipos de TypeScript
│   ├── ui/                      # Componentes de UI reutilizables
│   │   ├── customers/
│   │   ├── invoices/
│   │   └── ...
│   ├── layout.tsx               # Layout raíz de la aplicación
│   └── page.tsx                 # Página de inicio (landing/login)
├── auth/
│   ├── auth.config.ts           # Configuración de NextAuth (rutas, callbacks)
│   └── auth.ts                  # Configuración de proveedores y lógica de autorización
├── public/
│   ├── manifest.json            # Manifiesto para la PWA
│   └── ...                      # Archivos estáticos (imágenes, logos)
├── scripts/
│   └── seed.js                  # Script para poblar la BD con datos iniciales
├── middleware.ts                # Middleware para proteger rutas
├── next.config.js               # Configuración de Next.js
└── tailwind.config.ts           # Configuración de Tailwind CSS
```

## 🧩 Componentes Principales

La interfaz está construida con componentes reutilizables ubicados principalmente en `app/ui/`.

- **Formularios (`CreateForm`, `EditForm`)**: Componentes para crear y editar entidades (clientes, facturas). Utilizan Server Actions (`app/lib/actions.ts`) para manejar el envío de datos de forma segura.
- **Tablas (`customers/table.tsx`, `invoices/table.tsx`)**: Muestran listados de datos con paginación, búsqueda y filtros.
- **Breadcrumbs**: Componente de navegación que muestra la ruta actual del usuario dentro de la aplicación.
- **Skeletons**: Componentes de carga que mejoran la experiencia de usuario mientras se obtienen los datos.
- **Personalización de UI**:
  - `ThemeToggle`: Permite cambiar entre modo claro y oscuro.
  - `SelectorColores`: Permite al usuario seleccionar un color de acento para la interfaz.

## 🔄 Flujo de Trabajo de Despliegue (CI/CD)

El proyecto utiliza GitHub Actions para automatizar las pruebas y el despliegue. El flujo se define en `.github/workflows/vercel_workflow.yml`:

1.  **Activador**: El workflow se ejecuta en cada `push` a la rama `mastersss`.
2.  **Pruebas E2E (`Cypress_job`)**:
    - Levanta la aplicación en un entorno de prueba.
    - Ejecuta las pruebas de Cypress para verificar que las funcionalidades clave no se hayan roto.
    - Guarda los resultados de las pruebas como artefactos.
3.  **Despliegue (`Deploy_job_to_vercel`)**:
    - Si las pruebas son satisfactorias (o si se configura para continuar), despliega la aplicación a producción en Vercel.
    - Utiliza `secrets` de GitHub para los tokens de Vercel.
4.  **Notificación (`Notification_job`)**:
    - Se ejecuta siempre (`if: always()`) al final del workflow.
    - Envía un correo electrónico con el resultado de los trabajos de pruebas y despliegue.

## 🏁 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- Node.js (v18 o superior)
- npm o pnpm
- Una base de datos PostgreSQL

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd facturas
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las variables necesarias. Como mínimo, necesitarás la cadena de conexión a tu base de datos PostgreSQL.

```env
POSTGRES_URL="postgres://user:password@host:port/database"
AUTH_SECRET="tu_secreto_para_nextauth_muy_seguro"
```

### 4. Poblar la Base de Datos (Opcional)

Puedes usar el script `seed.js` para llenar tu base de datos con datos de ejemplo.

```bash
node ./scripts/seed.js
```

### 5. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre tu navegador y visita http://localhost:3000.