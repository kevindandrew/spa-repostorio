import { Head, Link, usePage } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const ESTADO_STYLE = {
    PENDIENTE:  { text: 'text-amber-400',  bg: 'bg-amber-400/10',  label: 'Pendiente'  },
    CONFIRMADA: { text: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Confirmada' },
    COMPLETADA: { text: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Completada' },
    CANCELADA:  { text: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Cancelada'  },
    NO_ASISTIO: { text: 'text-gray-400',   bg: 'bg-gray-400/10',   label: 'No asistió' },
};

export default function Dashboard({ proximaCita, citasRecientes, servicios }) {
    const { auth } = usePage().props;

    const completadas = citasRecientes.filter(c => c.estado === 'COMPLETADA').length;

    return (
        <ClienteLayout>
            <Head title="Mi Espacio — Beauty Salon" />

            {/* Bienvenida */}
            <div className="mb-8">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-spa-on-light-dim dark:text-gold/50 mb-1">
                    Bienvenida de nuevo
                </p>
                <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                    Hola,{' '}
                    <span className="text-gold-mid dark:text-gold italic">
                        {auth?.user?.nombre?.split(' ')[0] ?? 'Invitada'}
                    </span>
                </h2>
            </div>

            {/* Próxima cita — hero */}
            {proximaCita ? (
                <div className="kpi-card mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none rounded-full"
                         style={{ background: 'radial-gradient(circle, #e8c17f 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
                    <div className="flex items-center gap-2 mb-4">
                        <Icon name="event_upcoming" className="text-gold text-[18px]" />
                        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold">
                            Tu Próxima Cita
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="flex-1">
                            <p className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                {proximaCita.servicio}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-3">
                                <span className="flex items-center gap-1.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark">
                                    <Icon name="calendar_today" className="text-gold/70 text-[15px]" />
                                    {proximaCita.fecha}
                                </span>
                                <span className="flex items-center gap-1.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark">
                                    <Icon name="schedule" className="text-gold/70 text-[15px]" />
                                    {proximaCita.hora}
                                </span>
                                <span className="flex items-center gap-1.5 font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                    <Icon name="person" className="text-[15px]" />
                                    {proximaCita.empleado}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <span className={`px-3 py-1.5 rounded-sm font-sans text-[10px] uppercase tracking-wider
                                              ${ESTADO_STYLE[proximaCita.estado]?.bg ?? ''} ${ESTADO_STYLE[proximaCita.estado]?.text ?? ''}`}>
                                {ESTADO_STYLE[proximaCita.estado]?.label ?? proximaCita.estado}
                            </span>
                            <Link href={route('cliente.citas.index')}
                              className="font-sans text-[10px] text-gold/60 hover:text-gold transition-colors uppercase tracking-widest">
                                Ver detalles →
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="kpi-card mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                        <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">
                            Sin citas próximas
                        </p>
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            ¿Lista para relajarte? Agenda tu próxima visita.
                        </p>
                    </div>
                    <Link href={route('cliente.reservar.index')}
                          className="gold-gradient shimmer-btn py-3 px-6 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-text rounded-sm transition-all hover:brightness-110 whitespace-nowrap">
                        <Icon name="add" className="text-[14px] mr-1.5 align-middle" />
                        Reservar Cita
                    </Link>
                </div>
            )}

            {/* Historial + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

                <div className="lg:col-span-2 kpi-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Mis Citas</h3>
                        <Link href={route('cliente.citas.index')}
                              className="font-sans text-[10px] text-gold uppercase tracking-widest hover:opacity-70 transition-opacity">
                            Ver todas →
                        </Link>
                    </div>
                    {citasRecientes.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                            Aún no tienes citas registradas.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {citasRecientes.map((cita) => {
                                const s = ESTADO_STYLE[cita.estado] ?? ESTADO_STYLE.PENDIENTE;
                                const [dd, mm] = cita.fecha.split(' ');
                                return (
                                    <div key={cita.id}
                                         className="flex items-center gap-4 p-4 rounded-sm
                                                    bg-spa-border/20 dark:bg-white/5
                                                    border border-spa-border dark:border-gold/10
                                                    hover:border-gold/30 transition-all">
                                        <div className="text-center shrink-0 w-14">
                                            <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark leading-tight">
                                                {dd} {mm}
                                            </p>
                                            <p className="font-sans text-xs text-gold mt-0.5">{cita.hora}</p>
                                        </div>
                                        <div className="w-px h-10 bg-gold/20 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark truncate">
                                                {cita.servicio}
                                            </p>
                                            <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim truncate">
                                                {cita.empleado}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className={`px-2 py-0.5 rounded-sm font-sans text-[9px] uppercase tracking-wider ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                            {cita.precio && (
                                                <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                    ${cita.precio}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick stats */}
                <div className="kpi-card">
                    <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-gold/50 mb-5">
                        Tu Resumen
                    </p>
                    <div className="space-y-5">
                        <div>
                            <p className="font-serif text-4xl gold-gradient-text">{citasRecientes.length}</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Visitas registradas
                            </p>
                        </div>
                        <div className="h-px bg-gold/10" />
                        <div>
                            <p className="font-serif text-4xl gold-gradient-text">{completadas}</p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Completadas
                            </p>
                        </div>
                        <div className="h-px bg-gold/10" />
                        <div>
                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">
                                {proximaCita ? proximaCita.fecha : '—'}
                            </p>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Próxima visita
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catálogo de servicios */}
            {servicios.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Nuestros Servicios</h3>
                        <button className="font-sans text-[10px] text-gold uppercase tracking-widest hover:opacity-70 transition-opacity">
                            Ver catálogo →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {servicios.map((s) => (
                            <div key={s.id}
                                 className="kpi-card group cursor-pointer border border-transparent
                                            hover:border-gold/30 transition-all duration-300">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Icon name="auto_awesome" className="text-gold/60 text-[16px]" />
                                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold/60">
                                        {s.categoria}
                                    </span>
                                </div>
                                <p className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark mb-2 leading-snug">
                                    {s.nombre}
                                </p>
                                <div className="flex justify-between items-end mb-4">
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {s.duracion} min
                                    </span>
                                    <span className="font-serif text-xl gold-gradient-text">
                                        ${s.precio}
                                    </span>
                                </div>
                                <Link href={`${route('cliente.reservar.index')}?servicio_id=${s.id}`}
                                      className="block w-full py-2 text-center font-sans text-[10px] uppercase tracking-[0.2em]
                                                 border border-gold/30 text-gold hover:bg-gold/10 transition-all rounded-sm">
                                    Reservar
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
}
