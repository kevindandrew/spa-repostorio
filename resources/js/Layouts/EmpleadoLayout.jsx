import { Link, usePage } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import FlashToast from '@/Components/FlashToast';

const NAV = [
    { label: 'Inicio',        icon: 'dashboard', route: 'empleado.dashboard'           },
    { label: 'Mis Citas',     icon: 'event',     route: 'empleado.citas.index'         },
    { label: 'Disponibilidad',icon: 'schedule',  route: 'empleado.disponibilidad.index'},
    { label: 'Mi Perfil',     icon: 'person',    route: 'profile.edit'                 },
];

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function EmpleadoLayout({ children, title = '' }) {
    const { auth } = usePage().props;
    const { dark, toggle } = useTheme();
    const currentRoute = route().current();

    return (
        <>
        <div className="flex min-h-screen bg-spa-ivory dark:bg-spa-bg">

            {/* Sidebar — siempre oscuro */}
            <aside className="w-[240px] h-screen fixed left-0 top-0 bg-spa-surface z-50 flex flex-col
                              border-r border-gold/10 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">

                {/* Brand */}
                <div className="px-6 pt-8 pb-6 border-b border-gold/10">
                    <p className="font-serif text-gold text-lg font-normal tracking-wider">
                        Beauty Salon
                    </p>
                    <p className="font-sans text-[9px] text-gold/50 tracking-[0.3em] uppercase mt-1">
                        Portal Especialista
                    </p>
                </div>

                {/* Perfil empleado */}
                <div className="px-6 py-5 border-b border-gold/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center
                                        font-sans text-sm font-bold text-gold-text shrink-0">
                            {auth?.user?.nombre?.charAt(0) ?? 'E'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-spa-on-dark font-medium truncate">
                                {auth?.user?.nombre ?? 'Empleado'}
                            </p>
                            <p className="text-[9px] text-gold/60 uppercase tracking-widest">
                                Especialista
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-5 space-y-1">
                    {NAV.map(({ label, icon, route: r }) => {
                        const isActive = r && (currentRoute === r || currentRoute?.startsWith(r.replace('.index', '')));
                        const Tag = r ? Link : 'a';
                        const props = r ? { href: route(r) } : { href: '#' };
                        return (
                            <Tag key={label} {...props}
                                 className={`nav-item ${isActive ? 'active' : ''}`}>
                                <Icon name={icon} className="text-[20px]" />
                                <span>{label}</span>
                            </Tag>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 pb-6 pt-4 border-t border-gold/10">
                    <Link href={route('logout')} method="post" as="button"
                          className="nav-item w-full hover:text-red-400">
                        <Icon name="logout" className="text-[20px]" />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="ml-[240px] flex-1 flex flex-col">

                {/* Top bar */}
                <header className="sticky top-0 z-40 h-16 px-8 flex items-center justify-between
                                   bg-white/80 dark:bg-spa-surface-low/80 backdrop-blur-xl
                                   border-b border-spa-border dark:border-gold/10">
                    <h1 className="font-serif text-xl italic text-spa-on-light dark:text-gold">
                        {title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <button className="relative text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold-mid transition-colors">
                            <Icon name="notifications" className="text-[22px]" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gold rounded-full" />
                        </button>

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

                <main className="flex-1 p-8 bg-spa-ivory dark:bg-spa-bg">
                    {children}
                </main>
            </div>
        </div>
        <FlashToast />
        </>
    );
}
