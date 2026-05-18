import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend,
} from 'recharts';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const ESTADO_STYLE = {
    PENDIENTE:  { text: 'text-amber-400',  bg: 'bg-amber-400/10',  label: 'Pendiente',  color: '#fbbf24' },
    CONFIRMADA: { text: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Confirmada', color: '#60a5fa' },
    COMPLETADA: { text: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Completada', color: '#4ade80' },
    CANCELADA:  { text: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Cancelada',  color: '#f87171' },
    NO_ASISTIO: { text: 'text-gray-400',   bg: 'bg-gray-400/10',   label: 'No asistió', color: '#9ca3af' },
};

const ACTIVIDAD_ICON = {
    PENDIENTE:  { icon: 'schedule',     color: 'text-amber-400' },
    CONFIRMADA: { icon: 'check_circle', color: 'text-blue-400'  },
    COMPLETADA: { icon: 'check_circle', color: 'text-green-400' },
    CANCELADA:  { icon: 'cancel',       color: 'text-red-400'   },
    NO_ASISTIO: { icon: 'person_off',   color: 'text-gray-400'  },
};

const GOLD       = '#e8c17f';
const GOLD_DARK  = '#c9973e';
const TOOLTIP_STYLE = {
    contentStyle: {
        background: '#1a1a1a',
        border: '1px solid rgba(232,193,127,0.2)',
        borderRadius: '4px',
        fontSize: '11px',
        fontFamily: 'sans-serif',
        color: '#e0d0b0',
    },
    cursor: { fill: 'rgba(232,193,127,0.06)' },
};

function CustomTooltipIngresos({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={TOOLTIP_STYLE.contentStyle} className="px-3 py-2">
            <p className="text-gold/70 mb-0.5">{label}</p>
            <p className="font-semibold text-gold">Bs {Number(payload[0].value).toFixed(2)}</p>
        </div>
    );
}

function CustomTooltipCitas({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={TOOLTIP_STYLE.contentStyle} className="px-3 py-2">
            <p className="text-gold/70 mb-0.5">{label}</p>
            <p className="font-semibold text-gold">{payload[0].value} citas</p>
        </div>
    );
}

function CustomTooltipServicios({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={TOOLTIP_STYLE.contentStyle} className="px-3 py-2">
            <p className="text-gold/70 mb-0.5">{label}</p>
            <p className="font-semibold text-gold">{payload[0].value} reservas</p>
        </div>
    );
}

export default function Dashboard({ stats, timeline, actividad, citasPorEstado, ingresosPorDia, citasPorDiaSemana, topServicios }) {
    const { auth } = usePage().props;
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    // Pie data
    const pieData = Object.entries(citasPorEstado ?? {}).map(([estado, total]) => ({
        name:  ESTADO_STYLE[estado]?.label ?? estado,
        value: total,
        color: ESTADO_STYLE[estado]?.color ?? GOLD,
    }));
    const totalCitasMes = pieData.reduce((a, d) => a + d.value, 0);

    const kpis = [
        { label: 'Citas Hoy',       value: stats.citasHoy,                                                    icon: 'event',      trend: null         },
        { label: 'Ingresos Semana', value: `Bs ${Number(stats.ingresosSemana ?? 0).toFixed(2)}`,              icon: 'payments',   trend: 'Completadas' },
        { label: 'Especialistas',   value: stats.empleadosActivos,                                             icon: 'groups',     trend: 'Activos'    },
        { label: 'Clientes Nuevos', value: stats.clientesNuevos,                                               icon: 'person_add', trend: 'Este mes'   },
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

            {/* Fila 1: Ingresos 7 días + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

                {/* Ingresos últimos 7 días */}
                <div className="lg:col-span-2 kpi-card">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Ingresos</h3>
                            <p className="font-sans text-[10px] text-gold/50 uppercase tracking-widest mt-0.5">Últimos 7 días · citas completadas</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={ingresosPorDia} barSize={28}>
                            <CartesianGrid vertical={false} stroke="rgba(232,193,127,0.07)" />
                            <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9a8060', fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#9a8060', fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} tickFormatter={v => `Bs${v}`} width={52} />
                            <Tooltip content={<CustomTooltipIngresos />} cursor={TOOLTIP_STYLE.cursor} />
                            <Bar dataKey="ingresos" radius={[3, 3, 0, 0]}
                                 fill="url(#goldGrad)" />
                            <defs>
                                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.9} />
                                    <stop offset="100%" stopColor={GOLD_DARK} stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Timeline hoy */}
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

            {/* Fila 2: Pie estados + Días semana + Top servicios */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-5">

                {/* Donut — citas por estado (mes actual) */}
                <div className="kpi-card flex flex-col">
                    <div className="mb-4">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Estados</h3>
                        <p className="font-sans text-[10px] text-gold/50 uppercase tracking-widest mt-0.5">
                            {totalCitasMes} citas este mes
                        </p>
                    </div>
                    {pieData.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">Sin datos aún</p>
                        </div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                                         paddingAngle={3} dataKey="value" stroke="none">
                                        {pieData.map((d, i) => (
                                            <Cell key={i} fill={d.color} fillOpacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={TOOLTIP_STYLE.contentStyle}
                                        formatter={(val, name) => [`${val} citas`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                {pieData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                                        <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim truncate">{d.name}</span>
                                        <span className="font-sans text-[10px] text-spa-on-light dark:text-spa-on-dark ml-auto">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Barras — citas por día de semana */}
                <div className="kpi-card">
                    <div className="mb-6">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Por día</h3>
                        <p className="font-sans text-[10px] text-gold/50 uppercase tracking-widest mt-0.5">Días más concurridos</p>
                    </div>
                    {citasPorDiaSemana.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">Sin datos aún</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={citasPorDiaSemana} barSize={22}>
                                <CartesianGrid vertical={false} stroke="rgba(232,193,127,0.07)" />
                                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9a8060', fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#9a8060', fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
                                <Tooltip content={<CustomTooltipCitas />} cursor={TOOLTIP_STYLE.cursor} />
                                <Bar dataKey="citas" fill={GOLD} fillOpacity={0.75} radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Barras horizontales — top 5 servicios */}
                <div className="kpi-card">
                    <div className="mb-6">
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Top Servicios</h3>
                        <p className="font-sans text-[10px] text-gold/50 uppercase tracking-widest mt-0.5">Más solicitados</p>
                    </div>
                    {topServicios.length === 0 ? (
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">Sin datos aún</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={topServicios} layout="vertical" barSize={16}>
                                <CartesianGrid horizontal={false} stroke="rgba(232,193,127,0.07)" />
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#9a8060', fontFamily: 'sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="nombre" width={90}
                                       tick={{ fontSize: 9, fill: '#9a8060', fontFamily: 'sans-serif' }}
                                       axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltipServicios />} cursor={TOOLTIP_STYLE.cursor} />
                                <Bar dataKey="total" fill="url(#goldGrad2)" radius={[0, 3, 3, 0]}>
                                    <defs>
                                        <linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={GOLD_DARK} stopOpacity={0.6} />
                                            <stop offset="100%" stopColor={GOLD} stopOpacity={0.9} />
                                        </linearGradient>
                                    </defs>
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Actividad reciente */}
            <div className="kpi-card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Actividad Reciente</h3>
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
