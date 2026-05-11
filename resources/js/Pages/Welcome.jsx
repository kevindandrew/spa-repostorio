import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import Stars from '@/Components/Stars';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const SERVICIOS = [
    { icon: 'spa',                    titulo: 'Uñas',        desc: 'Manicura, pedicura, nail art y esmalte gel de larga duración.'              },
    { icon: 'face_retouching_natural', titulo: 'Facial',      desc: 'Limpiezas profundas, hidratación y peeling para una piel radiante.'          },
    { icon: 'self_improvement',        titulo: 'Relajación',  desc: 'Masajes suecos, piedras calientes y reflexología para liberar tensiones.'    },
    { icon: 'healing',                 titulo: 'Corporal',    desc: 'Exfoliaciones, envolturas de barro y tratamientos anticelulíticos.'          },
    { icon: 'content_cut',             titulo: 'Depilación',  desc: 'Depilación con cera e hilo para cejas, piernas, axilas y más.'              },
    { icon: 'brush',                   titulo: 'Maquillaje',  desc: 'Maquillaje artístico y social para ocasiones especiales.'                   },
];

const ESPECIALISTAS = [
    {
        inicial: 'M',
        logo: '/images/MARCELO%20BLANCO.png',
        alt: 'Marcelo Ruiz',
        rol: 'Masajista Especialista',
        bio: 'Especializado en masajes terapéuticos y técnicas de relajación profunda para el bienestar del cuerpo.',
    },
    {
        inicial: 'N',
        logo: '/images/NINFA%20BLANCO.png',
        alt: 'Ninfa Rodriguez',
        rol: 'Esteticista Profesional',
        bio: 'Tratamientos faciales, corporales y técnicas de belleza de vanguardia para realzar tu belleza natural.',
    },
    {
        inicial: 'D',
        logo: '/images/Recurso%205DIANA%20RUIZ%20LOGO2.png',
        alt: 'Diana Ruiz',
        rol: 'Artista de Maquillaje',
        bio: 'Maquillaje artístico y social de alta gama para quinceañeras, bodas y toda ocasión especial.',
    },
];

