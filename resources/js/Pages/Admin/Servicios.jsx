import { Head, useForm, router } from '@inertiajs/react';
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
const selectCls = `${inputCls} cursor-pointer`;

const BLANK = { nombre: '', descripcion: '', categoria_id: '', duracion_minutos: '', precio: '', activo: true };

export default function Servicios({ servicios, categorias }) {
    const [modalOpen, setModalOpen]   = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [catFilter, setCatFilter]   = useState('');

    const form = useForm(BLANK);

    function openCreate() {
        form.setData(BLANK);
        setEditTarget(null);
        setModalOpen(true);
    }

    function openEdit(s) {
        setEditTarget(s);
        form.setData({
            nombre: s.nombre, descripcion: s.descripcion ?? '',
            categoria_id: s.categoria_id, duracion_minutos: s.duracion,
            precio: s.precio, activo: s.activo,
        });
        setModalOpen(true);
    }

    function submit(e) {
        e.preventDefault();
        if (editTarget) {
            form.patch(route('admin.servicios.update', editTarget.id), {
                onSuccess: () => { setModalOpen(false); setEditTarget(null); },
            });
        } else {
            form.post(route('admin.servicios.store'), {
                onSuccess: () => { setModalOpen(false); form.reset(); },
            });
        }
    }

    function handleDelete() {
        router.delete(route('admin.servicios.destroy', confirmDelete), {
            onSuccess: () => setConfirmDelete(null),
        });
    }

    const visible = catFilter
        ? servicios.filter(s => s.categoria_id === catFilter)
        : servicios;

    return (
        <AdminLayout title="Servicios">
            <Head title="Servicios — Admin" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Servicios</h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {servicios.length} servicios · {categorias.length} categorías
                    </p>
                </div>
                <button onClick={openCreate}
                        className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all">
                    <Icon name="add" className="text-[16px]" />
                    Nuevo Servicio
                </button>
            </div>

            {/* Filtro por categoría */}
            <div className="flex flex-wrap gap-2 mb-5">
                <button onClick={() => setCatFilter('')}
                        className={`px-4 py-1.5 font-sans text-[10px] uppercase tracking-widest rounded-full transition-all
                                    ${!catFilter ? 'gold-gradient text-gold-text' : 'border border-gold/20 text-gold/60 hover:border-gold/50'}`}>
                    Todos
                </button>
                {categorias.map(cat => (
                    <button key={cat.id} onClick={() => setCatFilter(cat.id)}
                            className={`px-4 py-1.5 font-sans text-[10px] uppercase tracking-widest rounded-full transition-all
                                        ${catFilter === cat.id ? 'gold-gradient text-gold-text' : 'border border-gold/20 text-gold/60 hover:border-gold/50'}`}>
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {/* Grid de servicios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map(s => (
                    <div key={s.id}
                         className={`kpi-card group border transition-all duration-200
                                     ${s.activo ? 'border-transparent hover:border-gold/30' : 'border-red-400/20 opacity-60'}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                                <Icon name="auto_awesome" className="text-gold/50 text-[14px]" />
                                <span className="font-sans text-[9px] uppercase tracking-widest text-gold/50">
                                    {s.categoria}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {!s.activo && (
                                    <span className="px-2 py-0.5 bg-red-400/10 text-red-400 font-sans text-[9px] uppercase tracking-wider rounded-sm">
                                        Inactivo
                                    </span>
                                )}
                                <button onClick={() => openEdit(s)}
                                        className="p-1 text-spa-on-dark-dim hover:text-gold transition-colors rounded-sm opacity-0 group-hover:opacity-100">
                                    <Icon name="edit" className="text-[15px]" />
                                </button>
                                <button onClick={() => setConfirmDelete(s.id)}
                                        className="p-1 text-spa-on-dark-dim hover:text-red-400 transition-colors rounded-sm opacity-0 group-hover:opacity-100">
                                    <Icon name="delete" className="text-[15px]" />
                                </button>
                            </div>
                        </div>

                        <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1 leading-snug">
                            {s.nombre}
                        </p>
                        {s.descripcion && (
                            <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim mb-3 line-clamp-2">
                                {s.descripcion}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gold/10">
                            <span className="flex items-center gap-1 font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                <Icon name="timer" className="text-[13px]" />
                                {s.duracion} min
                            </span>
                            <span className="font-serif text-xl gold-gradient-text">${s.precio}</span>
                        </div>
                    </div>
                ))}
            </div>

            {visible.length === 0 && (
                <div className="kpi-card text-center py-12 mt-2">
                    <Icon name="auto_awesome" className="text-gold/20 text-[48px] mb-3" />
                    <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">Sin servicios</p>
                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                        Crea el primero con el botón de arriba.
                    </p>
                </div>
            )}

            {/* Modal crear/editar */}
            <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }}
                   title={editTarget ? 'Editar Servicio' : 'Nuevo Servicio'}>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Nombre" error={form.errors.nombre}>
                        <input value={form.data.nombre} onChange={e => form.setData('nombre', e.target.value)}
                               className={inputCls} placeholder="Ej. Masaje Relajante" />
                    </Field>
                    <Field label="Descripción" error={form.errors.descripcion}>
                        <textarea value={form.data.descripcion} rows={2}
                                  onChange={e => form.setData('descripcion', e.target.value)}
                                  className={inputCls} placeholder="Descripción breve..." />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Categoría" error={form.errors.categoria_id}>
                            <select value={form.data.categoria_id} onChange={e => form.setData('categoria_id', e.target.value)} className={selectCls}>
                                <option value="">Seleccionar...</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </Field>
                        <Field label="Duración (min)" error={form.errors.duracion_minutos}>
                            <input type="number" min="5" value={form.data.duracion_minutos}
                                   onChange={e => form.setData('duracion_minutos', e.target.value)}
                                   className={inputCls} placeholder="60" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Precio ($)" error={form.errors.precio}>
                            <input type="number" step="0.01" min="0" value={form.data.precio}
                                   onChange={e => form.setData('precio', e.target.value)}
                                   className={inputCls} placeholder="0.00" />
                        </Field>
                        <Field label="Estado">
                            <label className="flex items-center gap-2 cursor-pointer mt-3">
                                <input type="checkbox" checked={form.data.activo}
                                       onChange={e => form.setData('activo', e.target.checked)}
                                       className="w-4 h-4 accent-gold rounded" />
                                <span className="font-sans text-sm text-spa-on-dark">Activo</span>
                            </label>
                        </Field>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => { setModalOpen(false); setEditTarget(null); }}
                                className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20
                                           text-gold/60 hover:text-gold rounded-sm transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={form.processing}
                                className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest
                                           font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                            {form.processing ? 'Guardando...' : editTarget ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirmar borrado */}
            <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar Servicio">
                <p className="font-sans text-sm text-spa-on-dark mb-6">
                    ¿Eliminar este servicio? Las citas existentes no se verán afectadas.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDelete(null)}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20
                                       text-gold/60 hover:text-gold rounded-sm transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleDelete}
                            className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold
                                       bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
