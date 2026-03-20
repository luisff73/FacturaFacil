# 🧾 FacturaFácil - Gestión de Facturación Compliant (SAAS)

**FacturaFácil** es una plataforma SAAS para la gestión integral de facturación, clientes y artículos. Diseñada bajo los estándares españoles de **Verifactu**, ofrece una solución robusta y escalable para autónomos y pequeñas empresas.

---

## ✨ Características Principales

- **✅ Cumplimiento Verifactu**: Generación automática de huella digital (HASH) encadenada para cada factura, asegurando la integridad e inalterabilidad de los registros.
- **🏢 Gestión Multi-Empresa**: Soporte para múltiples empresas independientes bajo una misma plataforma alojada en Vercel.
- **📄 Invoicing Avanzado**:
  - Gestión de líneas de factura detalladas.
  - Cálculo automático de impuestos (IVA y Recargo de Equivalencia) según perfil de cliente.
  - Gestión de estados: Borrador/Proforma, Pendiente y Pagada.
  - Generación de PDFs profesionales con códigos QR normativos.
- **📦 Inventario de Artículos**: Catálogo con gestión de stock, precios e imágenes centralizadas.
- **📱 PWA (Progressive Web App)**: Instalable en dispositivos móviles para acceso rápido y offline-first en consultas.
- **🌓 Interfaz Premium**: Modo claro/oscuro dinámico y personalización de colores de acento por usuario.
- **🔍 Monitorización en Tiempo Real**: Integración con Sentry para reporte de errores y rendimiento.

---

### 🛠️ Stack Tecnológico

### Core
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Autenticación**: [NextAuth.js v5](https://next-auth.js.org/) (Auth.js)
- **Base de Datos**: [Vercel Postgres](https://vercel.com/storage/postgres) (PostgreSQL)
- **Almacenamiento**: [Vercel Blob](https://vercel.com/storage/blob) (para imágenes de artículos y perfiles)

### UI/UX
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Heroicons](https://heroicons.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Animaciones**: Micro-interacciones con CSS nativo y Tailwind.
- **Componentes**: Arquitectura basada en Server Components para máximo rendimiento.

### Herramientas y Librerías
- **PDF**: [@react-pdf/renderer](https://react-pdf.org/) para generación de documentos en el cliente/servidor.
- **Validación**: [Zod](https://zod.dev/) para esquemas de datos y formularios.
- **PWA**: [@ducanh2912/next-pwa](https://github.com/ducanhgh/next-pwa)
- **Monitorización**: [Sentry](https://sentry.io/)

---

## 🔒 Lógica de Negocio y Seguridad

### 📜 Verifactu e Integridad
La aplicación implementa un sistema de encadenamiento de facturas:
1. Se genera un hash SHA-256 combinando: `NIF Emisor | Serie-Número | Fecha | Total | Hash Anterior`.
2. Cada factura queda vinculada matemáticamente a la anterior, detectando cualquier intento de manipulación manual de la base de datos.
3. Se incluye un código QR en cada PDF para la verificación ante la AEAT.

### 👥 Modelo de Datos Multi-Tenancy
Todos los recursos (facturas, clientes, artículos) están filtrados por `id_empresa`. El `middleware` y las `Server Actions` aseguran que un usuario solo pueda acceder y modificar datos pertenecientes a su organización.

### 📁 Almacenamiento de Archivos
Las imágenes de los artículos se procesan y almacenan en **Vercel Blob**, permitiendo una escalabilidad global y eliminando la carga de gestión de archivos en el servidor tradicional.

---

### 📂 Estructura del Proyecto

```bash
facturas/
├── app/
│   ├── dashboard/          # Rutas principales del panel de control
│   │   ├── articulos/      # Gestión de catálogo e inventario
│   │   ├── customers/      # Gestión de clientes y fiscalidad
│   │   ├── invoices/       # Core de facturación y generador PDF
│   │   └── users/          # Administración de usuarios de la empresa
│   ├── lib/                # Lógica compartida, tipos y acciones de servidor
│   │   ├── actions.ts      # Server Actions (Mutaciones)
│   │   ├── data.ts         # Consultas a la base de datos
│   │   └── definitions.ts  # Interfaces de TypeScript
│   └── ui/                 # Componentes visuales organizados por dominio
├── public/                 # Assets estáticos y manifiesto PWA
├── auth.ts                 # Configuración core de autenticación
├── next.config.ts          # Configuración del framework (PWA, Sentry, Image Domains)
└── sentry.*.config.ts      # Configuración específica de telemetría
```

---

### 🧩 Componentes Destacados

*   **Tablas de Datos:** Componentes avanzados con soporte para paginación el servidor y búsqueda dinámica.
*   **Formularios Inteligentes:** Validación robusta con Zod y retroalimentación visual de errores.
*   **Streaming & Skeletons:** Implementación de Suspense para mostrar estados de carga elegantes (Skeletons) mientras se obtienen los datos.
*   **Navegación Dinámica:** Uso de Breadcrumbs y Nav-Links activos para mejorar la orientación del usuario.
*   **Generador de QRs:** Integración en los documentos PDF para cumplimiento total de la normativa AEAT.

---

### 🔄 Flujo de Despliegue (CI/CD)

El proyecto utiliza **GitHub Actions** (`vercel_workflow.yml`) para automatizar el ciclo de vida del software:
1.  **Testing E2E (Cypress):** Ejecución automática de pruebas funcionales para asegurar que los flujos críticos (Login, Facturación) funcionan correctamente.
2.  **Despliegue en Producción:** Tras superar los tests, el sistema despliega la nueva versión en Vercel.
3.  **Monitorización Post-Deploy:** Sentry captura cualquier incidencia en el entorno de producción para una resolución inmediata.

---

### 🚀 Configuración y Desarrollo

1.  **Instalación:** Ejecutar `npm install` para descargar todas las dependencias.
2.  **Variables de Entorno (.env.local):**
    *   `POSTGRES_URL`: Credenciales de acceso a la base de datos PostgreSQL.
    *   `AUTH_SECRET`: Clave secreta para la seguridad de las cookies de sesión.
    *   `BLOB_READ_WRITE_TOKEN`: Token para la gestión de archivos en Vercel Blob.
    *   `NEXT_PUBLIC_SENTRY_DSN`: Endpoint para el envío de reportes a Sentry.
3.  **Ejecución:** Iniciar el servidor de desarrollo con `npm run dev`.

---

### 📈 Próximas Mejoras

*   [ ] Notificaciones push para el seguimiento de facturas vencidas.
*   [ ] Integración directa con pasarelas de pago online (Stripe).
*   [ ] Dashboard estadístico avanzado con gráficos de ingresos previstos y futuros.

---

Desarrollado con ❤️ para transformar la facturación digital de autónomos y pequeñas empresas.
