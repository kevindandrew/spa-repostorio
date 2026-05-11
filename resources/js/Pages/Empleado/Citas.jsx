import { Head, useForm, router } from '@inertiajs/react';
import EmpleadoLayout from '@/Layouts/EmpleadoLayout';
import { useState, useEffect } from 'react';

/* ── helpers ── */
function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const MESES     = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const ESTADO = {
    PENDIENTE:  { label: 'Pendiente',  text: 'text-amber-400',  bg: 'bg-amber-400/10',  dot: 'bg-amber-400'  },
    CONFIRMADA: { label: 'Confirmada', text: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: 'bg-blue-400'   },
    COMPLETADA: { label: 'Completada', text: 'text-green-400',  bg: 'bg-green-400/10',  dot: 'bg-green-400'  },
    CANCELADA:  { label: 'Cancelada',  text: 'text-red-400',    bg: 'bg-red-400/10',    dot: 'bg-red-400'    },
    NO_ASISTIO: { label: 'No asistió', text: 'text-gray-400',   bg: 'bg-gray-400/10',   dot: 'bg-gray-500'   },
};

function toDateStr(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function buildCalendar(year, month) {
    const firstDay    = new Date(year, month - 1, 1);
    const startDow    = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells       = [];
    for (let i = startDow; i > 0; i--)
        cells.push({ date: new Date(year, month - 1, 1 - i), current: false });
    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ date: new Date(year, month - 1, d), current: true });
    let nd = 1;
    while (cells.length < 42)
        cells.push({ date: new Date(year, month, nd++), current: false });
    return cells;
}

/* ── Modal notas ── */
function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-spa-surface border border-gold/20 rounded-lg
                            shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
                    <h2 className="font-serif text-lg text-gold">{title}</h2>
                    <button onClick={onClose} className="text-spa-on-dark-dim hover:text-gold transition-colors">
                        <Icon name="close" className="text-[20px]" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

const inputCls = "w-full bg-spa-bg border border-gold/20 rounded-sm px-3 py-2.5 font-sans text-sm text-spa-on-dark placeholder:text-spa-on-dark-dim/40 focus:border-gold/60 focus:outline-none transition-colors";

