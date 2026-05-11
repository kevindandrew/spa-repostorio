# Beauty Salon — SPA de Gestión

Sistema de gestión para un salón de belleza de lujo. Permite a clientes reservar citas, a especialistas gestionar su agenda y disponibilidad, y a administradores controlar el negocio completo.

## Stack tecnológico

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 18 + Inertia.js + Tailwind CSS
- **Base de datos:** MySQL (XAMPP recomendado)
- **Build tool:** Vite

---

## Requisitos previos

- PHP 8.2 o superior
- Composer
- Node.js 18+ y npm
- XAMPP (o cualquier servidor MySQL en puerto 3306)

---

## Instalación después de clonar

### 1. Instalar dependencias

```bash
composer install
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
php artisan key:generate
```

Editar `.env` y ajustar las credenciales de base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=spa_db
DB_USERNAME=root
DB_PASSWORD=
```

> En XAMPP el usuario por defecto es `root` sin contraseña.

### 3. Crear la base de datos

En phpMyAdmin o desde la consola MySQL:

```sql
CREATE DATABASE spa_db;
```

### 4. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

Esto crea todas las tablas y carga datos de prueba.

### 5. Levantar el proyecto

En dos terminales separadas:

```bash
# Terminal 1 — servidor Laravel
php artisan serve

# Terminal 2 — compilador de assets
npm run dev
```

El proyecto queda disponible en `http://localhost:8000`.

---

## Usuarios de prueba

Todos los usuarios tienen la contraseña `password`.

| Rol          | Email               | Acceso                           |
|--------------|---------------------|----------------------------------|
| Admin        | admin@spa.com       | Panel completo de administración |
| Especialista | maria@spa.com       | Portal de especialista           |
| Especialista | carlos@spa.com      | Portal de especialista           |
| Especialista | ana@spa.com         | Portal de especialista           |
| Cliente      | juan@cliente.com    | Reservas y mis citas             |
| Cliente      | sofia@cliente.com   | Reservas y mis citas             |
| Cliente      | luis@cliente.com    | Reservas y mis citas             |

---

## Scripts disponibles

```bash
# Desarrollo
php artisan serve                    # Servidor Laravel en :8000
npm run dev                          # Vite en modo watch

# Producción
npm run build                        # Compila assets para producción

# Base de datos
php artisan migrate                  # Ejecutar migraciones pendientes
php artisan migrate:fresh --seed     # Resetear BD completa y cargar seeders
php artisan db:seed                  # Solo seeders (sin migrar)

# Utilidades
php artisan tinker                   # Consola interactiva de Laravel
php artisan route:list               # Ver todas las rutas registradas
```

---

## Estructura de roles

```
ADMIN     → /admin/*       Panel de administración
EMPLEADO  → /empleado/*    Portal de especialista
CLIENTE   → /cliente/*     Portal del cliente
```

El middleware `role` redirige automáticamente según el rol del usuario autenticado al hacer login.

---

## Notas

- La zona horaria está configurada en `America/La_Paz` (Bolivia, UTC-4). Ajustar en `config/app.php` si es necesario.
- Los slots de reserva se generan en grilla de 30 minutos dentro del horario de disponibilidad del especialista.
- Cada cita completada admite una sola reseña (1–5 estrellas + comentario opcional).
