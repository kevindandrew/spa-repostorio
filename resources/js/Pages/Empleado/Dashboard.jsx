import { Head } from '@inertiajs/react';
import EmpleadoLayout from '@/Layouts/EmpleadoLayout';
import Stars from '@/Components/Stars';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const ESTADO_STYLE = {
    PENDIENTE:  { text: 'text-amber-400',  bg: 'bg-amber-400/10',  label: 'Pendiente'  },
    CONFIRMADA: { text: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Confirmada' },
    COMPLETADA: { text: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Completada' },
    CANCELADA:  { text: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Cancelada'  },
    NO_ASISTIO: { text: 'text-gray-400',   bg: 'bg-gray-400/10',   label: 'No asistió' },
};

export default function Dashboard({ empleado, citasHoy, proximaCita, disponibilidad }) {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const citasActivas = citasHoy.filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length;
    const minutosTotal = citasHoy.reduce((acc, c) => acc + (c.duracion || 0), 0);

    return (
        <EmpleadoLayout title="Mi Dashboard">
            <Head title="Dashboard — Especialista" />

            {/* Bienvenida */}
            <div className="mb-8">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-spa-on-light-dim dark:text-gold/50 mb-1">
                    {today}
                </p>
                <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                    Hola,{' '}
                    <span className="text-gold-mid dark:text-gold italic">
                        {empleado.nombre.split(' ')[0]}
                    </span>
                </h2>
                {empleado.especialidad && (
                    <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-gold/50 mt-1 uppercase tracking-widest">
                        {empleado.especialidad}
                    </p>
                )}
                {empleado.avg_calificacion !== null && empleado.avg_calificacion !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                        <Stars value={Math.round(empleado.avg_calificacion)} size="text-[16px]" />
                        <span className="font-serif text-base gold-gradient-text">{empleado.avg_calificacion}</span>
                        <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            ({empleado.total_resenas} reseña{empleado.total_resenas !== 1 ? 's' : ''})
                        </span>
                    </div>
                )}
            </div>

            {/* Próxima cita + resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

                <div className="lg:col-span-2">
                    {proximaCita ? (
                        <div className="kpi-card border border-gold/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="event_upcoming" className="text-gold text-[18px]" />
                                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold">
                                    Próxima Cita
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                        {proximaCita.cliente}
                                    </p>
                                    <p className="font-sans text-sm italic text-spa-on-light-dim dark:text-spa-on-dark-dim mb-3">
                                        {proximaCita.servicio}
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <span className="flex items-center gap-1 font-sans text-xs text-spa-on-light dark:text-spa-on-dark">
                                            <Icon name="schedule" className="text-gold/70 text-[15px]" />
                                            {proximaCita.hora_inicio} – {proximaCita.hora_fin}
                                        </span>
                                        <span className="flex items-center gap-1 font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                            <Icon name="timer" className="text-[15px]" />
                                            {proximaCita.duracion} min
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-2">
                                    <span className={`px-3 py-1.5 rounded-sm font-sans text-[10px] uppercase tracking-wider
                                                      ${ESTADO_STYLE[proximaCita.estado]?.bg} ${ESTADO_STYLE[proximaCita.estado]?.text}`}>
                                        {ESTADO_STYLE[proximaCita.estado]?.label}
                                    </span>
                                    {proximaCita.precio_cobrado && (
                                        <span className="font-serif text-xl gold-gradient-text">
                                            ${proximaCita.precio_cobrado}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {proximaCita.notas_cliente && (
                                <div className="mt-4 pt-4 border-t border-gold/10">
                                    <p className="font-sans text-[10px] uppercase tracking-widest text-gold/50 mb-1">Notas del cliente</p>
                                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                                        "{proximaCita.notas_cliente}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="kpi-card flex flex-col items-center justify-center py-12 text-center">
                            <Icon name="event_available" className="text-gold/30 text-[48px] mb-3" />
                            <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                Sin citas pendientes
                            </p>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                Tu agenda de hoy está libre
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats del día */}
                <div className="kpi-card">
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-gold/50 mb-5">
                        Resumen del día
                    </p>
                    <div className="space-y-5">
                        <div>
                            <p className="font-serif text-4xl gold-gradient-text">{citasHoy.length}</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Citas totales
                            </p>
                        </div>
                        <div className="h-px bg-gold/10" />
                        <div>
                            <p className="font-serif text-4xl gold-gradient-text">{citasActivas}</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Pendientes
                            </p>
                        </div>
                        <div className="h-px bg-gold/10" />
                        <div>
                            <p className="font-serif text-4xl gold-gradient-text">
                                {minutosTotal}
                                <span className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim ml-1">min</span>
                            </p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Tiempo total
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Agenda + Disponibilidad */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                <div className="lg:col-span-2 kpi-card">
                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-6">
                        Agenda de Hoy
                    </h3>
                    {citasHoy.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                            No hay citas programadas para hoy.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {citasHoy.map((cita) => {
                                const s = ESTADO_STYLE[cita.estado] ?? ESTADO_STYLE.PENDIENTE;
                                return (
                                    <div key={cita.id}
                                         className="flex items-center gap-4 p-4 rounded-sm
                                                    bg-spa-border/20 dark:bg-white/5
                                                    border border-spa-border dark:border-gold/10
                                                    hover:border-gold/30 transition-all">
                                        <div className="text-center shrink-0 w-14">
                                            <p className="font-serif text-lg gold-gradient-text leading-none">{cita.hora_inicio}</p>
                                            <p className="font-sans text-[9px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                                {cita.hora_fin}
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-gold/20 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark truncate">
                                                {cita.cliente}
                                            </p>
                                            <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim truncate">
                                                {cita.servicio} · {cita.duracion} min
                                            </p>
                                        </div>
                                        <span className={`shrink-0 px-2 py-1 rounded-sm font-sans text-[9px] uppercase tracking-wider ${s.bg} ${s.text}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Disponibilidad semanal */}
                <div className="kpi-card">
                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-6">
                        Mi Disponibilidad
                    </h3>
                    {disponibilidad.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                            Sin horarios configurados.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {disponibilidad.map(({ dia, hora_inicio, hora_fin }) => (
                                <div key={dia} className="flex items-center justify-between">
                                    <span className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light dark:text-spa-on-dark w-10">
                                        {DIAS[dia] ?? dia}
                                    </span>
                                    <div className="flex-1 mx-3 h-px bg-gold/10" />
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {hora_inicio} – {hora_fin}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </EmpleadoLayout>
    );
}