/* ── Page ── */
export default function Citas({ citas, year, month }) {
    const todayStr = toDateStr(new Date());
    const nowYear  = new Date().getFullYear();
    const nowMonth = new Date().getMonth() + 1;

    const [selectedDate, setSelectedDate] = useState(() =>
        year === nowYear && month === nowMonth ? todayStr
            : `${year}-${String(month).padStart(2,'0')}-01`
    );
    const [notasTarget, setNotasTarget] = useState(null);

    useEffect(() => {
        setSelectedDate(
            year === nowYear && month === nowMonth ? todayStr
                : `${year}-${String(month).padStart(2,'0')}-01`
        );
    }, [year, month]);

    const citasByDate = {};
    citas.forEach(c => { citasByDate[c.fecha] ??= []; citasByDate[c.fecha].push(c); });

    const cells         = buildCalendar(year, month);
    const selectedCitas = (citasByDate[selectedDate] ?? []).sort((a,b) => a.hora.localeCompare(b.hora));
    const selDateLabel  = new Date(selectedDate + 'T12:00:00')
        .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    /* stats */
    const totalMes    = citas.length;
    const pendientes  = citas.filter(c => c.estado === 'PENDIENTE').length;
    const completadas = citas.filter(c => c.estado === 'COMPLETADA').length;

    function goMonth(delta) {
        let y = year, m = month + delta;
        if (m < 1)  { m = 12; y--; }
        if (m > 12) { m = 1;  y++; }
        router.get(route('empleado.citas.index'), { year: y, month: m });
    }

    function cambiarEstado(citaId, estado) {
        router.patch(route('empleado.citas.update', citaId), { estado });
    }

    /* notas form */
    const notasForm = useForm({ notas_empleado: '' });

    function openNotas(cita) {
        setNotasTarget(cita);
        notasForm.setData('notas_empleado', cita.notas_empleado ?? '');
    }

    function submitNotas(e) {
        e.preventDefault();
        notasForm.patch(route('empleado.citas.update', notasTarget.id), {
            onSuccess: () => setNotasTarget(null),
        });
    }

    return (
        <EmpleadoLayout title="Mis Citas">
            <Head title="Mis Citas — Especialista" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Mis Citas</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            {totalMes} este mes
                        </span>
                        <span className="text-gold/20">·</span>
                        <span className="font-sans text-[10px] text-amber-400">{pendientes} pendientes</span>
                        <span className="text-gold/20">·</span>
                        <span className="font-sans text-[10px] text-green-400">{completadas} completadas</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

                {/* ── Calendario ── */}
                <div className="xl:col-span-3 kpi-card">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => goMonth(-1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20
                                           text-gold/60 hover:text-gold hover:border-gold/50 transition-all">
                            <Icon name="chevron_left" className="text-[20px]" />
                        </button>
                        <div className="text-center">
                            <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                                {MESES[month - 1]}
                            </h3>
                            <p className="font-sans text-[10px] text-gold/50 tracking-widest mt-0.5">{year}</p>
                        </div>
                        <button onClick={() => goMonth(1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20
                                           text-gold/60 hover:text-gold hover:border-gold/50 transition-all">
                            <Icon name="chevron_right" className="text-[20px]" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                        {DIAS_SEMANA.map(d => (
                            <div key={d} className="text-center font-sans text-[9px] uppercase tracking-widest
                                                    text-spa-on-light-dim dark:text-gold/30 py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {cells.map(({ date, current }, i) => {
                            const ds        = toDateStr(date);
                            const dayCitas  = citasByDate[ds] ?? [];
                            const isToday   = ds === todayStr;
                            const isSelected= ds === selectedDate;
                            return (
                                <button key={i} onClick={() => setSelectedDate(ds)}
                                        className={`relative flex flex-col items-center pt-2 pb-1.5 px-1 rounded-md
                                                    min-h-[56px] transition-all duration-150
                                                    ${!current ? 'opacity-25' : ''}
                                                    ${isSelected ? 'bg-gold/15 ring-1 ring-gold/50'
                                                      : isToday  ? 'ring-1 ring-gold/30 bg-gold/5'
                                                      : 'hover:bg-gold/5'}`}>
                                    <span className={`font-sans text-sm leading-none mb-1.5
                                                      ${isSelected ? 'text-gold font-semibold'
                                                        : isToday  ? 'text-gold'
                                                        : 'text-spa-on-light dark:text-spa-on-dark'}`}>
                                        {date.getDate()}
                                    </span>
                                    {isToday && !isSelected && (
                                        <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gold" />
                                    )}
                                    {dayCitas.length > 0 && (
                                        <div className="flex items-center gap-0.5 flex-wrap justify-center">
                                            {dayCitas.slice(0, 4).map((c, j) => (
                                                <span key={j} className={`w-1.5 h-1.5 rounded-full ${ESTADO[c.estado]?.dot ?? 'bg-gold/40'}`} />
                                            ))}
                                            {dayCitas.length > 4 && (
                                                <span className="font-sans text-[8px] text-gold/50">+{dayCitas.length-4}</span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gold/10 flex flex-wrap gap-x-4 gap-y-2">
                        {Object.entries(ESTADO).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${v.dot}`} />
                                <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">{v.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Panel del día ── */}
                <div className="xl:col-span-2 kpi-card flex flex-col">
                    <div className="flex items-start justify-between mb-5 pb-4 border-b border-gold/10">
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-0.5">
                                {selectedCitas.length === 0 ? 'Sin citas' : `${selectedCitas.length} cita${selectedCitas.length > 1 ? 's' : ''}`}
                            </p>
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark capitalize leading-tight">
                                {selDateLabel}
                            </h3>
                        </div>
                    </div>

                    {selectedCitas.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                            <Icon name="event_available" className="text-gold/15 text-[52px] mb-3" />
                            <p className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark">Día libre</p>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                No tienes citas programadas para este día.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto flex-1">
                            {selectedCitas.map(cita => {
                                const s = ESTADO[cita.estado] ?? ESTADO.PENDIENTE;
                                return (
                                    <div key={cita.id}
                                         className="p-4 rounded-md border border-gold/10 bg-white/[0.02] hover:border-gold/25 transition-all">
                                        {/* Hora + estado */}
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-8 rounded-full ${s.dot}`} />
                                                <div>
                                                    <p className="font-serif text-base gold-gradient-text leading-none">{cita.hora}</p>
                                                    <p className="font-sans text-[9px] text-spa-on-dark-dim mt-0.5">
                                                        {cita.hora_fin} · {cita.duracion} min
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-sm font-sans text-[8px] uppercase tracking-wider ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                        </div>

                                        {/* Cliente + servicio */}
                                        <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">
                                            {cita.cliente}
                                        </p>
                                        <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                            {cita.servicio}
                                        </p>

                                        {/* Notas del cliente */}
                                        {cita.notas_cliente && (
                                            <div className="mt-2 px-2.5 py-2 bg-gold/5 rounded-sm border-l-2 border-gold/30">
                                                <p className="font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-0.5">
                                                    Notas del cliente
                                                </p>
                                                <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                    "{cita.notas_cliente}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Mis notas */}
                                        {cita.notas_empleado && (
                                            <div className="mt-2 px-2.5 py-2 bg-blue-400/5 rounded-sm border-l-2 border-blue-400/30">
                                                <p className="font-sans text-[9px] uppercase tracking-widest text-blue-400/60 mb-0.5">
                                                    Mis notas
                                                </p>
                                                <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                    {cita.notas_empleado}
                                                </p>
                                            </div>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gold/10 flex-wrap">
                                            {cita.estado === 'PENDIENTE' && (
                                                <button onClick={() => cambiarEstado(cita.id, 'CONFIRMADA')}
                                                        className="flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                                                    <Icon name="check_circle" className="text-[13px]" />
                                                    Confirmar
                                                </button>
                                            )}
                                            {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
                                                <>
                                                    <button onClick={() => cambiarEstado(cita.id, 'COMPLETADA')}
                                                            className="flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">
                                                        <Icon name="task_alt" className="text-[13px]" />
                                                        Completar
                                                    </button>
                                                    <button onClick={() => cambiarEstado(cita.id, 'NO_ASISTIO')}
                                                            className="flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-300 transition-colors">
                                                        <Icon name="person_off" className="text-[13px]" />
                                                        No asistió
                                                    </button>
                                                </>
                                            )}
                                            <div className="flex-1" />
                                            <button onClick={() => openNotas(cita)}
                                                    className="p-1.5 text-spa-on-dark-dim hover:text-gold transition-colors rounded-sm hover:bg-gold/10"
                                                    title="Mis notas">
                                                <Icon name="edit_note" className="text-[16px]" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal notas */}
            <Modal open={!!notasTarget} onClose={() => setNotasTarget(null)} title="Mis Notas">
                {notasTarget && (
                    <form onSubmit={submitNotas} className="space-y-4">
                        <div className="p-3 bg-gold/5 rounded-sm border border-gold/10">
                            <p className="font-sans text-sm font-medium text-spa-on-dark">{notasTarget.cliente}</p>
                            <p className="font-sans text-xs italic text-spa-on-dark-dim mt-0.5">
                                {notasTarget.servicio} · {notasTarget.fecha} {notasTarget.hora}
                            </p>
                        </div>
                        <div>
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">
                                Notas internas
                            </label>
                            <textarea value={notasForm.data.notas_empleado} rows={4}
                                      onChange={e => notasForm.setData('notas_empleado', e.target.value)}
                                      className={inputCls}
                                      placeholder="Observaciones, productos usados, preferencias del cliente..." />
                            {notasForm.errors.notas_empleado && (
                                <p className="mt-1 font-sans text-[11px] text-red-400">{notasForm.errors.notas_empleado}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setNotasTarget(null)}
                                    className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                                Cancelar
                            </button>
                            <button type="submit" disabled={notasForm.processing}
                                    className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                                {notasForm.processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </EmpleadoLayout>
    );
}
