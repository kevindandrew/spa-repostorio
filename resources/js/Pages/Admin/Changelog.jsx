import AdminLayout from '@/Layouts/AdminLayout';

const UPCOMING = [
    { text: 'Reportes y estadísticas: ingresos, citas por período, servicios más solicitados.' },
    { text: 'Módulo de pagos: registro de pagos por cita/paquete y estado de cuenta del cliente.' },
    { text: 'Notificaciones por correo: confirmación de citas, recordatorios y cambios de estado.' },
    { text: 'Galería administrable: gestión de imágenes del spa desde el panel.' },
    { text: 'Reseñas: moderación y respuestas desde el panel de admin.' },
];

const ENTRIES = [
    {
        version: 'v1.3',
        date: '07 Jun 2026',
        category: 'DevOps',
        color: 'text-blue-400',
        icon: 'deployed_code',
        changes: [
            { type: 'new',  text: 'Dockerización completa: Dockerfile, Nginx, Supervisor y scripts de inicio.' },
            { type: 'new',  text: 'Configuración de despliegue en Railway (nixpacks.toml).' },
            { type: 'fix',  text: 'Corrección de seeders de usuarios, categorías y servicios para entorno Docker.' },
            { type: 'fix',  text: 'Corrección de bug de integración entre Laravel e Inertia.js.' },
        ],
    },
    {
        version: 'v1.2',
        date: '31 May 2026',
        category: 'Correcciones Generales',
        color: 'text-amber-400',
        icon: 'build',
        changes: [
            { type: 'improve', text: 'AdminLayout ampliado con nuevas secciones y navegación mejorada.' },
            { type: 'improve', text: 'CitasController (Admin) con lógica de gestión más robusta.' },
            { type: 'improve', text: 'Middleware Inertia: más datos compartidos globalmente con el frontend.' },
            { type: 'fix',     text: 'Modelos User / Usuario consolidados, eliminando duplicidad de lógica.' },
            { type: 'fix',     text: 'Correcciones en la vista de edición de perfil de usuario.' },
        ],
    },
    {
        version: 'v1.1',
        date: '25 May 2026',
        category: 'Módulo Paquetes & Promociones',
        color: 'text-gold',
        icon: 'local_offer',
        changes: [
            { type: 'new',     text: 'Gestión de Categorías de servicios (CRUD completo).' },
            { type: 'new',     text: 'Migración para columna cantidad en tabla paquete_servicio.' },
            { type: 'improve', text: 'Solicitudes de Paquetes: flujos de aprobación/rechazo y mayor detalle.' },
            { type: 'improve', text: 'Vista de Paquetes mejorada para admin y clientes.' },
            { type: 'improve', text: 'Vista de Reservar con mejor UX para selección de paquetes.' },
        ],
    },
    {
        version: 'v1.0',
        date: '18 May 2026',
        category: 'Módulo de Citas',
        color: 'text-emerald-400',
        icon: 'event',
        changes: [
            { type: 'new', text: 'Gestión completa de citas para administradores y clientes.' },
            { type: 'new', text: 'Filtrado avanzado por fecha, especialista y estado.' },
            { type: 'new', text: 'Vistas especializadas según el rol del usuario.' },
            { type: 'new', text: 'Lógica de programación y control de disponibilidad.' },
        ],
    },
    {
        version: 'v0.3',
        date: '16 May 2026',
        category: 'Paquetes Iniciales & 2FA',
        color: 'text-purple-400',
        icon: 'security',
        changes: [
            { type: 'new', text: 'Sistema base de paquetes y promociones (esquema de BD y UI).' },
            { type: 'fix', text: 'Correcciones en el flujo de autenticación de dos factores (2FA).' },
        ],
    },
    {
        version: 'v0.2',
        date: '12 May 2026',
        category: 'Autenticación & Registro',
        color: 'text-rose-400',
        icon: 'login',
        changes: [
            { type: 'new', text: 'Flujo completo de login y registro con UI temática del spa.' },
        ],
    },
    {
        version: 'v0.1',
        date: '11 May 2026',
        category: 'Base del Sistema',
        color: 'text-spa-on-dark-dim',
        icon: 'rocket_launch',
        changes: [
            { type: 'new', text: 'Primer commit: base Laravel 12 + React (Inertia/Breeze).' },
            { type: 'new', text: 'Landing page con assets de servicios, galería y videos.' },
            { type: 'new', text: 'Gestión de perfil: actualizar datos, cambiar contraseña, eliminar cuenta.' },
            { type: 'new', text: 'Estructura de autenticación con layouts para roles Admin y Cliente.' },
        ],
    },
];

const TYPE_BADGE = {
    new:     { label: 'Nuevo',   cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    improve: { label: 'Mejora',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    fix:     { label: 'Fix',     cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function Changelog() {
    return (
        <AdminLayout title="Historial de Cambios">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/60 mb-1">Sistema</p>
                    <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark italic">
                        Historial de Cambios
                    </h2>
                    <p className="mt-2 text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                        Registro cronológico de versiones y actualizaciones del sistema.
                    </p>
                </div>

                {/* Próximamente */}
                <div className="mb-10 bg-white dark:bg-spa-surface border border-dashed border-gold/30 rounded-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Icon name="schedule" className="text-[18px] text-gold/70" />
                        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/70">Próximamente</p>
                    </div>
                    <ul className="space-y-2">
                        {UPCOMING.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <span className="text-[13px] text-spa-on-light-dim dark:text-spa-on-dark-dim leading-relaxed">
                                    {item.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Línea vertical */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gold/15" />

                    <div className="space-y-8">
                        {ENTRIES.map((entry) => (
                            <div key={entry.version} className="relative flex gap-6">
                                {/* Dot */}
                                <div className={`shrink-0 w-10 h-10 rounded-full bg-spa-surface border border-gold/20
                                                 flex items-center justify-center z-10 ${entry.color}`}>
                                    <Icon name={entry.icon} className="text-[18px]" />
                                </div>

                                {/* Card */}
                                <div className="flex-1 pb-2">
                                    <div className="bg-white dark:bg-spa-surface border border-spa-border dark:border-gold/10
                                                    rounded-sm shadow-sm p-5">
                                        {/* Card header */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`font-sans text-xs font-bold uppercase tracking-widest ${entry.color}`}>
                                                        {entry.version}
                                                    </span>
                                                    <span className="text-spa-on-light-dim dark:text-spa-on-dark-dim text-[11px]">—</span>
                                                    <span className="font-sans text-[11px] text-spa-on-light dark:text-spa-on-dark font-medium">
                                                        {entry.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="shrink-0 font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                             bg-spa-ivory dark:bg-spa-bg px-2 py-0.5 rounded-sm border border-spa-border dark:border-gold/10">
                                                {entry.date}
                                            </span>
                                        </div>

                                        {/* Changes list */}
                                        <ul className="space-y-2">
                                            {entry.changes.map((c, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className={`shrink-0 mt-0.5 text-[9px] font-bold uppercase tracking-widest
                                                                      border px-1.5 py-0.5 rounded-sm ${TYPE_BADGE[c.type].cls}`}>
                                                        {TYPE_BADGE[c.type].label}
                                                    </span>
                                                    <span className="text-[13px] text-spa-on-light dark:text-spa-on-dark leading-relaxed">
                                                        {c.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mt-10 text-center font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim tracking-widest uppercase">
                    Super SPA — Management System
                </p>
            </div>
        </AdminLayout>
    );
}
