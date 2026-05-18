import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Stars from '@/Components/Stars';
import { useState } from 'react';

const MEDAL = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
const MEDAL_BG = ['bg-yellow-400/10', 'bg-gray-300/10', 'bg-amber-600/10'];

function Ranking({ empleados }) {
    const [sortBy, setSortBy] = useState('completadas');

    const sorted = [...empleados]
        .filter(e => e.activo)
        .sort((a, b) => {
            if (sortBy === 'completadas') return b.completadas_count - a.completadas_count;
            if (sortBy === 'calificacion') return (b.avg_calificacion ?? 0) - (a.avg_calificacion ?? 0);
            if (sortBy === 'ingresos')    return b.ingresos_total - a.ingresos_total;
            return 0;
        })
        .slice(0, 5);

    if (sorted.length === 0) return null;

    return (
        <div className="kpi-card mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-serif text-lg text-gold">Top Especialistas</h3>
                    <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5 uppercase tracking-widest">Ranking de rendimiento</p>
                </div>
                <div className="flex items-center bg-spa-bg dark:bg-spa-bg rounded-sm border border-gold/20 overflow-hidden">
                    {[['completadas','Citas'],['calificacion','Rating'],['ingresos','Ingresos']].map(([k, label]) => (
                        <button key={k} onClick={() => setSortBy(k)}
                                className={`px-3 py-1.5 font-sans text-[9px] uppercase tracking-widest transition-all
                                            ${sortBy === k ? 'bg-gold/20 text-gold' : 'text-spa-on-dark-dim hover:text-gold'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                {sorted.map((e, i) => (
                    <div key={e.id} className={`flex items-center gap-4 p-3 rounded-md border border-gold/10 ${i < 3 ? MEDAL_BG[i] : ''} hover:border-gold/25 transition-all`}>
                        {/* Position */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold shrink-0
                                         ${i < 3 ? MEDAL[i] : 'text-spa-on-dark-dim'} ${i < 3 ? 'border border-current/30' : ''}`}>
                            {i + 1}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center font-sans text-sm font-bold text-gold-text shrink-0">
                            {e.nombre.charAt(0)}
                        </div>

                        {/* Name + specialty */}
                        <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark truncate">{e.nombre}</p>
                            <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim truncate">{e.especialidad ?? '—'}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-5 shrink-0">
                            <div className="text-center">
                                <p className="font-serif text-lg gold-gradient-text leading-none">{e.completadas_count}</p>
                                <p className="font-sans text-[8px] uppercase tracking-widest text-spa-on-dark-dim mt-0.5">Compl.</p>
                            </div>
                            <div className="text-center">
                                <p className={`font-serif text-lg leading-none ${e.avg_calificacion ? 'gold-gradient-text' : 'text-spa-on-dark-dim/30'}`}>
                                    {e.avg_calificacion ?? '—'}
                                </p>
                                <p className="font-sans text-[8px] uppercase tracking-widest text-spa-on-dark-dim mt-0.5">Rating</p>
                            </div>
                            <div className="text-center hidden sm:block">
                                <p className="font-serif text-lg gold-gradient-text leading-none">Bs {e.ingresos_total.toLocaleString('es')}</p>
                                <p className="font-sans text-[8px] uppercase tracking-widest text-spa-on-dark-dim mt-0.5">Ingresos</p>
                            </div>
                        </div>

                        {/* Ver citas */}
                        <button onClick={() => router.get(route('admin.citas.index'), { empleado_id: e.usuario_id, periodo: 'mes' })}
                                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 border border-gold/20 rounded-sm
                                           font-sans text-[9px] uppercase tracking-widest text-gold/60 hover:text-gold hover:border-gold/40 transition-all"
                                title="Ver citas de este especialista">
                            <span className="material-symbols-outlined text-[13px]"
                                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>calendar_month</span>
                            Citas
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg bg-spa-surface border border-gold/20
                            rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
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
            <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 font-sans text-[11px] text-red-400">{error}</p>}
        </div>
    );
}

const inputCls = "w-full bg-spa-bg border border-gold/20 rounded-sm px-3 py-2.5 font-sans text-sm text-spa-on-dark placeholder:text-spa-on-dark-dim/40 focus:border-gold/60 focus:outline-none transition-colors";

const BLANK_CREATE = { nombre: '', correo: '', especialidad: '', categoria_id: '', telefono: '', bio: '', fecha_contratacion: '' };
const BLANK_EDIT   = { nombre: '', especialidad: '', categoria_id: '', telefono: '', bio: '', fecha_contratacion: '', activo: true };

export default function Especialistas({ empleados, categorias }) {
    const [createOpen, setCreateOpen]     = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [confirmToggle, setConfirmToggle] = useState(null);

    const createForm = useForm(BLANK_CREATE);
    const editForm   = useForm(BLANK_EDIT);

    function openEdit(e) {
        setEditTarget(e);
        editForm.setData({
            nombre: e.nombre, especialidad: e.especialidad ?? '',
            categoria_id: e.categoria_id ?? '',
            telefono: e.telefono ?? '', bio: e.bio ?? '',
            fecha_contratacion: e.fecha_contratacion ?? '',
            activo: e.activo,
        });
    }

    function submitCreate(ev) {
        ev.preventDefault();
        createForm.post(route('admin.especialistas.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    }

    function submitEdit(ev) {
        ev.preventDefault();
        editForm.patch(route('admin.especialistas.update', editTarget.id), {
            onSuccess: () => setEditTarget(null),
        });
    }

    function handleToggle() {
        router.delete(route('admin.especialistas.destroy', confirmToggle), {
            onSuccess: () => setConfirmToggle(null),
        });
    }

    const activos   = empleados.filter(e => e.activo);
    const inactivos = empleados.filter(e => !e.activo);

    return (
        <AdminLayout title="Especialistas">
            <Head title="Especialistas — Admin" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Especialistas</h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {activos.length} activos · {inactivos.length} inactivos
                    </p>
                </div>
                <button onClick={() => setCreateOpen(true)}
                        className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all">
                    <Icon name="person_add" className="text-[16px]" />
                    Nuevo Especialista
                </button>
            </div>

            {/* Ranking */}
            <Ranking empleados={empleados} />

            {/* KPI rápidos */}
            {(() => {
                const conResenas   = empleados.filter(e => e.avg_calificacion !== null);
                const globalAvg    = conResenas.length
                    ? (conResenas.reduce((a, e) => a + e.avg_calificacion, 0) / conResenas.length).toFixed(1)
                    : null;
                const totalResenas = empleados.reduce((a, e) => a + e.total_resenas, 0);
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Activos',      value: activos.length,    icon: 'groups'   },
                            { label: 'Total citas',  value: empleados.reduce((a, e) => a + e.total_citas, 0), icon: 'event' },
                            { label: 'Reseñas',      value: totalResenas,      icon: 'reviews'  },
                            { label: 'Inactivos',    value: inactivos.length,  icon: 'person_off'},
                        ].map(({ label, value, icon }) => (
                            <div key={label} className="kpi-card">
                                <Icon name={icon} className="text-gold/50 text-[20px] mb-3" />
                                <p className="font-serif text-3xl gold-gradient-text">{value}</p>
                                <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Lista */}
            <div className="kpi-card overflow-hidden p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gold/10">
                            {['Especialista', 'Especialidad', 'Teléfono', 'Contratación', 'Total', 'Completadas', 'Calificación', 'Estado', ''].map(h => (
                                <th key={h} className="px-5 py-3.5 text-left font-sans text-[9px] uppercase tracking-[0.2em] text-spa-on-light-dim dark:text-gold/40">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map((e, i) => (
                            <tr key={e.id}
                                className={`border-b border-gold/5 hover:bg-gold/5 transition-colors
                                            ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center
                                                        font-sans text-sm font-bold text-gold-text shrink-0">
                                            {e.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">{e.nombre}</p>
                                            <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">{e.correo}</p>
                                            {e.bloqueado && (
                                                <span className="inline-flex items-center gap-1 font-sans text-[9px] uppercase tracking-wider text-red-400">
                                                    <Icon name="lock" className="text-[11px]" />
                                                    Bloqueada
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {e.especialidad ?? '—'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {e.telefono ?? '—'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {e.fecha_contratacion ?? '—'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-serif text-lg gold-gradient-text">{e.total_citas}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-serif text-lg text-green-400">{e.completadas_count}</span>
                                </td>
                                <td className="px-5 py-4">
                                    {e.avg_calificacion !== null ? (
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <Stars value={Math.round(e.avg_calificacion)} size="text-[14px]" />
                                                <span className="font-sans text-xs font-medium text-spa-on-light dark:text-spa-on-dark">
                                                    {e.avg_calificacion}
                                                </span>
                                            </div>
                                            <span className="font-sans text-[9px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                {e.total_resenas} reseña{e.total_resenas !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-sans text-[10px] text-spa-on-light-dim/50 dark:text-spa-on-dark-dim/40 italic">
                                            Sin reseñas
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-sans text-[9px] uppercase tracking-wider
                                                      ${e.activo ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${e.activo ? 'bg-green-400' : 'bg-gray-400'}`} />
                                        {e.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(e)}
                                                className="p-1.5 text-spa-on-dark-dim hover:text-gold transition-colors rounded-sm hover:bg-gold/10">
                                            <Icon name="edit" className="text-[16px]" />
                                        </button>
                                        {e.activo && (
                                            <button onClick={() => setConfirmToggle(e.id)}
                                                    className="p-1.5 text-spa-on-dark-dim hover:text-amber-400 transition-colors rounded-sm hover:bg-amber-400/10"
                                                    title="Desactivar">
                                                <Icon name="person_off" className="text-[16px]" />
                                            </button>
                                        )}
                                        {e.bloqueado && (
                                            <button onClick={() => router.post(route('admin.especialistas.desbloquear', e.usuario_id))}
                                                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors rounded-sm hover:bg-red-400/10"
                                                    title="Desbloquear cuenta">
                                                <Icon name="lock_open" className="text-[16px]" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal crear */}
            <Modal open={createOpen} onClose={() => { setCreateOpen(false); createForm.reset(); }} title="Nuevo Especialista">
                <form onSubmit={submitCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Nombre completo" error={createForm.errors.nombre}>
                            <input value={createForm.data.nombre} onChange={e => createForm.setData('nombre', e.target.value)}
                                   className={inputCls} placeholder="María López" />
                        </Field>
                        <Field label="Correo electrónico" error={createForm.errors.correo}>
                            <input type="email" value={createForm.data.correo} onChange={e => createForm.setData('correo', e.target.value)}
                                   className={inputCls} placeholder="maria@spa.com" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Especialidad" error={createForm.errors.especialidad}>
                            <input value={createForm.data.especialidad} onChange={e => createForm.setData('especialidad', e.target.value)}
                                   className={inputCls} placeholder="Masajista, Esteticista..." />
                        </Field>
                        <Field label="Teléfono (contraseña inicial)" error={createForm.errors.telefono}>
                            <input value={createForm.data.telefono} onChange={e => createForm.setData('telefono', e.target.value)}
                                   className={inputCls} placeholder="+1 555 000 0000" />
                        </Field>
                    </div>
                    <Field label="Categoría de servicios" error={createForm.errors.categoria_id}>
                        <select value={createForm.data.categoria_id} onChange={e => createForm.setData('categoria_id', e.target.value)}
                                className={inputCls}>
                            <option value="">Sin restricción de categoría</option>
                            {categorias.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 bg-gold/5 border border-gold/20 rounded-sm px-4 py-2.5 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gold/50 text-[16px]"
                                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>info</span>
                            <p className="font-sans text-[10px] text-spa-on-dark-dim">
                                La contraseña inicial será el número de teléfono. El especialista deberá cambiarla en su primer acceso.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fecha de contratación" error={createForm.errors.fecha_contratacion}>
                            <input type="date" value={createForm.data.fecha_contratacion} onChange={e => createForm.setData('fecha_contratacion', e.target.value)}
                                   className={inputCls} />
                        </Field>
                    </div>
                    <Field label="Bio / Descripción" error={createForm.errors.bio}>
                        <textarea value={createForm.data.bio} rows={2}
                                  onChange={e => createForm.setData('bio', e.target.value)}
                                  className={inputCls} placeholder="Breve descripción profesional..." />
                    </Field>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => { setCreateOpen(false); createForm.reset(); }}
                                className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={createForm.processing}
                                className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                            {createForm.processing ? 'Creando...' : 'Crear Especialista'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal editar */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Especialista">
                {editTarget && (
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Nombre completo" error={editForm.errors.nombre}>
                                <input value={editForm.data.nombre} onChange={e => editForm.setData('nombre', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Especialidad" error={editForm.errors.especialidad}>
                                <input value={editForm.data.especialidad} onChange={e => editForm.setData('especialidad', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Categoría de servicios" error={editForm.errors.categoria_id}>
                            <select value={editForm.data.categoria_id} onChange={e => editForm.setData('categoria_id', e.target.value)}
                                    className={inputCls}>
                                <option value="">Sin restricción de categoría</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Teléfono" error={editForm.errors.telefono}>
                                <input value={editForm.data.telefono} onChange={e => editForm.setData('telefono', e.target.value)} className={inputCls} />
                            </Field>
                            <Field label="Fecha de contratación" error={editForm.errors.fecha_contratacion}>
                                <input type="date" value={editForm.data.fecha_contratacion} onChange={e => editForm.setData('fecha_contratacion', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                        <Field label="Bio" error={editForm.errors.bio}>
                            <textarea value={editForm.data.bio} rows={2} onChange={e => editForm.setData('bio', e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="Estado">
                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                <input type="checkbox" checked={editForm.data.activo} onChange={e => editForm.setData('activo', e.target.checked)}
                                       className="w-4 h-4 accent-gold" />
                                <span className="font-sans text-sm text-spa-on-dark">Activo</span>
                            </label>
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

            {/* Modal confirmar desactivar */}
            <Modal open={!!confirmToggle} onClose={() => setConfirmToggle(null)} title="Desactivar Especialista">
                <p className="font-sans text-sm text-spa-on-dark mb-6">
                    El especialista pasará a estado inactivo y no podrá recibir nuevas citas.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmToggle(null)}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleToggle}
                            className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold bg-amber-500/80 hover:bg-amber-500 text-black rounded-sm transition-all">
                        Desactivar
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
