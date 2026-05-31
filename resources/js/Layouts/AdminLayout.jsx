import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import FlashToast from '@/Components/FlashToast';

const NAV = [
    { label: 'Dashboard',    icon: 'dashboard',     route: 'admin.dashboard'          },
    { label: 'Citas',        icon: 'event',         route: 'admin.citas.index'        },
    { label: 'Servicios',    icon: 'auto_awesome',  route: 'admin.servicios.index'    },
    { label: 'Categorías',   icon: 'category',      route: 'admin.categorias.index'   },
    { label: 'Paquetes',     icon: 'local_offer',   route: 'admin.paquetes.index'     },
    { label: 'Solicitudes',  icon: 'inbox',         route: 'admin.solicitudes.index', badge: true },
    { label: 'Especialistas',icon: 'groups',        route: 'admin.especialistas.index'},
    { label: 'Clientes',     icon: 'person',        route: 'admin.clientes.index'     },
];

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function AdminLayout({ children, title = '' }) {
    const { auth, solicitudesPendientes, notificacionesAdmin } = usePage().props;
    const { dark, toggle } = useTheme();
    const currentRoute = route().current();

    const [bellOpen, setBellOpen] = useState(false);
    const bellRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setBellOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
        <div className="flex min-h-screen bg-spa-ivory dark:bg-spa-bg">

            {/* ── Sidebar (always dark) ── */}
            <aside className="w-[260px] h-screen fixed left-0 top-0 bg-spa-surface z-50 flex flex-col
                              border-r border-gold/10 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">

                {/* Brand */}
                <div className="px-6 pt-8 pb-6 border-b border-gold/10">
                    <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                         className="h-7 mb-2 drop-shadow-[0_1px_4px_rgba(232,193,127,0.25)]" />
                    <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                         className="h-7 mb-3 drop-shadow-[0_1px_4px_rgba(232,193,127,0.25)]" />
                    <p className="font-sans text-[9px] text-gold/50 tracking-[0.35em] uppercase">
                        Management Portal
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {NAV.map(({ label, icon, route: r, badge }) => {
                        const isActive = r && (currentRoute === r || currentRoute?.startsWith(r.replace('.index', '')));
                        const Tag = r ? Link : 'a';
                        const props = r ? { href: route(r) } : { href: '#' };
                        const pendCount = badge ? (solicitudesPendientes ?? 0) : 0;
                        return (
                            <Tag key={label} {...props}
                                className={`nav-item ${isActive ? 'active' : ''}`}>
                                <Icon name={icon} className="text-[20px]" />
                                <span className="flex-1">{label}</span>
                                {badge && pendCount > 0 && (
                                    <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-gold
                                                       text-[9px] font-bold text-spa-bg flex items-center justify-center">
                                        {pendCount}
                                    </span>
                                )}
                            </Tag>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-4 pb-6 space-y-3 border-t border-gold/10 pt-4">
                    <button
                        className="w-full gold-gradient shimmer-btn py-3 px-4 rounded-sm
                                   font-sans text-[10px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text transition-all">
                        <Icon name="add" className="text-[16px] mr-2 align-middle" />
                        Nueva Cita
                    </button>

                    {/* User info */}
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center
                                        font-sans text-[11px] font-bold text-gold-text shrink-0">
                            {auth?.user?.nombre?.charAt(0) ?? 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-spa-on-dark font-medium truncate">
                                {auth?.user?.nombre ?? 'Admin'}
                            </p>
                            <p className="text-[9px] text-gold/60 uppercase tracking-widest truncate">
                                {auth?.user?.rol ?? 'ADMIN'}
                            </p>
                        </div>
                        <Link href={route('logout')} method="post" as="button"
                              className="text-spa-on-dark-dim hover:text-gold transition-colors">
                            <Icon name="logout" className="text-[18px]" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="ml-[260px] flex-1 flex flex-col min-h-screen">

                {/* Top bar */}
                <header className="sticky top-0 z-40 h-16 px-8 flex items-center justify-between
                                   bg-white/80 dark:bg-spa-surface-low/80 backdrop-blur-xl
                                   border-b border-spa-border dark:border-gold/10">
                    <div>
                        {title && (
                            <h1 className="font-serif text-xl text-spa-on-light dark:text-gold italic">
                                {title}
                            </h1>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notificaciones */}
                        <div className="relative" ref={bellRef}>
                            <button
                                onClick={() => setBellOpen(o => !o)}
                                className="relative text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold-mid transition-colors"
                            >
                                <Icon name="notifications" className="text-[22px]" />
                                {notificacionesAdmin?.total > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />
                                )}
                            </button>

                            {bellOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-spa-surface border border-spa-border dark:border-gold/20 rounded-sm shadow-xl z-50">
                                    <div className="px-4 py-3 border-b border-spa-border dark:border-gold/10">
                                        <p className="font-sans text-[11px] uppercase tracking-widest text-gold">
                                            Notificaciones
                                            {notificacionesAdmin?.total > 0 && (
                                                <span className="ml-2 text-[9px] bg-gold text-spa-bg px-1.5 py-0.5 rounded-full font-bold">
                                                    {notificacionesAdmin.total}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="max-h-72 overflow-y-auto divide-y divide-spa-border dark:divide-gold/10">
                                        {notificacionesAdmin?.items?.length > 0 ? (
                                            notificacionesAdmin.items.map((item, i) => (
                                                <div key={i} className="px-4 py-3 hover:bg-spa-ivory dark:hover:bg-spa-surface-low transition-colors">
                                                    <div className="flex items-start gap-2">
                                                        <Icon
                                                            name={item.tipo === 'solicitud' ? 'inbox' : 'event'}
                                                            className="text-[15px] text-gold mt-0.5 shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[12px] text-spa-on-light dark:text-spa-on-dark leading-snug">
                                                                {item.texto}
                                                            </p>
                                                            <p className="text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                                                {item.hace}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-6 text-center text-[12px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                Sin notificaciones pendientes
                                            </div>
                                        )}
                                    </div>

                                    {notificacionesAdmin?.items?.length > 0 && (
                                        <div className="px-4 py-2.5 border-t border-spa-border dark:border-gold/10 flex gap-4">
                                            <Link
                                                href={route('admin.solicitudes.index')}
                                                className="text-[10px] text-gold hover:text-gold-mid uppercase tracking-widest transition-colors"
                                                onClick={() => setBellOpen(false)}
                                            >
                                                Ver solicitudes →
                                            </Link>
                                            <Link
                                                href={route('admin.citas.index')}
                                                className="text-[10px] text-gold hover:text-gold-mid uppercase tracking-widest transition-colors"
                                                onClick={() => setBellOpen(false)}
                                            >
                                                Ver citas →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Toggle dark/light */}
                        <button onClick={toggle}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                           border border-spa-border dark:border-gold/20
                                           text-spa-on-light-dim dark:text-gold/70
                                           hover:border-gold/50 transition-all
                                           font-sans text-[10px] uppercase tracking-widest">
                            <Icon name={dark ? 'light_mode' : 'dark_mode'} className="text-[15px]" />
                            {dark ? 'Light' : 'Dark'}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-8 bg-spa-ivory dark:bg-spa-bg">
                    {children}
                </main>
            </div>
        </div>
        <FlashToast />
        </>
    );
}
