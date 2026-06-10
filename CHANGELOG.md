# CHANGELOG

Todos los cambios notables de este proyecto están documentados en este archivo.

---

## [Sin versión] — 2026-06-07

### DevOps / Infraestructura
- **Dockerización completa**: se agregaron `Dockerfile`, `.dockerignore`, `docker/nginx.conf.template`, `docker/supervisord.conf` y `docker/start.sh` para poder correr la aplicación en contenedores.
- **Configuración Railway**: se añadió `nixpacks.toml` para el despliegue en Railway.
- **Corrección de seeders**: se ajustaron `CategoriasServicioSeeder`, `ServiciosSeeder` y `UsuariosSeeder` para que los datos iniciales carguen correctamente en el entorno Docker.
- **Fix bug Inertia/Laravel**: corrección de un error de integración entre Laravel e Inertia.js.

---

## [Sin versión] — 2026-05-31

### Correcciones generales
- **AdminLayout**: se amplió el layout del panel de administración con nuevas secciones y mejoras de navegación.
- **CitasController (Admin)**: se reforzó la lógica de gestión de citas desde el panel admin.
- **Middleware Inertia**: se extendió `HandleInertiaRequests` para compartir más datos globales con el frontend.
- **Modelos User / Usuario**: se consolidaron y limpiaron los modelos de usuario, eliminando duplicidad de lógica.
- **Perfil de usuario**: correcciones en la vista `Profile/Edit`.

---

## [Sin versión] — 2026-05-25

### Módulo de Paquetes y Promociones
- **Categorías (CRUD)**: nuevo controlador `CategoriasController` y vista `Admin/Categorias.jsx` para gestionar categorías de servicios.
- **Solicitudes de Paquetes**: se amplió `SolicitudesPaqueteController` y su vista `Admin/SolicitudesPaquetes.jsx` con flujos de aprobación/rechazo y mayor detalle.
- **Paquetes (Admin/Cliente)**: mejoras en los controladores y vistas de paquetes tanto para administradores como para clientes.
- **Modelo Cliente**: se añadieron relaciones y lógica adicional al modelo `Cliente`.
- **Reservar (Cliente)**: mejoras en la vista y lógica de reserva de paquetes.
- **Migración**: nueva migración para agregar la columna `cantidad` a la tabla `paquete_servicio`.
- **Rutas**: se actualizaron las rutas web para reflejar los nuevos controladores.

---

## [Sin versión] — 2026-05-18

### Módulo de Citas
- **Gestión de citas completa**: nuevo módulo con filtrado avanzado, lógica de programación y vistas especializadas para administradores y clientes.
- **34 archivos** modificados con más de 1,500 líneas de código nuevo.

---

## [Sin versión] — 2026-05-16

### Módulo de Paquetes y Promociones (versión inicial)
- **Sistema de paquetes y promociones**: se implementó el esquema de base de datos y los componentes UI para la gestión de paquetes y promociones.
- **Correcciones de 2FA**: ajustes en el flujo de autenticación de dos factores.

---

## [Sin versión] — 2026-05-12

### Autenticación y Registro
- **Flujo de autenticación**: implementación del flujo completo de login y registro con componentes de UI temáticos para el spa.

---

## [Sin versión] — 2026-05-11

### Base del sistema (commit inicial y estructura)
- **Primer commit**: base del proyecto Laravel 12 + React (Inertia/Breeze).
- **Landing Page**: se implementó el layout de la página de inicio con importación de assets (servicios, galería, videos).
- **Gestión de perfil de usuario**: funcionalidades para actualizar datos, cambiar contraseña y eliminar cuenta.
- **Estructura de autenticación**: páginas y layouts para los roles de administrador y cliente.

---

*Generado el 2026-06-10 — Proyecto: Super SPA*
