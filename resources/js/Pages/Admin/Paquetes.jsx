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
            <div className="relative z-10 w-full max-w-xl bg-spa-surface border border-gold/20
                            rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
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

const BLANK = { nombre: '', descripcion: '', precio: '', fecha_inicio: '', fecha_fin: '', activo: true, servicios: [] };

function PaqueteForm({ form, servicios, onSubmit, onCancel, submitLabel }) {
    const precioOriginal = servicios
        .filter(s => form.data.servicios.includes(s.id))
        .reduce((acc, s) => acc + s.precio, 0);
    const ahorro = precioOriginal - (parseFloat(form.data.precio) || 0);

    function toggleServicio(id) {
        const sel = form.data.servicios.includes(id)
            ? form.data.servicios.filter(s => s !== id)
            : [...form.data.servicios, id];
        form.setData('servicios', sel);
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Nombre del paquete" error={form.errors.nombre}>
                <input value={form.data.nombre} onChange={e => form.setData('nombre', e.target.value)}
                       className={inputCls} placeholder="Ej: Pack Relajación Total" />
            </Field>

            <Field label="Descripción" error={form.errors.descripcion}>
                <textarea value={form.data.descripcion} rows={2}
                          onChange={e => form.setData('descripcion', e.target.value)}
                          className={inputCls} placeholder="Descripción breve del paquete..." />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha inicio" error={form.errors.fecha_inicio}>
                    <input type="date" value={form.data.fecha_inicio}
                           onChange={e => form.setData('fecha_inicio', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Fecha fin" error={form.errors.fecha_fin}>
                    <input type="date" value={form.data.fecha_fin}
                           onChange={e => form.setData('fecha_fin', e.target.value)} className={inputCls} />
                </Field>
            </div>

            <Field label="Servicios incluidos" error={form.errors.servicios}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    {servicios.map(s => {
                        const sel = form.data.servicios.includes(s.id);
                        return (
                            <button key={s.id} type="button" onClick={() => toggleServicio(s.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-left transition-all
                                                ${sel
                                                    ? 'border-gold/60 bg-gold/10 text-gold'
                                                    : 'border-gold/15 text-spa-on-dark-dim hover:border-gold/30'}`}>
                                <Icon name={sel ? 'check_box' : 'check_box_outline_blank'} className="text-[16px] shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-sans text-xs truncate">{s.nombre}</p>
                                    <p className="font-sans text-[9px] opacity-60">Bs {s.precio}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
                {form.data.servicios.length > 0 && (
                    <p className="font-sans text-[10px] text-spa-on-dark-dim mt-2">
                        Precio individual: <span className="text-spa-on-dark">Bs {precioOriginal.toFixed(2)}</span>
                    </p>
                )}
            </Field>

            <div className="grid grid-cols-2 gap-4 items-end">
                <Field label="Precio del paquete (Bs)" error={form.errors.precio}>
                    <input type="number" step="0.01" min="0" value={form.data.precio}
                           onChange={e => form.setData('precio', e.target.value)}
                           className={inputCls} placeholder="0.00" />
                </Field>
                {ahorro > 0 && (
                    <div className="pb-0.5">
                        <p className="font-sans text-[10px] text-green-400 flex items-center gap-1">
                            <Icon name="savings" className="text-[14px]" />
                            Ahorro del cliente: Bs {ahorro.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            <Field label="Estado">
                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input type="checkbox" checked={form.data.activo}
                           onChange={e => form.setData('activo', e.target.checked)}
                           className="w-4 h-4 accent-gold" />
                    <span className="font-sans text-sm text-spa-on-dark">Activo (visible para clientes en fecha)</span>
                </label>
            </Field>

            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel}
                        className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                    Cancelar
                </button>
                <button type="submit" disabled={form.processing}
                        className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                    {form.processing ? 'Guardando...' : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default function Paquetes({ paquetes, servicios }) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [confirmDel, setConfirmDel] = useState(null);

    const createForm = useForm(BLANK);
    const editForm   = useForm(BLANK);

    function openEdit(p) {
        setEditTarget(p);
        editForm.setData({
            nombre:       p.nombre,
            descripcion:  p.descripcion ?? '',
            precio:       p.precio,
            fecha_inicio: p.fecha_inicio,
            fecha_fin:    p.fecha_fin,
            activo:       p.activo,
            servicios:    p.servicios.map(s => s.id),
        });
    }

    function submitCreate(e) {
        e.preventDefault();
        createForm.post(route('admin.paquetes.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    }

    function submitEdit(e) {
        e.preventDefault();
        editForm.patch(route('admin.paquetes.update', editTarget.id), {
            onSuccess: () => setEditTarget(null),
        });
    }

    const vigentes  = paquetes.filter(p => p.vigente);
    const proximos  = paquetes.filter(p => !p.vigente && new Date(p.fecha_inicio) > new Date());
    const vencidos  = paquetes.filter(p => !p.vigente && new Date(p.fecha_fin) < new Date());

    function StatusBadge({ p }) {
        if (p.vigente)                              return <span className="badge-vigente">Vigente</span>;
        if (new Date(p.fecha_inicio) > new Date())  return <span className="badge-proximo">Próximo</span>;
        return <span className="badge-vencido">Vencido</span>;
    }

    const badgeCls = "inline-flex items-center px-2 py-0.5 rounded-full font-sans text-[8px] uppercase tracking-wider";

    return (
        <AdminLayout title="Paquetes">
            <Head title="Paquetes — Admin" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Paquetes & Promociones</h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {vigentes.length} vigentes · {proximos.length} próximos · {vencidos.length} vencidos
                    </p>
                </div>
                <button onClick={() => setCreateOpen(true)}
                        className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all">
                    <Icon name="add" className="text-[16px]" />
                    Nuevo Paquete
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Vigentes',  value: vigentes.length,  icon: 'local_offer',  color: 'text-green-400'  },
                    { label: 'Próximos',  value: proximos.length,  icon: 'schedule',     color: 'text-blue-400'   },
                    { label: 'Vencidos',  value: vencidos.length,  icon: 'event_busy',   color: 'text-gray-400'   },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} className="kpi-card text-center">
                        <Icon name={icon} className={`${color} text-[22px] mb-2`} />
                        <p className="font-serif text-3xl gold-gradient-text">{value}</p>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="kpi-card overflow-hidden p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gold/10">
                            {['Paquete', 'Servicios', 'Precio', 'Período', 'Estado', ''].map(h => (
                                <th key={h} className="px-5 py-3.5 text-left font-sans text-[9px] uppercase tracking-[0.2em] text-spa-on-light-dim dark:text-gold/40">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paquetes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-14 text-center font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                                    No hay paquetes creados aún.
                                </td>
                            </tr>
                        ) : paquetes.map((p, i) => (
                            <tr key={p.id} className={`border-b border-gold/5 hover:bg-gold/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                {/* Nombre */}
                                <td className="px-5 py-4 max-w-[200px]">
                                    <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">{p.nombre}</p>
                                    {p.descripcion && (
                                        <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5 truncate max-w-[180px]">
                                            {p.descripcion}
                                        </p>
                                    )}
                                </td>
                                {/* Servicios */}
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {p.servicios.map(s => (
                                            <span key={s.id} className="px-2 py-0.5 bg-gold/10 text-gold-mid dark:text-gold font-sans text-[9px] rounded-full">
                                                {s.nombre}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                {/* Precio */}
                                <td className="px-5 py-4">
                                    <p className="font-serif text-lg gold-gradient-text">Bs {p.precio.toFixed(2)}</p>
                                    {p.servicios.length > 0 && (() => {
                                        const orig   = p.servicios.reduce((a, s) => a + s.precio, 0);
                                        const ahorro = orig - p.precio;
                                        return ahorro > 0 ? (
                                            <p className="font-sans text-[9px] text-green-400 mt-0.5">
                                                Ahorra Bs {ahorro.toFixed(2)}
                                            </p>
                                        ) : null;
                                    })()}
                                </td>
                                {/* Período */}
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <p className="font-sans text-xs text-spa-on-light dark:text-spa-on-dark">{p.fecha_inicio}</p>
                                    <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">→ {p.fecha_fin}</p>
                                </td>
                                {/* Estado */}
                                <td className="px-5 py-4">
                                    {p.vigente ? (
                                        <span className={`${badgeCls} bg-green-400/10 text-green-400`}>Vigente</span>
                                    ) : new Date(p.fecha_inicio) > new Date() ? (
                                        <span className={`${badgeCls} bg-blue-400/10 text-blue-400`}>Próximo</span>
                                    ) : (
                                        <span className={`${badgeCls} bg-gray-400/10 text-gray-400`}>Vencido</span>
                                    )}
                                </td>
                                {/* Acciones */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(p)}
                                                className="p-1.5 text-spa-on-dark-dim hover:text-gold transition-colors rounded-sm hover:bg-gold/10">
                                            <Icon name="edit" className="text-[16px]" />
                                        </button>
                                        <button onClick={() => setConfirmDel(p)}
                                                className="p-1.5 text-spa-on-dark-dim hover:text-red-400 transition-colors rounded-sm hover:bg-red-400/10">
                                            <Icon name="delete" className="text-[16px]" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal crear */}
            <Modal open={createOpen} onClose={() => { setCreateOpen(false); createForm.reset(); }} title="Nuevo Paquete">
                <PaqueteForm form={createForm} servicios={servicios}
                             onSubmit={submitCreate} onCancel={() => { setCreateOpen(false); createForm.reset(); }}
                             submitLabel="Crear Paquete" />
            </Modal>

            {/* Modal editar */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Paquete">
                {editTarget && (
                    <PaqueteForm form={editForm} servicios={servicios}
                                 onSubmit={submitEdit} onCancel={() => setEditTarget(null)}
                                 submitLabel="Guardar cambios" />
                )}
            </Modal>

            {/* Modal confirmar eliminar */}
            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Eliminar Paquete">
                <p className="font-sans text-sm text-spa-on-dark mb-2">
                    ¿Eliminar el paquete <span className="text-gold font-medium">"{confirmDel?.nombre}"</span>?
                </p>
                <p className="font-sans text-xs text-spa-on-dark-dim mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDel(null)}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                        Cancelar
                    </button>
                    <button onClick={() => router.delete(route('admin.paquetes.destroy', confirmDel.id), { onSuccess: () => setConfirmDel(null) })}
                            className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
