import { Link, usePage, router } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import FlashToast from '@/Components/FlashToast';

const NAV_TOP = [
    { label: 'Inicio',    icon: 'home',       route: 'cliente.dashboard'    },
    { label: 'Reservar',  icon: 'add_circle', route: 'cliente.reservar.index' },
    { label: 'Mis Citas', icon: 'event',      route: 'cliente.citas.index'  },
    { label: 'Perfil',    icon: 'person',     route: 'profile.edit'         },
];

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function ClienteLayout({ children, title = '' }) {
    const { auth } = usePage().props;
    const { dark, toggle } = useTheme();
    const currentRoute = route().current();

    return (
        <>
        <div className="min-h-screen bg-spa-ivory dark:bg-spa-bg flex flex-col">

            {/* Top Navbar */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-spa-surface/90 backdrop-blur-xl
                               border-b border-spa-border dark:border-gold/10
                               shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href={route('cliente.dashboard')}
                          className="flex items-center gap-3">
                        {/* Mini gem SVG */}
                        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                            <polygon points="20,3 37,15 20,37 3,15"
                                     stroke="#c9a465" strokeWidth="1.5" fill="rgba(201,164,101,0.08)"/>
                            <polygon points="20,3 37,15 20,15 3,15"
                                     stroke="#c9a465" strokeWidth="1" fill="rgba(201,164,101,0.05)"/>
                        </svg>
                        <span className="font-serif text-gold-mid dark:text-gold text-lg tracking-wide">
                            Beauty Salon
                        </span>
                    </Link>

                    {/* Nav desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_TOP.map(({ label, icon, route: r }) => {
                            const isActive = r && (currentRoute === r || currentRoute?.startsWith(r.replace('.index', '')));
                            const Tag = r ? Link : 'a';
                            const props = r ? { href: route(r) } : { href: '#' };
                            return (
                                <Tag key={label} {...props}
                                     className={`flex items-center gap-1.5 px-4 py-2 rounded-full
                                                 font-sans text-[11px] uppercase tracking-[0.15em] font-medium
                                                 transition-all duration-200
                                                 ${isActive
                                                    ? 'text-gold-mid dark:text-gold bg-gold/10'
                                                    : 'text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold-mid dark:hover:text-gold'
                                                 }`}>
                                    <Icon name={icon} className="text-[16px]" />
                                    {label}
                                </Tag>
                            );
                        })}
                    </nav>

                    {/* Acciones derecha */}
                    <div className="flex items-center gap-3">
                        {/* Reservar rápido — CTA principal */}
                        <Link href={route('cliente.reservar.index')}
                              className="hidden md:flex gold-gradient shimmer-btn items-center gap-1.5
                                         px-4 py-2 rounded-full font-sans text-[10px] uppercase
                                         tracking-[0.2em] font-semibold text-gold-text
                                         transition-all hover:brightness-110">
                            <Icon name="add" className="text-[15px]" />
                            Reservar
                        </Link>

                        {/* Toggle tema */}
                        <button onClick={toggle}
                                className="p-2 rounded-full border border-spa-border dark:border-gold/20
                                           text-spa-on-light-dim dark:text-gold/60
                                           hover:border-gold/50 transition-all">
                            <Icon name={dark ? 'light_mode' : 'dark_mode'} className="text-[18px]" />
                        </button>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center
                                        font-sans text-xs font-bold text-gold-text cursor-pointer">
                            {auth?.user?.nombre?.charAt(0) ?? 'C'}
                        </div>

                        {/* Logout */}
                        <Link href={route('logout')} method="post" as="button"
                              className="text-spa-on-light-dim dark:text-spa-on-dark-dim
                                         hover:text-red-400 transition-colors">
                            <Icon name="logout" className="text-[20px]" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Page title (opcional) */}
            {title && (
                <div className="max-w-5xl mx-auto w-full px-6 pt-8">
                    <h1 className="font-serif text-3xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        {title}
                    </h1>
                </div>
            )}

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
                {children}
            </main>

            <FlashToast />

            {/* Bottom nav — móvil */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-50
                            bg-white/95 dark:bg-spa-surface/95 backdrop-blur-xl
                            border-t border-spa-border dark:border-gold/10">
                <div className="flex items-center justify-around h-16">
                    {NAV_TOP.map(({ label, icon, route: r }) => {
                        const isActive = r && (currentRoute === r || currentRoute?.startsWith(r.replace('.index', '')));
                        const Tag = r ? Link : 'a';
                        const props = r ? { href: route(r) } : { href: '#' };
                        return (
                            <Tag key={label} {...props}
                                 className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors
                                             ${isActive
                                                ? 'text-gold-mid dark:text-gold'
                                                : 'text-spa-on-light-dim dark:text-spa-on-dark-dim'
                                             }`}>
                                <Icon name={icon} className="text-[22px]" />
                                <span className="font-sans text-[9px] uppercase tracking-wider">{label}</span>
                            </Tag>
                        );
                    })}
                </div>
            </nav>
        </div>
        </>
    );
}
