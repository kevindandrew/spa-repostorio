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
    PENDIENTE:   { label: 'Pendiente',  color: 'bg-amber-400/15 text-amber-300',  dot: 'bg-amber-400'  },
    EN_PROCESO:  { label: 'En proceso', color: 'bg-blue-400/15 text-blue-300',    dot: 'bg-blue-400'   },
    COMPLETADA:  { label: 'Completada', color: 'bg-green-400/15 text-green-300',  dot: 'bg-green-400'  },
    CANCELADA:   { label: 'Cancelada',  color: 'bg-red-400/15 text-red-300',      dot: 'bg-red-400'    },
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

const inputCls = "w-full bg-spa-bg border border-gold/20 rounded-sm px-2.5 py-2 font-sans text-sm text-spa-on-dark placeholder:text-spa-on-dark-dim/40 focus:border-gold/50 focus:outline-none transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

// ─────────────────────────────────────────────
// Modal principal de gestión
// ─────────────────────────────────────────────
function GestionarModal({ solicitud, empleados, onClose }) {
    const [tab, setTab] = useState(
        solicitud.estado === 'CANCELADA' || solicitud.estado === 'COMPLETADA' ? 'estado' : 'asignar'
    );
    const [estado, setEstado] = useState(solicitud.estado);
    const [savingEstado, setSavingEstado] = useState(false);
    const [savingCitas, setSavingCitas] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Una fila de asignación por servicio
    const [asignaciones, setAsignaciones] = useState(
        solicitud.servicios_detalle.map(s => ({
            servicio_id:  s.id,
            nombre:       s.nombre,
            categoria_id: s.categoria_id,
            duracion:     s.duracion,
            empleado_id:  '',
            fecha:        '',
            hora:         '',
        }))
    );

    function setAsig(index, field, value) {
        setAsignaciones(prev => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
        // Limpiar error de ese campo
        setFieldErrors(prev => {
            const next = { ...prev };
            delete next[`asignaciones.${index}.${field}`];
            return next;
        });
    }

    // Empleados válidos para un servicio (misma categoría o sin restricción)
    function empleadosParaServicio(categoria_id) {
        if (!categoria_id) return empleados;
        return empleados.filter(e => !e.categoria_id || e.categoria_id === categoria_id);
    }

    const puedeAsignar = solicitud.estado === 'PENDIENTE' || solicitud.estado === 'EN_PROCESO';
    const todasAsignadas = asignaciones.every(a => a.empleado_id && a.fecha && a.hora);

    function guardarEstado() {
        setSavingEstado(true);
        router.patch(route('admin.solicitudes.update', solicitud.id), { estado }, {
            onFinish: () => { setSavingEstado(false); onClose(); },
        });
    }

    function guardarCitas(e) {
        e.preventDefault();
        setSavingCitas(true);
        setFieldErrors({});
        router.post(
            route('admin.solicitudes.asignar', solicitud.id),
            { asignaciones: asignaciones.map(({ servicio_id, empleado_id, fecha, hora }) =>
                ({ servicio_id, empleado_id, fecha, hora })) },
            {
                onError: (errors) => { setFieldErrors(errors); setSavingCitas(false); },
                onSuccess: () => { setSavingCitas(false); onClose(); },
            }
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="relative w-full max-w-2xl bg-spa-surface rounded-sm border border-gold/20
                            shadow-[0_24px_80px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh]">

                {/* Header fijo */}
                <div className="px-6 pt-5 pb-0 border-b border-gold/10 shrink-0">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold/50 mb-0.5">
                                Gestionar solicitud · <span className="text-spa-on-dark-dim">{solicitud.cliente}</span>
                            </p>
                            <h3 className="font-serif text-xl text-spa-on-dark">{solicitud.paquete}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="font-serif text-lg gold-gradient-text">Bs {solicitud.precio.toFixed(2)}</span>
                                <EstadoBadge estado={solicitud.estado} />
                            </div>
                        </div>
                        <button onClick={onClose} className="text-spa-on-dark-dim hover:text-gold transition-colors mt-1">
                            <Icon name="close" className="text-[20px]" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1">
                        {puedeAsignar && (
                            <button onClick={() => setTab('asignar')}
                                    className={`px-4 py-2 font-sans text-[10px] uppercase tracking-widest transition-all border-b-2
                                        ${tab === 'asignar'
                                            ? 'border-gold text-gold'
                                            : 'border-transparent text-spa-on-dark-dim hover:text-spa-on-dark'}`}>
                                <Icon name="event_available" className="text-[14px] mr-1.5 align-middle" />
                                Asignar citas
                            </button>
                        )}
                        <button onClick={() => setTab('estado')}
                                className={`px-4 py-2 font-sans text-[10px] uppercase tracking-widest transition-all border-b-2
                                    ${tab === 'estado'
                                        ? 'border-gold text-gold'
                                        : 'border-transparent text-spa-on-dark-dim hover:text-spa-on-dark'}`}>
                            <Icon name="swap_horiz" className="text-[14px] mr-1.5 align-middle" />
                            Estado
                        </button>
                        <button onClick={() => setTab('info')}
                                className={`px-4 py-2 font-sans text-[10px] uppercase tracking-widest transition-all border-b-2
                                    ${tab === 'info'
                                        ? 'border-gold text-gold'
                                        : 'border-transparent text-spa-on-dark-dim hover:text-spa-on-dark'}`}>
                            <Icon name="info" className="text-[14px] mr-1.5 align-middle" />
                            Detalles
                        </button>
                    </div>
                </div>

                {/* Contenido scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {/* ── TAB: Asignar citas ── */}
                    {tab === 'asignar' && puedeAsignar && (
                        <form onSubmit={guardarCitas} className="space-y-4">
                            <p className="font-sans text-xs text-spa-on-dark-dim mb-4">
                                Asigna un especialista, fecha y hora para cada servicio del paquete.
                                Se crearán las citas automáticamente y la solicitud pasará a <strong className="text-blue-300">En proceso</strong>.
                            </p>

                            {asignaciones.map((asig, i) => {
                                const empsFiltrados = empleadosParaServicio(asig.categoria_id);
                                const errEmpleado = fieldErrors[`asignaciones.${i}.empleado_id`];
                                const errFecha    = fieldErrors[`asignaciones.${i}.fecha`];
                                const errHora     = fieldErrors[`asignaciones.${i}.hora`];

                                return (
                                    <div key={asig.servicio_id}
                                         className="bg-spa-surface-low border border-gold/10 rounded-sm p-4 space-y-3">
                                        {/* Servicio nombre */}
                                        <div className="flex items-center gap-2">
                                            <Icon name="spa" className="text-gold/50 text-[15px]" />
                                            <span className="font-sans text-sm font-medium text-spa-on-dark">
                                                {asig.nombre}
                                            </span>
                                            <span className="ml-auto font-sans text-[10px] text-spa-on-dark-dim">
                                                {asig.duracion} min
                                            </span>
                                        </div>

                                        {/* Fila: especialista + fecha + hora */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {/* Especialista */}
                                            <div className="sm:col-span-1">
                                                <label className="block font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-1">
                                                    Especialista
                                                </label>
                                                <select
                                                    value={asig.empleado_id}
                                                    onChange={e => setAsig(i, 'empleado_id', e.target.value)}
                                                    className={selectCls}>
                                                    <option value="">Seleccionar…</option>
                                                    {empsFiltrados.map(e => (
                                                        <option key={e.id} value={e.id}>{e.nombre}</option>
                                                    ))}
                                                </select>
                                                {empsFiltrados.length === 0 && (
                                                    <p className="mt-1 font-sans text-[10px] text-amber-400">
                                                        No hay especialistas para esta categoría.
                                                    </p>
                                                )}
                                                {errEmpleado && (
                                                    <p className="mt-1 font-sans text-[10px] text-red-400">{errEmpleado}</p>
                                                )}
                                            </div>

                                            {/* Fecha */}
                                            <div>
                                                <label className="block font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-1">
                                                    Fecha
                                                </label>
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={asig.fecha}
                                                    onChange={e => setAsig(i, 'fecha', e.target.value)}
                                                    className={inputCls} />
                                                {errFecha && (
                                                    <p className="mt-1 font-sans text-[10px] text-red-400">{errFecha}</p>
                                                )}
                                            </div>

                                            {/* Hora */}
                                            <div>
                                                <label className="block font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-1">
                                                    Hora inicio
                                                </label>
                                                <input
                                                    type="time"
                                                    value={asig.hora}
                                                    onChange={e => setAsig(i, 'hora', e.target.value)}
                                                    className={inputCls} />
                                                {errHora && (
                                                    <p className="mt-1 font-sans text-[10px] text-red-400">{errHora}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hora fin estimada */}
                                        {asig.hora && (
                                            <p className="font-sans text-[10px] text-spa-on-dark-dim/60">
                                                Finaliza aprox. a las{' '}
                                                <span className="text-gold/70">
                                                    {(() => {
                                                        const [h, m] = asig.hora.split(':').map(Number);
                                                        const total = h * 60 + m + asig.duracion;
                                                        return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
                                                    })()}
                                                </span>
                                                {' '}(+15 min descanso)
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose}
                                        className="flex-1 py-2.5 rounded-sm border border-gold/20
                                                   font-sans text-[10px] uppercase tracking-widest text-spa-on-dark-dim
                                                   hover:border-gold/40 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit"
                                        disabled={savingCitas || !todasAsignadas}
                                        className="flex-1 gold-gradient shimmer-btn py-2.5 rounded-sm
                                                   font-sans text-[10px] uppercase tracking-widest font-semibold
                                                   text-gold-text disabled:opacity-40 transition-all">
                                    {savingCitas ? 'Creando citas…' : 'Confirmar y crear citas'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── TAB: Estado ── */}
                    {tab === 'estado' && (
                        <div className="space-y-5">
                            <p className="font-sans text-xs text-spa-on-dark-dim">
                                Cambia el estado general de la solicitud.
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {ESTADOS.filter(Boolean).map(e => (
                                    <button key={e} onClick={() => setEstado(e)}
                                            className={`py-3 px-3 rounded-sm border font-sans text-[10px] uppercase tracking-wider transition-all
                                                ${estado === e
                                                    ? 'border-gold bg-gold/10 text-gold'
                                                    : 'border-gold/15 text-spa-on-dark-dim hover:border-gold/30'}`}>
                                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${ESTADO_CFG[e]?.dot}`} />
                                        {ESTADO_CFG[e]?.label ?? e}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose}
                                        className="flex-1 py-2.5 rounded-sm border border-gold/20
                                                   font-sans text-[10px] uppercase tracking-widest text-spa-on-dark-dim
                                                   hover:border-gold/40 transition-all">
                                    Cancelar
                                </button>
                                <button onClick={guardarEstado}
                                        disabled={savingEstado || estado === solicitud.estado}
                                        className="flex-1 gold-gradient shimmer-btn py-2.5 rounded-sm
                                                   font-sans text-[10px] uppercase tracking-widest font-semibold
                                                   text-gold-text disabled:opacity-40 transition-all">
                                    {savingEstado ? 'Guardando…' : 'Guardar estado'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: Detalles ── */}
                    {tab === 'info' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Cliente</p>
                                    <p className="font-sans text-sm text-spa-on-dark">{solicitud.cliente}</p>
                                </div>
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Precio del paquete</p>
                                    <p className="font-serif text-lg gold-gradient-text">Bs {solicitud.precio.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Fecha solicitud</p>
                                    <p className="font-sans text-sm text-spa-on-dark">{solicitud.creado}</p>
                                </div>
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Estado</p>
                                    <EstadoBadge estado={solicitud.estado} />
                                </div>
                            </div>

                            <div>
                                <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-2">Servicios incluidos</p>
                                <div className="space-y-2">
                                    {solicitud.servicios_detalle.map(s => (
                                        <div key={s.id}
                                             className="flex items-center justify-between p-2.5 bg-spa-surface-low border border-gold/10 rounded-sm">
                                            <div className="flex items-center gap-2">
                                                <Icon name="spa" className="text-gold/40 text-[14px]" />
                                                <span className="font-sans text-sm text-spa-on-dark">{s.nombre}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-spa-on-dark-dim">
                                                <span className="font-sans text-xs">{s.duracion} min</span>
                                                <span className="font-serif text-sm text-gold/70">Bs {s.precio.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {solicitud.notas && (
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-1">Notas del cliente</p>
                                    <p className="font-sans text-sm text-spa-on-dark-dim bg-spa-surface-low rounded-sm px-3 py-2.5 border border-gold/10 leading-relaxed">
                                        {solicitud.notas}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function SolicitudesPaquetes({ solicitudes, estado_filtro, pendientes, empleados }) {
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
                <GestionarModal
                    solicitud={gestionando}
                    empleados={empleados}
                    onClose={() => setGestionando(null)}
                />
            )}

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/50 mb-1">Gestión</p>
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

            {/* Filtros */}
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

            {/* Tabla */}
            {solicitudes.length === 0 ? (
                <div className="kpi-card flex flex-col items-center justify-center py-16 text-center">
                    <Icon name="inbox" className="text-gold/15 text-[64px] mb-4" />
                    <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">Sin solicitudes</p>
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
                                                <span className="font-sans text-[9px] text-gold/40">+{s.servicios.length - 3}</span>
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
                                            {s.estado === 'PENDIENTE' && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-0.5" />
                                            )}
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
