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

const KPI_DATA = [
    { label: 'Citas Hoy',       value: '24',    trend: '+12%', up: true,  icon: 'event' },
    { label: 'Ingresos Semana', value: '$1,280', trend: '+4%',  up: true,  icon: 'payments' },
    { label: 'Especialistas',   value: '3',      trend: 'Activos', up: null, icon: 'groups' },
    { label: 'Clientes Nuevos', value: '6',      trend: '-2%',  up: false, icon: 'person_add' },
];

const CHART_BARS = [
    { day: 'Lun', h: '60%' }, { day: 'Mar', h: '85%' }, { day: 'Mié', h: '45%' },
    { day: 'Jue', h: '75%' }, { day: 'Vie', h: '95%' }, { day: 'Sáb', h: '80%' }, { day: 'Dom', h: '30%' },
];

const TIMELINE = [
    { time: '09:00', name: 'Juan Pérez',   service: 'Masaje Relajante', active: true },
    { time: '11:30', name: 'Sofía Méndez', service: 'Limpieza Facial',  active: false },
    { time: '14:00', name: 'Luis Vargas',  service: 'Manicura con Gel', active: false },
];

const ACTIVITY = [
    { icon: 'add_circle',   color: 'text-gold',      text: 'Nueva cita de',        name: 'Sofía M.',           time: '14 min' },
    { icon: 'check_circle', color: 'text-green-500', text: 'Cita completada:',     name: 'Juan P.',            time: '1 hora' },
    { icon: 'cancel',       color: 'text-red-400',   text: 'Cita cancelada:',      name: 'Luis V.',            time: '3 horas' },
    { icon: 'edit',         color: 'text-gold/70',   text: 'Servicio actualizado:', name: 'Masaje Relajante',  time: '5 horas' },
];

export default function Dashboard() {
    const { auth } = usePage().props;
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

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
                {KPI_DATA.map(({ label, value, trend, up, icon }) => (
                    <div key={label} className="kpi-card group">
                        <div className="flex items-start justify-between mb-4">
                            <Icon name={icon} className="text-gold/70 text-[22px]" />
                            {up !== null ? (
                                <span className={`font-sans text-[10px] flex items-center gap-0.5 ${up ? 'text-green-500' : 'text-red-400'}`}>
                                    <Icon name={up ? 'trending_up' : 'trending_down'} className="text-[14px]" />
                                    {trend}
                                </span>
                            ) : (
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
                        <span className="font-sans text-[10px] text-gold border-b border-gold pb-0.5 uppercase tracking-widest cursor-pointer">
                            Esta semana
                        </span>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-48 px-2 relative">
                        {[0,1,2,3].map(i => (
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
                        <button className="font-sans text-[10px] text-gold uppercase tracking-widest hover:opacity-70 transition-opacity">
                            Ver todo
                        </button>
                    </div>
                    <div className="relative pl-6 border-l border-gold/20 space-y-8">
                        {TIMELINE.map(({ time, name, service, active }) => (
                            <div key={time} className={`relative ${!active ? 'opacity-50' : ''}`}>
                                <div className={`absolute -left-[25px] top-0 w-3 h-3 rounded-full ring-4
                                                 ring-white dark:ring-spa-surface-high
                                                 ${active ? 'bg-gold' : 'bg-spa-outline'}`} />
                                <p className="font-sans text-[9px] text-gold uppercase tracking-widest mb-1">{time}</p>
                                <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">{name}</p>
                                <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim">{service}</p>
                                {active && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gold/10 text-gold font-sans text-[9px] uppercase tracking-wider rounded-sm">
                                        En progreso
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
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
                <div className="space-y-4">
                    {ACTIVITY.map(({ icon, color, text, name, time }, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-spa-border dark:border-gold/5 last:border-0">
                            <Icon name={icon} className={`${color} text-[20px] shrink-0`} />
                            <p className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark flex-1">
                                {text}&nbsp;<span className="text-gold-mid dark:text-gold font-medium">{name}</span>
                            </p>
                            <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim whitespace-nowrap">
                                {time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
