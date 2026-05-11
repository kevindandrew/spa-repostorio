import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

/* ── helpers ─────────────────────────────────────────── */
function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const ESTADO = {
    PENDIENTE:  { label: 'Pendiente',  text: 'text-amber-400',  bg: 'bg-amber-400/10',  dot: 'bg-amber-400',  ring: 'ring-amber-400/30'  },
    CONFIRMADA: { label: 'Confirmada', text: 'text-blue-400',   bg: 'bg-blue-400/10',   dot: 'bg-blue-400',   ring: 'ring-blue-400/30'   },
    COMPLETADA: { label: 'Completada', text: 'text-green-400',  bg: 'bg-green-400/10',  dot: 'bg-green-400',  ring: 'ring-green-400/30'  },
    CANCELADA:  { label: 'Cancelada',  text: 'text-red-400',    bg: 'bg-red-400/10',    dot: 'bg-red-400',    ring: 'ring-red-400/30'    },
    NO_ASISTIO: { label: 'No asistió', text: 'text-gray-400',   bg: 'bg-gray-400/10',   dot: 'bg-gray-500',   ring: 'ring-gray-400/30'   },
};

function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function buildCalendar(year, month) {
    // month: 1-indexed
    const firstDay    = new Date(year, month - 1, 1);
    const startDow    = (firstDay.getDay() + 6) % 7; // 0=Mon
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

/* ── Modal ───────────────────────────────────────────── */
function Modal({ open, onClose, title, children, wide = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} bg-spa-surface
                             border border-gold/20 rounded-lg
                             shadow-[0_24px_80px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto`}>
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

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 font-sans text-[11px] text-red-400">{error}</p>}
        </div>
    );
}

const inputCls  = "w-full bg-spa-bg border border-gold/20 rounded-sm px-3 py-2.5 font-sans text-sm text-spa-on-dark placeholder:text-spa-on-dark-dim/40 focus:border-gold/60 focus:outline-none transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

/* ── Page ────────────────────────────────────────────── */
export default function Citas({ citas, year, month, empleados, clientes, servicios }) {
    const todayStr     = toDateStr(new Date());
    const nowYear      = new Date().getFullYear();
    const nowMonth     = new Date().getMonth() + 1;

    const [selectedDate, setSelectedDate] = useState(() =>
        year === nowYear && month === nowMonth ? todayStr
            : `${year}-${String(month).padStart(2, '0')}-01`
    );
    const [createOpen, setCreateOpen]     = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Reset selection when month prop changes (Inertia navigate)
    useEffect(() => {
        setSelectedDate(
            year === nowYear && month === nowMonth ? todayStr
                : `${year}-${String(month).padStart(2, '0')}-01`
        );
    }, [year, month]);

    // Group by date
    const citasByDate = {};
    citas.forEach(c => {
        citasByDate[c.fecha] ??= [];
        citasByDate[c.fecha].push(c);
    });

    const cells         = buildCalendar(year, month);
    const selectedCitas = (citasByDate[selectedDate] ?? []).slice().sort((a, b) => a.hora.localeCompare(b.hora));

    // Formatted label for the panel header
    const selDateObj   = new Date(selectedDate + 'T12:00:00');
    const selDateLabel = selDateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    /* navigation */
    function goMonth(delta) {
        let y = year, m = month + delta;
        if (m < 1)  { m = 12; y--; }
        if (m > 12) { m = 1;  y++; }
        router.get(route('admin.citas.index'), { year: y, month: m });
    }

    /* forms */
    const form = useForm({
        cliente_id: '', empleado_id: '', servicio_id: '',
        fecha_hora_inicio: '', precio_cobrado: '', notas_cliente: '',
    });

    const editForm = useForm({ estado: '', notas_empleado: '', precio_cobrado: '' });

    // Auto-fill price when service changes
    useEffect(() => {
        if (form.data.servicio_id) {
            const s = servicios.find(s => s.id === form.data.servicio_id);
            if (s) form.setData('precio_cobrado', s.precio);
        }
    }, [form.data.servicio_id]);

    function openCreate() {
        form.reset();
        // Pre-fill with selected date at 09:00
        form.setData('fecha_hora_inicio', `${selectedDate}T09:00`);
        setCreateOpen(true);
    }

    function openEdit(cita) {
        setEditTarget(cita);
        editForm.setData({
            estado:          cita.estado,
            notas_empleado:  cita.notas_empleado ?? '',
            precio_cobrado:  cita.precio_cobrado ?? '',
        });
    }

    function submitCreate(e) {
        e.preventDefault();
        form.post(route('admin.citas.store'), {
            onSuccess: () => { setCreateOpen(false); form.reset(); },
        });
    }

    function submitEdit(e) {
        e.preventDefault();
        editForm.patch(route('admin.citas.update', editTarget.id), {
            onSuccess: () => setEditTarget(null),
        });
    }

    function handleDelete() {
        router.delete(route('admin.citas.destroy', confirmDelete), {
            onSuccess: () => setConfirmDelete(null),
        });
    }

    /* stats for header */
    const totalMes     = citas.length;
    const pendientes   = citas.filter(c => c.estado === 'PENDIENTE').length;
    const confirmadas  = citas.filter(c => c.estado === 'CONFIRMADA').length;
    const completadas  = citas.filter(c => c.estado === 'COMPLETADA').length;

    return (
        <AdminLayout title="Citas">
            <Head title="Citas — Admin" />

            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                        Agenda del Mes
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="font-sans text-[10px] text-amber-400">{pendientes} pendientes</span>
                        <span className="text-gold/20">·</span>
                        <span className="font-sans text-[10px] text-blue-400">{confirmadas} confirmadas</span>
                        <span className="text-gold/20">·</span>
                        <span className="font-sans text-[10px] text-green-400">{completadas} completadas</span>
                    </div>
                </div>
                <button onClick={openCreate}
                        className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all">
                    <Icon name="add" className="text-[16px]" />
                    Nueva Cita
                </button>
            </div>

            {/* ── Main: Calendar + Panel ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

                {/* ── Calendar (3 cols) ── */}
                <div className="xl:col-span-3 kpi-card">

                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => goMonth(-1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full
                                           border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50
                                           transition-all">
                            <Icon name="chevron_left" className="text-[20px]" />
                        </button>
                        <div className="text-center">
                            <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                                {MESES[month - 1]}
                            </h3>
                            <p className="font-sans text-[10px] text-gold/50 tracking-widest mt-0.5">{year}</p>
                        </div>
                        <button onClick={() => goMonth(1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full
                                           border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50
                                           transition-all">
                            <Icon name="chevron_right" className="text-[20px]" />
                        </button>
                    </div>

                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DIAS_SEMANA.map(d => (
                            <div key={d} className="text-center font-sans text-[9px] uppercase tracking-widest
                                                    text-spa-on-light-dim dark:text-gold/30 py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map(({ date, current }, i) => {
                            const ds        = toDateStr(date);
                            const dayCitas  = citasByDate[ds] ?? [];
                            const isToday   = ds === todayStr;
                            const isSelected= ds === selectedDate;
                            const hasCitas  = dayCitas.length > 0;

                            return (
                                <button key={i} onClick={() => setSelectedDate(ds)}
                                        className={`
                                            relative flex flex-col items-center pt-2 pb-1.5 px-1 rounded-md
                                            min-h-[56px] transition-all duration-150 group
                                            ${!current ? 'opacity-25' : ''}
                                            ${isSelected
                                                ? 'bg-gold/15 ring-1 ring-gold/50'
                                                : isToday
                                                    ? 'ring-1 ring-gold/30 bg-gold/5'
                                                    : 'hover:bg-gold/5'
                                            }
                                        `}>
                                    {/* Day number */}
                                    <span className={`font-sans text-sm leading-none mb-1.5 transition-colors
                                                      ${isSelected  ? 'text-gold font-semibold'
                                                       : isToday    ? 'text-gold'
                                                       : 'text-spa-on-light dark:text-spa-on-dark'}`}>
                                        {date.getDate()}
                                    </span>

                                    {/* Today dot */}
                                    {isToday && !isSelected && (
                                        <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gold" />
                                    )}

                                    {/* Appointment dots */}
                                    {hasCitas && (
                                        <div className="flex items-center gap-0.5 flex-wrap justify-center">
                                            {dayCitas.slice(0, 4).map((c, j) => (
                                                <span key={j}
                                                      className={`w-1.5 h-1.5 rounded-full ${ESTADO[c.estado]?.dot ?? 'bg-gold/40'}`} />
                                            ))}
                                            {dayCitas.length > 4 && (
                                                <span className="font-sans text-[8px] text-gold/50 leading-none">
                                                    +{dayCitas.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-5 pt-4 border-t border-gold/10 flex flex-wrap gap-x-4 gap-y-2">
                        {Object.entries(ESTADO).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${v.dot}`} />
                                <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                    {v.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Day detail panel (2 cols) ── */}
                <div className="xl:col-span-2 kpi-card flex flex-col">

                    {/* Panel header */}
                    <div className="flex items-start justify-between mb-5 pb-4 border-b border-gold/10">
                        <div>
                            <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-0.5">
                                {selectedCitas.length === 0 ? 'Sin citas' : `${selectedCitas.length} cita${selectedCitas.length > 1 ? 's' : ''}`}
                            </p>
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark capitalize leading-tight">
                                {selDateLabel}
                            </h3>
                        </div>
                        <button onClick={openCreate}
                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-sm
                                           border border-gold/30 text-gold font-sans text-[10px] uppercase tracking-widest
                                           hover:bg-gold/10 transition-all">
                            <Icon name="add" className="text-[14px]" />
                            Agregar
                        </button>
                    </div>

                    {/* Appointments list */}
                    {selectedCitas.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                            <Icon name="event_available" className="text-gold/15 text-[52px] mb-3" />
                            <p className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark">
                                Día libre
                            </p>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1 max-w-[180px]">
                                No hay citas programadas. Haz clic en "Agregar" para crear una.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-y-auto flex-1">
                            {selectedCitas.map((cita) => {
                                const s = ESTADO[cita.estado] ?? ESTADO.PENDIENTE;
                                return (
                                    <div key={cita.id}
                                         className={`p-4 rounded-md border transition-all duration-200
                                                     bg-white/[0.02] dark:bg-white/[0.03]
                                                     border-gold/10 hover:border-gold/25`}>

                                        {/* Time + status */}
                                        <div className="flex items-center justify-between mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-8 rounded-full ${s.dot}`} />
                                                <div>
                                                    <p className="font-serif text-base gold-gradient-text leading-none">
                                                        {cita.hora}
                                                    </p>
                                                    <p className="font-sans text-[9px] text-spa-on-dark-dim mt-0.5">
                                                        {cita.hora_fin} · {cita.duracion} min
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-sm font-sans text-[8px] uppercase tracking-wider ${s.bg} ${s.text}`}>
                                                {s.label}
                                            </span>
                                        </div>

                                        {/* Client + service */}
                                        <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">
                                            {cita.cliente}
                                        </p>
                                        <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                            {cita.servicio}
                                        </p>
                                        <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                            {cita.empleado}
                                            {cita.precio_cobrado ? ` · $${cita.precio_cobrado}` : ''}
                                        </p>

                                        {/* Quick actions */}
                                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gold/10">
                                            {/* Estado rápido */}
                                            {cita.estado === 'PENDIENTE' && (
                                                <button onClick={() => {
                                                    router.patch(route('admin.citas.update', cita.id), { estado: 'CONFIRMADA' });
                                                }} className="flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest
                                                              text-blue-400 hover:text-blue-300 transition-colors">
                                                    <Icon name="check_circle" className="text-[13px]" />
                                                    Confirmar
                                                </button>
                                            )}
                                            {(cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA') && (
                                                <button onClick={() => {
                                                    router.patch(route('admin.citas.update', cita.id), { estado: 'COMPLETADA' });
                                                }} className="flex items-center gap-1 font-sans text-[9px] uppercase tracking-widest
                                                              text-green-400 hover:text-green-300 transition-colors">
                                                    <Icon name="task_alt" className="text-[13px]" />
                                                    Completar
                                                </button>
                                            )}
                                            <div className="flex-1" />
                                            <button onClick={() => openEdit(cita)}
                                                    className="p-1.5 text-spa-on-dark-dim hover:text-gold transition-colors rounded-sm hover:bg-gold/10">
                                                <Icon name="edit" className="text-[14px]" />
                                            </button>
                                            <button onClick={() => setConfirmDelete(cita.id)}
                                                    className="p-1.5 text-spa-on-dark-dim hover:text-red-400 transition-colors rounded-sm hover:bg-red-400/10">
                                                <Icon name="delete" className="text-[14px]" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal: Nueva Cita ── */}
            <Modal open={createOpen} onClose={() => { setCreateOpen(false); form.reset(); }} title="Nueva Cita" wide>
                <form onSubmit={submitCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Cliente" error={form.errors.cliente_id}>
                            <select value={form.data.cliente_id} onChange={e => form.setData('cliente_id', e.target.value)} className={selectCls}>
                                <option value="">Seleccionar...</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </Field>
                        <Field label="Especialista" error={form.errors.empleado_id}>
                            <select value={form.data.empleado_id} onChange={e => form.setData('empleado_id', e.target.value)} className={selectCls}>
                                <option value="">Seleccionar...</option>
                                {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}{e.especialidad ? ` — ${e.especialidad}` : ''}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Servicio" error={form.errors.servicio_id}>
                        <select value={form.data.servicio_id} onChange={e => form.setData('servicio_id', e.target.value)} className={selectCls}>
                            <option value="">Seleccionar servicio...</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} — {s.duracion} min</option>)}
                        </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fecha y hora" error={form.errors.fecha_hora_inicio}>
                            <input type="datetime-local" value={form.data.fecha_hora_inicio}
                                   onChange={e => form.setData('fecha_hora_inicio', e.target.value)}
                                   className={inputCls} />
                        </Field>
                        <Field label="Precio ($)" error={form.errors.precio_cobrado}>
                            <input type="number" step="0.01" min="0" value={form.data.precio_cobrado}
                                   onChange={e => form.setData('precio_cobrado', e.target.value)}
                                   className={inputCls} placeholder="0.00" />
                        </Field>
                    </div>
                    <Field label="Notas del cliente" error={form.errors.notas_cliente}>
                        <textarea value={form.data.notas_cliente} rows={2}
                                  onChange={e => form.setData('notas_cliente', e.target.value)}
                                  className={inputCls} placeholder="Observaciones opcionales..." />
                    </Field>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => { setCreateOpen(false); form.reset(); }}
                                className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={form.processing}
                                className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                            {form.processing ? 'Guardando...' : 'Crear Cita'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Editar estado ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Cita">
                {editTarget && (
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="p-3 bg-gold/5 rounded-sm border border-gold/10">
                            <p className="font-sans text-sm font-medium text-spa-on-dark">{editTarget.cliente}</p>
                            <p className="font-sans text-xs italic text-spa-on-dark-dim mt-0.5">
                                {editTarget.servicio} · {editTarget.fecha} {editTarget.hora}
                            </p>
                        </div>
                        <Field label="Estado" error={editForm.errors.estado}>
                            <select value={editForm.data.estado} onChange={e => editForm.setData('estado', e.target.value)} className={selectCls}>
                                {Object.entries(ESTADO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </Field>
                        <Field label="Precio cobrado ($)" error={editForm.errors.precio_cobrado}>
                            <input type="number" step="0.01" min="0" value={editForm.data.precio_cobrado}
                                   onChange={e => editForm.setData('precio_cobrado', e.target.value)}
                                   className={inputCls} />
                        </Field>
                        <Field label="Notas del especialista" error={editForm.errors.notas_empleado}>
                            <textarea value={editForm.data.notas_empleado} rows={3}
                                      onChange={e => editForm.setData('notas_empleado', e.target.value)}
                                      className={inputCls} placeholder="Observaciones internas..." />
                        </Field>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setEditTarget(null)}
                                    className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                                Cancelar
                            </button>
                            <button type="submit" disabled={editForm.processing}
                                    className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                                {editForm.processing ? 'Guardando...' : 'Actualizar'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ── Modal: Confirmar borrado ── */}
            <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar Cita">
                <p className="font-sans text-sm text-spa-on-dark mb-6">
                    ¿Eliminar esta cita? La acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDelete(null)}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleDelete}
                            className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
