import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const ESTADOS = ['', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA'];

const ESTADO_CFG = {
    PENDIENTE:   { label: 'Pendiente',   color: 'bg-amber-400/15 text-amber-300',   dot: 'bg-amber-400'  },
    EN_PROCESO:  { label: 'En proceso',  color: 'bg-blue-400/15 text-blue-300',     dot: 'bg-blue-400'   },
    COMPLETADA:  { label: 'Completada',  color: 'bg-green-400/15 text-green-300',   dot: 'bg-green-400'  },
    CANCELADA:   { label: 'Cancelada',   color: 'bg-red-400/15 text-red-300',       dot: 'bg-red-400'    },
};

function EstadoBadge({ estado }) {
    const cfg = ESTADO_CFG[estado] ?? { label: estado, color: 'bg-white/5 text-white/50', dot: 'bg-white/30' };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-sans text-[10px] uppercase tracking-wider ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

function GestionarModal({ solicitud, onClose }) {
    const [estado, setEstado] = useState(solicitud.estado);
    const [saving, setSaving] = useState(false);

    function save() {
        setSaving(true);
        router.patch(route('admin.solicitudes.update', solicitud.id), { estado }, {
            onFinish: () => { setSaving(false); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="relative w-full max-w-lg bg-spa-surface rounded-sm border border-gold/20
                            shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                <div className="px-6 pt-5 pb-4 border-b border-gold/10 flex items-center justify-between">
                    <div>
                        <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-0.5">
                            Gestionar solicitud
                        </p>
                        <h3 className="font-serif text-xl text-spa-on-dark">{solicitud.paquete}</h3>
                    </div>
                    <button onClick={onClose} className="text-spa-on-dark-dim hover:text-gold transition-colors">
                        <Icon name="close" className="text-[20px]" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Client & package info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Cliente</p>
                            <p className="font-sans text-spa-on-dark">{solicitud.cliente}</p>
                        </div>
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Precio</p>
                            <p className="font-serif text-gold">Bs {solicitud.precio.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Services in package */}
                    <div>
                        <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-2">Servicios incluidos</p>
                        <div className="space-y-1">
                            {solicitud.servicios.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Icon name="spa" className="text-gold/30 text-[13px]" />
                                    <span className="font-sans text-sm text-spa-on-dark-dim">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {solicitud.notas && (
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Notas del cliente</p>
                            <p className="font-sans text-sm text-spa-on-dark-dim bg-spa-surface-low rounded-sm px-3 py-2 border border-gold/10">
                                {solicitud.notas}
                            </p>
                        </div>
                    )}

                    <div className="h-px bg-gold/10" />

                    {/* State selector */}
                    <div>
                        <p className="font-sans text-[9px] uppercase tracking-widest text-gold/60 mb-2">Cambiar estado</p>
                        <div className="grid grid-cols-2 gap-2">
                            {ESTADOS.filter(Boolean).map(e => (
                                <button key={e} onClick={() => setEstado(e)}
                                        className={`py-2 px-3 rounded-sm border font-sans text-[10px] uppercase tracking-wider transition-all
                                            ${estado === e
                                                ? 'border-gold bg-gold/10 text-gold'
                                                : 'border-gold/15 text-spa-on-dark-dim hover:border-gold/30'}`}>
                                    {ESTADO_CFG[e]?.label ?? e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose}
                                className="flex-1 py-2.5 rounded-sm border border-gold/20
                                           font-sans text-[10px] uppercase tracking-widest text-spa-on-dark-dim
                                           hover:border-gold/40 transition-all">
                            Cancelar
                        </button>
                        <button onClick={save} disabled={saving || estado === solicitud.estado}
                                className="flex-1 gold-gradient shimmer-btn py-2.5 rounded-sm
                                           font-sans text-[10px] uppercase tracking-widest font-semibold
                                           text-gold-text disabled:opacity-50 transition-all">
                            {saving ? 'Guardando…' : 'Guardar cambio'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SolicitudesPaquetes({ solicitudes, estado_filtro, pendientes }) {
    const [gestionando, setGestionando] = useState(null);
    const [filtro, setFiltro] = useState(estado_filtro ?? '');

    function applyFiltro(val) {
        setFiltro(val);
        router.get(route('admin.solicitudes.index'), { estado: val }, { preserveScroll: true });
    }

    return (
        <AdminLayout title="Solicitudes de Paquetes">
            <Head title="Solicitudes de Paquetes" />

            {gestionando && (
                <GestionarModal solicitud={gestionando} onClose={() => setGestionando(null)} />
            )}

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/50 mb-1">
                        Gestión
                    </p>
                    <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        Solicitudes de <span className="text-gold italic">Paquetes</span>
                    </h2>
                </div>
                {pendientes > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-amber-400/10 border border-amber-400/20 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-sans text-xs text-amber-300">
                            {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {ESTADOS.map(e => (
                    <button key={e} onClick={() => applyFiltro(e)}
                            className={`px-3 py-1.5 rounded-sm border font-sans text-[10px] uppercase tracking-wider transition-all
                                ${filtro === e
                                    ? 'border-gold bg-gold/10 text-gold'
                                    : 'border-gold/15 text-spa-on-dark-dim hover:border-gold/30'}`}>
                        {e === '' ? 'Todas' : (ESTADO_CFG[e]?.label ?? e)}
                    </button>
                ))}
            </div>

            {/* Table */}
            {solicitudes.length === 0 ? (
                <div className="kpi-card flex flex-col items-center justify-center py-16 text-center">
                    <Icon name="inbox" className="text-gold/15 text-[64px] mb-4" />
                    <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">
                        Sin solicitudes
                    </p>
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                        {filtro ? 'No hay solicitudes con ese estado.' : 'Aún no se ha enviado ninguna solicitud de paquete.'}
                    </p>
                </div>
            ) : (
                <div className="kpi-card p-0 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gold/10">
                                <th className="text-left px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Cliente</th>
                                <th className="text-left px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Paquete</th>
                                <th className="text-left px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Servicios</th>
                                <th className="text-right px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Precio</th>
                                <th className="text-center px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Estado</th>
                                <th className="text-left px-5 py-3 font-sans text-[9px] uppercase tracking-widest text-gold/50">Fecha</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((s, i) => (
                                <tr key={s.id}
                                    className={`border-b border-gold/5 hover:bg-gold/[0.03] transition-colors
                                                ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center
                                                            font-sans text-[11px] text-gold shrink-0">
                                                {s.cliente.charAt(0)}
                                            </div>
                                            <span className="font-sans text-sm text-spa-on-dark">{s.cliente}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-sans text-sm text-spa-on-dark">{s.paquete}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {s.servicios.slice(0, 3).map((sv, j) => (
                                                <span key={j} className="px-1.5 py-0.5 bg-gold/5 border border-gold/10 rounded-sm
                                                                          font-sans text-[9px] text-spa-on-dark-dim">
                                                    {sv}
                                                </span>
                                            ))}
                                            {s.servicios.length > 3 && (
                                                <span className="font-sans text-[9px] text-gold/40">
                                                    +{s.servicios.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <span className="font-serif text-sm text-gold">Bs {s.precio.toFixed(2)}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <EstadoBadge estado={s.estado} />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-sans text-xs text-spa-on-dark-dim">{s.creado}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button onClick={() => setGestionando(s)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-sm
                                                           border border-gold/20 font-sans text-[10px] uppercase tracking-wider
                                                           text-gold/70 hover:border-gold/50 hover:text-gold transition-all">
                                            <Icon name="edit" className="text-[13px]" />
                                            Gestionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
