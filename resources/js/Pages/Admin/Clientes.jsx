import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';

function desbloquear(usuarioId) {
    router.post(route('admin.clientes.desbloquear', usuarioId));
}

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

function ModalRegistrarCliente({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        correo: '',
        telefono: '',
        fecha_nacimiento: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.clientes.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="bg-spa-ivory dark:bg-spa-surface border border-gold/20 w-full max-w-md shadow-2xl">
                {/* Header modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
                    <div>
                        <h3 className="font-serif text-xl text-gold-mid dark:text-gold italic">Registrar cliente</h3>
                        <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                            La contraseña inicial será el número de teléfono
                        </p>
                    </div>
                    <button onClick={onClose}
                            className="text-spa-on-light-dim dark:text-gold/40 hover:text-gold transition-colors">
                        <Icon name="close" />
                    </button>
                </div>

                <form onSubmit={submit} className="px-6 py-5 space-y-5">
                    {/* Nombre */}
                    <div>
                        <label className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-spa-on-dark-dim block mb-1">
                            Nombre completo
                        </label>
                        <div className="flex items-center gap-3">
                            <Icon name="person" className="text-gold/40 text-[18px]" />
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={e => setData('nombre', e.target.value)}
                                placeholder="Nombre del cliente"
                                className="flex-1 bg-white dark:bg-spa-bg border border-spa-border dark:border-gold/20
                                           px-3 py-2.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                           placeholder:text-spa-on-light-dim/40 dark:placeholder:text-spa-on-dark-dim/40
                                           focus:border-gold/50 focus:outline-none transition-colors rounded-sm"
                            />
                        </div>
                        <InputError message={errors.nombre} className="mt-1 text-xs" />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-spa-on-dark-dim block mb-1">
                            Correo electrónico
                        </label>
                        <div className="flex items-center gap-3">
                            <Icon name="mail" className="text-gold/40 text-[18px]" />
                            <input
                                type="email"
                                value={data.correo}
                                onChange={e => setData('correo', e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className="flex-1 bg-white dark:bg-spa-bg border border-spa-border dark:border-gold/20
                                           px-3 py-2.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                           placeholder:text-spa-on-light-dim/40 dark:placeholder:text-spa-on-dark-dim/40
                                           focus:border-gold/50 focus:outline-none transition-colors rounded-sm"
                            />
                        </div>
                        <InputError message={errors.correo} className="mt-1 text-xs" />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-spa-on-dark-dim block mb-1">
                            Teléfono <span className="normal-case tracking-normal opacity-50">(será la contraseña inicial)</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <Icon name="phone" className="text-gold/40 text-[18px]" />
                            <input
                                type="tel"
                                value={data.telefono}
                                onChange={e => setData('telefono', e.target.value)}
                                placeholder="+1 234 567 8900"
                                className="flex-1 bg-white dark:bg-spa-bg border border-spa-border dark:border-gold/20
                                           px-3 py-2.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                           placeholder:text-spa-on-light-dim/40 dark:placeholder:text-spa-on-dark-dim/40
                                           focus:border-gold/50 focus:outline-none transition-colors rounded-sm"
                            />
                        </div>
                        <InputError message={errors.telefono} className="mt-1 text-xs" />
                    </div>

                    {/* Fecha nacimiento */}
                    <div>
                        <label className="font-sans text-[10px] uppercase tracking-[0.25em] text-spa-on-light-dim dark:text-spa-on-dark-dim block mb-1">
                            Fecha de nacimiento <span className="normal-case tracking-normal opacity-50">(opcional)</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <Icon name="cake" className="text-gold/40 text-[18px]" />
                            <input
                                type="date"
                                value={data.fecha_nacimiento}
                                onChange={e => setData('fecha_nacimiento', e.target.value)}
                                className="flex-1 bg-white dark:bg-spa-bg border border-spa-border dark:border-gold/20
                                           px-3 py-2.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                           focus:border-gold/50 focus:outline-none transition-colors rounded-sm"
                            />
                        </div>
                        <InputError message={errors.fecha_nacimiento} className="mt-1 text-xs" />
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                                className="flex-1 py-3 border border-gold/20 font-sans text-[10px] uppercase tracking-widest
                                           text-spa-on-light-dim dark:text-gold/60 hover:border-gold/40 hover:text-gold
                                           transition-all rounded-sm">
                            Cancelar
                        </button>
                        <button type="submit" disabled={processing}
                                className="flex-1 gold-gradient py-3 font-sans text-[10px] uppercase tracking-widest
                                           font-semibold text-gold-text hover:brightness-110 transition-all
                                           disabled:opacity-60 rounded-sm">
                            {processing ? 'Registrando...' : 'Registrar →'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Clientes({ clientes, eliminados, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [showModal, setShowModal] = useState(false);
    const [showEliminados, setShowEliminados] = useState(false);

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('admin.clientes.index'), { search }, { preserveState: true, replace: true });
    }

    function clearSearch() {
        setSearch('');
        router.get(route('admin.clientes.index'), {}, { preserveState: false });
    }

    return (
        <AdminLayout title="Clientes">
            <Head title="Clientes — Admin" />

            {showModal && <ModalRegistrarCliente onClose={() => setShowModal(false)} />}

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Clientes</h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {clientes.length} registrados
                    </p>
                </div>
                <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 gold-gradient px-4 py-2.5 font-sans text-[10px]
                                   uppercase tracking-widest font-semibold text-gold-text rounded-sm
                                   hover:brightness-110 transition-all">
                    <Icon name="person_add" className="text-[16px]" />
                    Registrar cliente
                </button>
            </div>

            {/* KPI rápidos */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total clientes',   value: clientes.length,                                               icon: 'person' },
                    { label: 'Con citas',         value: clientes.filter(c => c.total_citas > 0).length,               icon: 'event_available' },
                    { label: 'Sin visitas',       value: clientes.filter(c => c.total_citas === 0).length,             icon: 'person_off' },
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

            {/* Buscador */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/40 text-[18px]" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                           placeholder="Buscar por nombre o correo..."
                           className="w-full bg-white dark:bg-spa-bg border border-spa-border dark:border-gold/20 rounded-sm
                                      pl-9 pr-4 py-2.5 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                      placeholder:text-spa-on-light-dim/50 dark:placeholder:text-spa-on-dark-dim/40
                                      focus:border-gold/50 focus:outline-none transition-colors" />
                </div>
                <button type="submit"
                        className="gold-gradient px-4 py-2.5 font-sans text-[10px] uppercase tracking-widest
                                   font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all">
                    Buscar
                </button>
                {filters.search && (
                    <button type="button" onClick={clearSearch}
                            className="px-4 py-2.5 font-sans text-[10px] uppercase tracking-widest border border-gold/20
                                       text-gold/60 hover:text-gold rounded-sm transition-all">
                        Limpiar
                    </button>
                )}
            </form>

            {/* Eliminados toggle */}
            {eliminados.length > 0 && (
                <button onClick={() => setShowEliminados(v => !v)}
                        className="flex items-center gap-2 mb-4 font-sans text-[10px] uppercase tracking-widest
                                   text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors">
                    <Icon name={showEliminados ? 'expand_less' : 'expand_more'} className="text-[16px]" />
                    {eliminados.length} cuenta{eliminados.length !== 1 ? 's' : ''} eliminada{eliminados.length !== 1 ? 's' : ''}
                </button>
            )}

            {/* Tabla eliminados */}
            {showEliminados && eliminados.length > 0 && (
                <div className="kpi-card overflow-hidden p-0 mb-6 border-red-400/20">
                    <div className="px-5 py-3 border-b border-red-400/10 flex items-center gap-2">
                        <Icon name="delete_history" className="text-red-400/60 text-[16px]" />
                        <span className="font-sans text-[10px] uppercase tracking-widest text-red-400/70">
                            Cuentas eliminadas
                        </span>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-red-400/10">
                                {['Cliente', 'Correo', 'Citas históricas', 'Eliminado el', ''].map(h => (
                                    <th key={h} className="px-5 py-3 text-left font-sans text-[9px] uppercase tracking-[0.2em] text-red-400/40">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {eliminados.map(c => (
                                <tr key={c.id} className="border-b border-red-400/5 hover:bg-red-400/5 transition-colors opacity-70 hover:opacity-100">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center
                                                            font-sans text-sm font-bold text-red-400/60 shrink-0">
                                                {c.nombre.charAt(0)}
                                            </div>
                                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim line-through">
                                                {c.nombre}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">{c.correo}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-serif text-base text-spa-on-light-dim dark:text-spa-on-dark-dim">{c.total_citas}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">{c.eliminado_en}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button onClick={() => router.post(route('admin.clientes.restore', c.id))}
                                                className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest
                                                           text-green-400 hover:text-green-300 transition-colors">
                                            <Icon name="restore" className="text-[15px]" />
                                            Restaurar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Tabla */}
            <div className="kpi-card overflow-hidden p-0">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gold/10">
                            {['Cliente', 'Correo', 'Teléfono', 'Total citas', 'Última visita', ''].map(h => (
                                <th key={h} className="px-5 py-3.5 text-left font-sans text-[9px] uppercase tracking-[0.2em] text-spa-on-light-dim dark:text-gold/40">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        ) : clientes.map((c, i) => (
                            <tr key={c.id}
                                className={`border-b border-gold/5 hover:bg-gold/5 transition-colors
                                            ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center
                                                        font-sans text-sm font-bold text-gold-text shrink-0">
                                            {c.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">
                                                {c.nombre}
                                            </p>
                                            {c.bloqueado && (
                                                <span className="inline-flex items-center gap-1 font-sans text-[9px] uppercase tracking-wider text-red-400">
                                                    <Icon name="lock" className="text-[11px]" />
                                                    Bloqueada
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">{c.correo}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {c.telefono ?? '—'}
                                    </p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-serif text-lg gold-gradient-text">{c.total_citas}</span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {c.ultima_visita}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <Link href={route('admin.clientes.show', c.id)}
                                              className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest
                                                         text-gold/60 hover:text-gold transition-colors">
                                            <Icon name="visibility" className="text-[15px]" />
                                            Ver
                                        </Link>
                                        {c.bloqueado && (
                                            <button onClick={() => desbloquear(c.usuario_id)}
                                                    className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest
                                                               text-red-400 hover:text-red-300 transition-colors">
                                                <Icon name="lock_open" className="text-[15px]" />
                                                Desbloquear
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
