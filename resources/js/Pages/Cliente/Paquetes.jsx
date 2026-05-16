import { Head } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

function UrgencyBar({ dias }) {
    if (dias > 14) return null;
    const color = dias <= 3 ? 'text-red-400' : dias <= 7 ? 'text-amber-400' : 'text-blue-400';
    const label = dias === 0 ? '¡Último día!'
                : dias === 1 ? '¡Termina mañana!'
                : `Quedan ${dias} días`;
    return (
        <div className={`flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest ${color} mb-3`}>
            <Icon name="timer" className="text-[14px]" />
            {label}
        </div>
    );
}

export default function Paquetes({ paquetes }) {
    return (
        <ClienteLayout>
            <Head title="Paquetes — Spa" />

            {/* Header */}
            <div className="mb-8">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-spa-on-light-dim dark:text-gold/50 mb-1">
                    Ofertas exclusivas
                </p>
                <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                    Paquetes & <span className="text-gold-mid dark:text-gold italic">Promociones</span>
                </h2>
                <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mt-2 max-w-lg">
                    Disfruta más por menos. Estos paquetes combinan nuestros servicios más populares a un precio especial, disponibles por tiempo limitado.
                </p>
            </div>

            {paquetes.length === 0 ? (
                <div className="kpi-card flex flex-col items-center justify-center py-20 text-center">
                    <Icon name="local_offer" className="text-gold/15 text-[64px] mb-4" />
                    <p className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-2">
                        Sin promociones activas
                    </p>
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim max-w-xs">
                        Por el momento no hay paquetes disponibles. Vuelve pronto para ver nuestras próximas ofertas.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paquetes.map(p => (
                        <div key={p.id}
                             className="kpi-card relative overflow-hidden group hover:border-gold/30 transition-all duration-300">

                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.04] pointer-events-none"
                                 style={{ background: 'radial-gradient(circle, #e8c17f 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

                            {/* Urgency */}
                            <UrgencyBar dias={p.dias_restantes} />

                            {/* Name + price */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark leading-tight">
                                        {p.nombre}
                                    </h3>
                                    {p.descripcion && (
                                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1 leading-relaxed">
                                            {p.descripcion}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    {p.ahorro > 0 && (
                                        <p className="font-sans text-[10px] line-through text-spa-on-light-dim dark:text-spa-on-dark-dim/50">
                                            ${p.precio_original.toFixed(2)}
                                        </p>
                                    )}
                                    <p className="font-serif text-3xl gold-gradient-text leading-none">
                                        ${p.precio.toFixed(2)}
                                    </p>
                                    {p.ahorro > 0 && (
                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full font-sans text-[9px] uppercase tracking-wider">
                                            <Icon name="savings" className="text-[11px]" />
                                            Ahorras ${p.ahorro.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-px flex-1 bg-gold/10" />
                                <span className="text-gold/30 text-[10px]">✦</span>
                                <span className="h-px flex-1 bg-gold/10" />
                            </div>

                            {/* Services included */}
                            <div className="mb-4">
                                <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-gold/40 mb-2">
                                    Incluye
                                </p>
                                <div className="space-y-1.5">
                                    {p.servicios.map(s => (
                                        <div key={s.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon name="spa" className="text-gold/40 text-[14px]" />
                                                <span className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark">{s.nombre}</span>
                                            </div>
                                            <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                ${s.precio.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
                                <div className="flex items-center gap-1.5 text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                    <Icon name="event" className="text-[14px]" />
                                    <span className="font-sans text-[10px]">Válido hasta {p.fecha_fin}</span>
                                </div>
                                <a href={route('cliente.reservar.index')}
                                   className="flex items-center gap-1.5 gold-gradient px-4 py-2 rounded-sm
                                              font-sans text-[10px] uppercase tracking-widest font-semibold
                                              text-gold-text hover:brightness-110 transition-all">
                                    <Icon name="add_circle" className="text-[14px]" />
                                    Reservar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ClienteLayout>
    );
}
