import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function Clientes({ clientes, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

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

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">Clientes</h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {clientes.length} registrados
                    </p>
                </div>
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
                                        <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark">
                                            {c.nombre}
                                        </p>
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
                                    <Link href={route('admin.clientes.show', c.id)}
                                          className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-widest
                                                     text-gold/60 hover:text-gold transition-colors">
                                        <Icon name="visibility" className="text-[15px]" />
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