export default function Welcome({ resenas = [] }) {
    const { dark, toggle } = useTheme();

    return (
        <>
            <Head title="Bienvenidos — Spa Marcelo Ruiz & Ninfa Rodriguez" />

            <div className="bg-spa-ivory dark:bg-spa-bg text-spa-on-light dark:text-spa-on-dark min-h-screen font-sans">

                {/* ── Navbar ── */}
                <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 h-[68px]
                                bg-white/90 dark:bg-spa-bg/90 backdrop-blur-xl
                                border-b border-spa-border dark:border-gold/10">
                    <Link href={route('home')} className="flex flex-col gap-0.5">
                        <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                             className="h-[18px] brightness-0 dark:brightness-100" />
                        <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                             className="h-[18px] brightness-0 dark:brightness-100" />
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Toggle tema */}
                        <button onClick={toggle}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                           border border-spa-border dark:border-gold/20
                                           text-spa-on-light-dim dark:text-gold/60
                                           hover:border-gold/50 transition-all
                                           font-sans text-[10px] uppercase tracking-widest">
                            <Icon name={dark ? 'light_mode' : 'dark_mode'} className="text-[14px]" />
                            {dark ? 'Light' : 'Dark'}
                        </button>

                        <Link href={route('login')}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-sm
                                         gold-gradient shimmer-btn font-sans text-[10px]
                                         uppercase tracking-[0.2em] font-semibold text-gold-text
                                         hover:brightness-110 transition-all">
                            <Icon name="login" className="text-[15px]" />
                            Iniciar Sesión
                        </Link>
                    </div>
                </nav>

                {/* ── Hero (siempre oscuro — video de fondo) ── */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
                    <video
                        autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-35"
                        src="/images/LOGOS3.mp4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b
                                    from-[#0D0D0D]/70 via-[#0D0D0D]/20 to-[#0D0D0D] pointer-events-none" />
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,164,101,0.08) 0%, transparent 65%)' }} />

                    <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                        <p className="text-[10px] uppercase tracking-[0.45em] text-gold/50 mb-8">
                            Bienvenidos al
                        </p>

                        <div className="flex flex-col items-center gap-4 mb-8">
                            <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                                 className="h-11 drop-shadow-[0_2px_16px_rgba(232,193,127,0.5)]" />
                            <div className="flex items-center gap-4">
                                <span className="h-px w-14 bg-gold/25" />
                                <span className="text-gold/60 text-xs">✦</span>
                                <span className="h-px w-14 bg-gold/25" />
                            </div>
                            <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                                 className="h-11 drop-shadow-[0_2px_16px_rgba(232,193,127,0.5)]" />
                        </div>

                        <p className="font-serif italic text-white/50 text-lg leading-relaxed mb-12">
                            "Un refugio de belleza y bienestar diseñado para ti"
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={route('login')}
                                  className="flex items-center gap-2 px-8 py-4 rounded-sm
                                             gold-gradient shimmer-btn text-[11px]
                                             uppercase tracking-[0.25em] font-semibold text-gold-text
                                             hover:brightness-110 transition-all">
                                <Icon name="calendar_month" className="text-[16px]" />
                                Reservar una cita
                            </Link>
                            <a href="#servicios"
                               className="flex items-center gap-2 px-8 py-4 rounded-sm
                                          border border-gold/30 text-gold/70 text-[11px]
                                          uppercase tracking-[0.25em] font-semibold
                                          hover:border-gold/60 hover:text-gold transition-all">
                                Ver servicios
                                <Icon name="keyboard_arrow_down" className="text-[16px]" />
                            </a>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gold/30">Descubre</span>
                        <Icon name="keyboard_arrow_down" className="text-gold/30 text-[20px]" />
                    </div>
                </section>

                {/* ── Especialistas ── */}
                <section className="py-28 px-6 md:px-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60 dark:text-gold/50 mb-3">
                                Conoce a nuestro equipo
                            </p>
                            <h2 className="font-serif text-4xl text-spa-on-light dark:text-spa-on-dark font-normal mb-5">
                                Nuestros Especialistas
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                                <span className="text-gold/40 dark:text-gold/30 text-xs">✦</span>
                                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ESPECIALISTAS.map(e => (
                                <div key={e.alt}
                                     className="bezel-card bg-white dark:bg-transparent rounded-sm p-8 text-center
                                                hover:border-gold/50 transition-all group
                                                shadow-sm dark:shadow-none">
                                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center
                                                    font-sans text-2xl font-bold text-gold-text mx-auto mb-6
                                                    shadow-[0_0_20px_rgba(201,164,101,0.2)]">
                                        {e.inicial}
                                    </div>
                                    <img src={e.logo} alt={e.alt}
                                         className="h-7 mx-auto mb-3 brightness-0 dark:brightness-100
                                                    group-hover:drop-shadow-[0_0_8px_rgba(232,193,127,0.4)]
                                                    dark:group-hover:brightness-100 transition-all" />
                                    <p className="text-[10px] uppercase tracking-widest text-gold-mid dark:text-gold/40 mb-4">
                                        {e.rol}
                                    </p>
                                    <p className="text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed">
                                        {e.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Servicios ── */}
                <section id="servicios" className="py-28 px-6 md:px-10 bg-spa-border/30 dark:bg-spa-surface">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60 dark:text-gold/50 mb-3">
                                Todo lo que necesitas
                            </p>
                            <h2 className="font-serif text-4xl text-spa-on-light dark:text-spa-on-dark font-normal mb-5">
                                Nuestros Servicios
                            </h2>
                            <div className="flex items-center justify-center gap-4">
                                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                                <span className="text-gold/40 dark:text-gold/30 text-xs">✦</span>
                                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {SERVICIOS.map(s => (
                                <div key={s.titulo}
                                     className="bezel-card bg-white dark:bg-transparent rounded-sm p-6
                                                hover:border-gold/50 transition-all group
                                                shadow-sm dark:shadow-none">
                                    <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center mb-5
                                                    group-hover:bg-gold/15 transition-colors">
                                        <Icon name={s.icon} className="text-gold text-[22px]" />
                                    </div>
                                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-2">
                                        {s.titulo}
                                    </h3>
                                    <p className="text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Reseñas ── */}
                {resenas.length > 0 && (
                    <section className="py-28 px-6 md:px-10">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-16">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60 dark:text-gold/50 mb-3">
                                    Lo que dicen nuestros clientes
                                </p>
                                <h2 className="font-serif text-4xl text-spa-on-light dark:text-spa-on-dark font-normal mb-5">
                                    Reseñas
                                </h2>
                                <div className="flex items-center justify-center gap-4">
                                    <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                                    <span className="text-gold/40 dark:text-gold/30 text-xs">✦</span>
                                    <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {resenas.map((r, i) => (
                                    <div key={i}
                                         className="bezel-card bg-white dark:bg-transparent rounded-sm p-6
                                                    flex flex-col gap-4 hover:border-gold/40 transition-all
                                                    shadow-sm dark:shadow-none">
                                        <Stars value={r.calificacion} size="text-[18px]" />
                                        <p className="font-serif italic text-spa-on-light-dim dark:text-spa-on-dark-dim/70
                                                       text-base leading-relaxed flex-1">
                                            "{r.comentario}"
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest text-gold-mid/60 dark:text-gold/30 mt-auto">
                                            {r.fecha}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── CTA ── */}
                <section className="py-36 px-6 text-center relative overflow-hidden
                                    bg-spa-border/30 dark:bg-transparent">
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,164,101,0.07) 0%, transparent 65%)' }} />
                    <div className="relative z-10 max-w-lg mx-auto">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 dark:text-gold/50 mb-5">
                            Tu momento de bienestar
                        </p>
                        <h2 className="font-serif text-5xl text-spa-on-light dark:text-spa-on-dark font-normal mb-5 leading-tight">
                            Reserva tu cita{' '}
                            <span className="gold-gradient-text italic">hoy</span>
                        </h2>
                        <p className="text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed mb-12 max-w-sm mx-auto">
                            Elige tu especialista, selecciona el servicio que deseas y reserva en minutos desde tu portal de cliente.
                        </p>
                        <Link href={route('login')}
                              className="inline-flex items-center gap-2 px-10 py-4 rounded-sm
                                         gold-gradient shimmer-btn text-[11px]
                                         uppercase tracking-[0.25em] font-semibold text-gold-text
                                         hover:brightness-110 transition-all
                                         shadow-[0_4px_24px_rgba(201,164,101,0.25)]">
                            <Icon name="event_available" className="text-[16px]" />
                            Comenzar ahora
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="bg-spa-border/40 dark:bg-spa-surface
                                   border-t border-spa-border dark:border-gold/10
                                   py-10 px-6 md:px-10">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col gap-2.5">
                            <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                                 className="h-6 brightness-0 dark:brightness-100" />
                            <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                                 className="h-6 brightness-0 dark:brightness-100" />
                            <img src="/images/Recurso%205DIANA%20RUIZ%20LOGO2.png" alt="Diana Ruiz"
                                 className="h-5 brightness-0 dark:brightness-100" />
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-[10px] text-spa-on-light-dim/40 dark:text-gold/25 uppercase tracking-widest">
                                © {new Date().getFullYear()} Spa Marcelo Ruiz &amp; Ninfa Rodriguez
                            </p>
                            <p className="text-[10px] text-spa-on-light-dim/30 dark:text-spa-on-dark-dim/25 mt-1 tracking-wider">
                                Todos los derechos reservados
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
