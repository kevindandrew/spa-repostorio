import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

const ACTIVIDAD_ICON = {
    PENDIENTE:  { icon: 'schedule',     color: 'text-amber-400' },
    CONFIRMADA: { icon: 'check_circle', color: 'text-blue-400'  },
    COMPLETADA: { icon: 'check_circle', color: 'text-green-400' },
    CANCELADA:  { icon: 'cancel',       color: 'text-red-400'   },
    NO_ASISTIO: { icon: 'person_off',   color: 'text-gray-400'  },
};

const CHART_BARS = [
    { day: 'Lun', h: '60%' }, { day: 'Mar', h: '85%' }, { day: 'Mié', h: '45%' },
    { day: 'Jue', h: '75%' }, { day: 'Vie', h: '95%' }, { day: 'Sáb', h: '80%' }, { day: 'Dom', h: '30%' },
];

export default function Dashboard({ stats, timeline, actividad }) {
    const { auth } = usePage().props;
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    const kpis = [
        { label: 'Citas Hoy',        value: stats.citasHoy,         icon: 'event',      trend: null          },
        { label: 'Ingresos Semana',  value: '$—',                   icon: 'payments',   trend: null          },
        { label: 'Especialistas',    value: stats.empleadosActivos,  icon: 'groups',     trend: 'Activos'     },
        { label: 'Clientes Nuevos',  value: stats.clientesNuevos,   icon: 'person_add', trend: 'Este mes'    },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard — Admin" />

            {/* Bienvenida */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-spa-on-light-dim dark:text-gold/50 mb-1">
                        {today}
                    </p>
                    <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        Bienvenido,{' '}
                        <span className="text-gold-mid dark:text-gold italic">
                            {auth?.user?.nombre?.split(' ')[0] ?? 'Admin'}
                        </span>
                    </h2>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {kpis.map(({ label, value, icon, trend }) => (
                    <div key={label} className="kpi-card group">
                        <div className="flex items-start justify-between mb-4">
                            <Icon name={icon} className="text-gold/70 text-[22px]" />
                            {trend && (
                                <span className="font-sans text-[10px] text-gold/50">{trend}</span>
                            )}
                        </div>
                        <p className="font-serif text-3xl gold-gradient-text font-normal mb-1">{value}</p>
                        <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Gráfica + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

                <div className="lg:col-span-2 kpi-card">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Ingresos Semanales</h3>
                        <span className="font-sans text-[10px] text-gold border-b border-gold pb-0.5 uppercase tracking-widest">
                            Esta semana
                        </span>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-48 px-2 relative">
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="absolute inset-x-2 h-px bg-spa-border dark:bg-gold/5"
                                 style={{ bottom: `${i * 33}%` }} />
                        ))}
                        {CHART_BARS.map(({ day, h }) => (
                            <div key={day} className="flex flex-col items-center flex-1 group relative z-10">
                                <div className="w-full gold-gradient rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300"
                                     style={{ height: h }} />
                                <p className="font-sans text-[9px] mt-3 text-spa-on-light-dim dark:text-spa-on-dark-dim uppercase tracking-wider">
                                    {day}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Hoy</h3>
                        <span className="font-sans text-[10px] text-gold/50 uppercase tracking-widest">
                            {timeline.length} citas
                        </span>
                    </div>
                    {timeline.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                            Sin citas programadas.
                        </p>
                    ) : (
                        <div className="relative pl-6 border-l border-gold/20 space-y-6">
                            {timeline.map((cita, i) => {
                                const s = ESTADO_STYLE[cita.estado] ?? ESTADO_STYLE.PENDIENTE;
                                const isFirst = i === 0;
                                return (
                                    <div key={cita.id} className={`relative ${!isFirst ? 'opacity-55' : ''}`}>
                                        <div className={`absolute -left-[25px] top-0 w-3 h-3 rounded-full ring-4
                                                         ring-white dark:ring-spa-surface-high
                                                         ${isFirst ? 'bg-gold' : 'bg-spa-outline'}`} />
                                        <p className="font-sans text-[9px] text-gold uppercase tracking-widest mb-1">{cita.hora}</p>
                                        <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">{cita.cliente}</p>
                                        <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim">{cita.servicio}</p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 ${s.bg} ${s.text} font-sans text-[9px] uppercase tracking-wider rounded-sm`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Actividad reciente */}
            <div className="kpi-card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Actividad Reciente</h3>
                    <button className="font-sans text-[10px] text-gold uppercase tracking-widest hover:opacity-70 transition-opacity">
                        Ver informe
                    </button>
                </div>
                {actividad.length === 0 ? (
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                        Sin actividad reciente.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {actividad.map(({ estado, cliente, servicio, tiempo }, i) => {
                            const act = ACTIVIDAD_ICON[estado] ?? { icon: 'info', color: 'text-gold/70' };
                            const s   = ESTADO_STYLE[estado] ?? ESTADO_STYLE.PENDIENTE;
                            return (
                                <div key={i} className="flex items-center gap-4 py-2 border-b border-spa-border dark:border-gold/5 last:border-0">
                                    <Icon name={act.icon} className={`${act.color} text-[20px] shrink-0`} />
                                    <p className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark flex-1">
                                        Cita&nbsp;<span className={`font-medium ${s.text}`}>{s.label}</span>
                                        &nbsp;—&nbsp;<span className="opacity-80">{cliente}</span>
                                        &nbsp;·&nbsp;<span className="italic opacity-60">{servicio}</span>
                                    </p>
                                    <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim whitespace-nowrap">
                                        {tiempo}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
