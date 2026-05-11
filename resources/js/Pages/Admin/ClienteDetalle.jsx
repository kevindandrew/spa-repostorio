import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const ESTADO = {
    PENDIENTE:  { label: 'Pendiente',  text: 'text-amber-400',  bg: 'bg-amber-400/10'  },
    CONFIRMADA: { label: 'Confirmada', text: 'text-blue-400',   bg: 'bg-blue-400/10'   },
    COMPLETADA: { label: 'Completada', text: 'text-green-400',  bg: 'bg-green-400/10'  },
    CANCELADA:  { label: 'Cancelada',  text: 'text-red-400',    bg: 'bg-red-400/10'    },
    NO_ASISTIO: { label: 'No asistió', text: 'text-gray-400',   bg: 'bg-gray-400/10'   },
};

export default function ClienteDetalle({ cliente, historial }) {
    return (
        <AdminLayout title="Detalle de Cliente">
            <Head title={`${cliente.nombre} — Admin`} />

            {/* Back */}
            <Link href={route('admin.clientes.index')}
                  className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest
                             text-gold/60 hover:text-gold transition-colors mb-6">
                <Icon name="arrow_back" className="text-[16px]" />
                Volver a Clientes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Perfil */}
                <div className="kpi-card">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center
                                        font-serif text-3xl text-gold-text mb-4">
                            {cliente.nombre.charAt(0)}
                        </div>
                        <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                            {cliente.nombre}
                        </h2>
                        <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                            {cliente.correo}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Teléfono',      value: cliente.telefono,          icon: 'phone' },
                            { label: 'Nacimiento',    value: cliente.fecha_nacimiento,  icon: 'cake' },
                            { label: 'Preferencias', value: cliente.preferencias,      icon: 'favorite' },
                            { label: 'Alergias',     value: cliente.alergias,           icon: 'medical_information' },
                        ].map(({ label, value, icon }) => value ? (
                            <div key={label} className="flex items-start gap-3">
                                <Icon name={icon} className="text-gold/40 text-[16px] mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/50">{label}</p>
                                    <p className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark mt-0.5">{value}</p>
                                </div>
                            </div>
                        ) : null)}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 pt-5 border-t border-gold/10 grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="font-serif text-3xl gold-gradient-text">{cliente.total_citas}</p>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Total citas
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="font-serif text-3xl gold-gradient-text">{cliente.completadas}</p>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Completadas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Historial */}
                <div className="lg:col-span-2 kpi-card">
                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-6">
                        Historial de Citas
                    </h3>

                    {historial.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Icon name="event_busy" className="text-gold/20 text-[48px] mb-3" />
                            <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Sin historial</p>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                Este cliente aún no tiene citas registradas.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {historial.map((cita) => {
                                const s = ESTADO[cita.estado] ?? ESTADO.PENDIENTE;
                                return (
                                    <div key={cita.id}
                                         className="flex items-center gap-4 p-4 rounded-sm
                                                    bg-spa-border/20 dark:bg-white/[0.03]
                                                    border border-spa-border dark:border-gold/10
                                                    hover:border-gold/30 transition-all">
                                        <div className="text-center shrink-0 w-16">
                                            <p className="font-serif text-sm text-spa-on-light dark:text-spa-on-dark leading-tight">
                                                {cita.fecha.split('/').slice(0,2).join('/')}
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
                                            <span className={`px-2.5 py-1 rounded-sm font-sans text-[9px] uppercase tracking-wider ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                            {cita.precio && (
                                                <span className="font-serif text-sm gold-gradient-text">
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
            </div>
        </AdminLayout>
    );
}
