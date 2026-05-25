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
            <div className="relative z-10 w-full max-w-md bg-spa-surface border border-gold/20
                            rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
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

const BLANK = { nombre: '', descripcion: '', activo: true };

// Paleta de colores para las tarjetas (rotativa por índice)
const CARD_ACCENTS = [
    'border-gold/20 bg-gold/[0.03]',
    'border-blue-400/20 bg-blue-400/[0.03]',
    'border-purple-400/20 bg-purple-400/[0.03]',
    'border-emerald-400/20 bg-emerald-400/[0.03]',
    'border-rose-400/20 bg-rose-400/[0.03]',
    'border-amber-400/20 bg-amber-400/[0.03]',
];

export default function Categorias({ categorias }) {
    const [modalOpen, setModalOpen]       = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const form = useForm(BLANK);

    function openCreate() {
        form.setData(BLANK);
        form.clearErrors();
        setEditTarget(null);
        setModalOpen(true);
    }

    function openEdit(c) {
        setEditTarget(c);
        form.setData({ nombre: c.nombre, descripcion: c.descripcion ?? '', activo: c.activo });
        form.clearErrors();
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditTarget(null);
        form.clearErrors();
    }

    function submit(e) {
        e.preventDefault();
        if (editTarget) {
            form.patch(route('admin.categorias.update', editTarget.id), {
                onSuccess: closeModal,
            });
        } else {
            form.post(route('admin.categorias.store'), {
                onSuccess: () => { closeModal(); form.reset(); },
            });
        }
    }

    function handleDelete() {
        router.delete(route('admin.categorias.destroy', confirmDelete), {
            onSuccess: () => setConfirmDelete(null),
        });
    }

    const activas   = categorias.filter(c => c.activo);
    const inactivas = categorias.filter(c => !c.activo);

    return (
        <AdminLayout title="Categorías de Servicios">
            <Head title="Categorías — Admin" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/50 mb-1">
                        Configuración
                    </p>
                    <h2 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        Categorías de <span className="text-gold italic">Servicios</span>
                    </h2>
                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                        {activas.length} activa{activas.length !== 1 ? 's' : ''} · {categorias.reduce((a, c) => a + c.total_servicios, 0)} servicios en total
                    </p>
                </div>
                <button onClick={openCreate}
                        className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all">
                    <Icon name="add" className="text-[16px]" />
                    Nueva Categoría
                </button>
            </div>

            {/* Grid de categorías */}
            {categorias.length === 0 ? (
                <div className="kpi-card flex flex-col items-center justify-center py-20 text-center">
                    <Icon name="category" className="text-gold/15 text-[64px] mb-4" />
                    <p className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-2">
                        Sin categorías
                    </p>
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim max-w-xs mb-6">
                        Las categorías agrupan tus servicios y permiten asignar especialistas específicos para cada área.
                    </p>
                    <button onClick={openCreate}
                            className="gold-gradient px-5 py-2.5 rounded-sm font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text">
                        Crear primera categoría
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorias.map((c, i) => (
                        <div key={c.id}
                             className={`kpi-card group relative border transition-all duration-200 hover:shadow-gold/5
                                         ${c.activo ? CARD_ACCENTS[i % CARD_ACCENTS.length] : 'border-white/5 opacity-50'}`}>

                            {/* Decorative icon */}
                            <div className="absolute top-4 right-4 opacity-[0.06] pointer-events-none">
                                <Icon name="category" className="text-[56px] text-gold" />
                            </div>

                            {/* Actions (hover) */}
                            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!c.activo && (
                                    <span className="px-2 py-0.5 bg-red-400/10 text-red-400 font-sans text-[9px] uppercase tracking-wider rounded-sm mr-1">
                                        Inactiva
                                    </span>
                                )}
                                <button onClick={() => openEdit(c)}
                                        className="p-1.5 rounded-sm bg-spa-surface border border-gold/15 text-spa-on-dark-dim hover:text-gold hover:border-gold/40 transition-all">
                                    <Icon name="edit" className="text-[14px]" />
                                </button>
                                <button onClick={() => setConfirmDelete(c)}
                                        className="p-1.5 rounded-sm bg-spa-surface border border-gold/15 text-spa-on-dark-dim hover:text-red-400 hover:border-red-400/30 transition-all">
                                    <Icon name="delete" className="text-[14px]" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="pr-16">
                                <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark leading-snug mb-1">
                                    {c.nombre}
                                </p>
                                {c.descripcion && (
                                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim line-clamp-2 mb-3">
                                        {c.descripcion}
                                    </p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gold/10">
                                <div className="flex items-center gap-1.5">
                                    <Icon name="auto_awesome" className="text-gold/40 text-[14px]" />
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {c.total_servicios} servicio{c.total_servicios !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className={`ml-auto flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wider
                                                 ${c.activo ? 'text-emerald-400' : 'text-spa-on-dark-dim/40'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${c.activo ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                    {c.activo ? 'Activa' : 'Inactiva'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal crear/editar */}
            <Modal open={modalOpen} onClose={closeModal}
                   title={editTarget ? 'Editar Categoría' : 'Nueva Categoría'}>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Nombre" error={form.errors.nombre}>
                        <input value={form.data.nombre}
                               onChange={e => form.setData('nombre', e.target.value)}
                               className={inputCls}
                               placeholder="Ej. Masajes, Uñas, Facial..." />
                    </Field>

                    <Field label="Descripción" error={form.errors.descripcion}>
                        <textarea value={form.data.descripcion} rows={3}
                                  onChange={e => form.setData('descripcion', e.target.value)}
                                  className={inputCls}
                                  placeholder="Descripción breve de esta categoría..." />
                    </Field>

                    <Field label="Estado">
                        <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input type="checkbox" checked={form.data.activo}
                                   onChange={e => form.setData('activo', e.target.checked)}
                                   className="w-4 h-4 accent-gold rounded" />
                            <span className="font-sans text-sm text-spa-on-dark">Activa</span>
                        </label>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={closeModal}
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

            {/* Confirmar eliminación */}
            <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar Categoría">
                {confirmDelete && (
                    <>
                        <div className="mb-5">
                            <p className="font-sans text-sm text-spa-on-dark mb-2">
                                ¿Eliminar la categoría <span className="text-gold font-semibold">"{confirmDelete.nombre}"</span>?
                            </p>
                            {confirmDelete.total_servicios > 0 ? (
                                <div className="flex items-start gap-2 p-3 bg-red-400/10 border border-red-400/20 rounded-sm mt-3">
                                    <Icon name="warning" className="text-red-400 text-[16px] shrink-0 mt-0.5" />
                                    <p className="font-sans text-xs text-red-300">
                                        Esta categoría tiene <strong>{confirmDelete.total_servicios} servicio(s)</strong> asignado(s). Debes reasignarlos o eliminarlos antes de poder borrar esta categoría.
                                    </p>
                                </div>
                            ) : (
                                <p className="font-sans text-xs text-spa-on-dark-dim">
                                    Esta acción no se puede deshacer.
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmDelete(null)}
                                    className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20
                                               text-gold/60 hover:text-gold rounded-sm transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleDelete}
                                    disabled={confirmDelete.total_servicios > 0}
                                    className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold
                                               bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                Eliminar
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </AdminLayout>
    );
}
