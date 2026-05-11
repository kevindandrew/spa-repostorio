import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
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

function SectionTitle({ tag, title }) {
    return (
        <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/60 dark:text-gold/50 mb-3">{tag}</p>
            <h2 className="font-serif text-4xl text-spa-on-light dark:text-spa-on-dark font-normal mb-5">{title}</h2>
            <div className="flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
                <span className="text-gold/40 dark:text-gold/30 text-xs">✦</span>
                <span className="h-px w-16 bg-gold/20 dark:bg-gold/15" />
            </div>
        </div>
    );
}

function VideoCard({ src, titulo }) {
    const ref = useRef();
    return (
        <div className="relative overflow-hidden rounded-sm aspect-[9/16] cursor-pointer group"
             onMouseEnter={() => ref.current?.play()}
             onMouseLeave={() => { if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; } }}>
            <video ref={ref} src={src} muted loop playsInline
                   className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center
                            opacity-70 group-hover:opacity-0 transition-opacity duration-300">
                <Icon name="play_circle" className="text-white/70 text-[44px]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/90">{titulo}</p>
            </div>
        </div>
    );
}

const SERVICIOS = [
    { icon: 'spa',                    titulo: 'Uñas',       desc: 'Manicura, pedicura, nail art y esmalte gel de larga duración.'            },
    { icon: 'face_retouching_natural', titulo: 'Facial',     desc: 'Limpiezas profundas, hidratación y peeling para una piel radiante.'        },
    { icon: 'self_improvement',        titulo: 'Relajación', desc: 'Masajes suecos, piedras calientes y reflexología para liberar tensiones.'  },
    { icon: 'healing',                 titulo: 'Corporal',   desc: 'Exfoliaciones, envolturas de barro y tratamientos anticelulíticos.'        },
    { icon: 'content_cut',             titulo: 'Depilación', desc: 'Depilación con cera e hilo para cejas, piernas, axilas y más.'            },
    { icon: 'brush',                   titulo: 'Maquillaje', desc: 'Maquillaje artístico y social para toda ocasión especial.'                },
];

const ESPECIALISTAS = [
    { inicial: 'M', logo: '/images/MARCELO%20BLANCO.png',             alt: 'Marcelo Ruiz',    rol: 'Masajista Especialista',    bio: 'Especializado en masajes terapéuticos y técnicas de relajación profunda para el bienestar del cuerpo.' },
    { inicial: 'N', logo: '/images/NINFA%20BLANCO.png',               alt: 'Ninfa Rodriguez', rol: 'Esteticista Profesional',   bio: 'Tratamientos faciales, corporales y técnicas de belleza de vanguardia para realzar tu belleza natural.' },
    { inicial: 'D', logo: '/images/Recurso%205DIANA%20RUIZ%20LOGO2.png', alt: 'Diana Ruiz',  rol: 'Artista de Maquillaje',     bio: 'Maquillaje artístico y social de alta gama para quinceañeras, bodas y toda ocasión especial.' },
];

const EVENTOS = [
    { img: '/landing/img/novias.jpg',   titulo: 'Novias',           desc: 'Tu día más especial merece el mejor look.'              },
    { img: '/landing/img/xv.jpg',       titulo: 'Quinceañeras',     desc: 'Un momento único que recordarás toda la vida.'          },
    { img: '/landing/img/bautizos.jpg', titulo: 'Bautizos',         desc: 'Celebra con elegancia y estilo.'                        },
    { img: '/landing/img/gra.jpg',      titulo: 'Graduaciones',     desc: 'Luce espectacular en tu logro más importante.'          },
    { img: '/landing/img/bodas.jpg',    titulo: 'Bodas',            desc: 'Paquetes completos para novias y cortejo.'              },
    { img: '/landing/img/social.jpg',   titulo: 'Eventos Sociales', desc: 'Maquillaje y peinado para toda ocasión.'                },
];

const VIDEOS = [
    { src: '/landing/mp4/novia.mp4',    titulo: 'Look de Novia'       },
    { src: '/landing/mp4/tintes.mp4',   titulo: 'Tintes & Color'      },
    { src: '/landing/mp4/quince.mp4',   titulo: 'Quinceañeras'        },
    { src: '/landing/mp4/folklore.mp4', titulo: 'Maquillaje Folklore' },
    { src: '/landing/mp4/ncorte.mp4',   titulo: 'Corte & Estilo'      },
    { src: '/landing/mp4/paquete.mp4',  titulo: 'Paquetes Especiales' },
];

const GALERIA = [
    '/landing/img/portada.jpg',
    '/landing/img/IMG_9865.PNG',
    '/landing/img/img13.jpg',
    '/landing/img/IMG_9867.PNG',
    '/landing/img/IMG_8076.JPG.jpeg',
    '/landing/img/novia2.jpg',
    '/landing/img/barber.jpg',
    '/landing/img/lmg6.jpg',
    '/landing/img/mrt45.jpg',
    '/landing/img/pasa.jpg',
    '/landing/img/xv2.jpg',
    '/landing/img/IMG_8973.JPG.jpeg',
];

const HORARIO = [
    { dia: 'Lunes',     horas: '9:00 a.m. – 8:00 p.m.' },
    { dia: 'Martes',    horas: '9:00 a.m. – 8:00 p.m.' },
    { dia: 'Miércoles', horas: '9:00 a.m. – 8:00 p.m.' },
    { dia: 'Jueves',    horas: '9:00 a.m. – 8:00 p.m.' },
    { dia: 'Viernes',   horas: '9:00 a.m. – 8:00 p.m.' },
    { dia: 'Sábado',    horas: '8:00 a.m. – 6:00 p.m.' },
    { dia: 'Domingo',   horas: 'Cerrado',                cerrado: true },
];

const VALORES = [
    { icon: 'verified',           titulo: 'Calidad',          desc: 'Productos y técnicas de primera línea.' },
    { icon: 'handshake',          titulo: 'Compromiso',        desc: 'Dedicación total a tu satisfacción.'    },
    { icon: 'lightbulb',          titulo: 'Innovación',        desc: 'A la vanguardia de las tendencias.'     },
    { icon: 'workspace_premium',  titulo: 'Profesionalismo',   desc: 'Equipo certificado y con experiencia.'  },
    { icon: 'favorite',           titulo: 'Personalización',   desc: 'Cada servicio adaptado a ti.'           },
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
                    {/* Logo */}
                    <Link href={route('home')} className="flex flex-col gap-0.5 shrink-0">
                        <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                             className="h-[18px] brightness-0 dark:brightness-100" />
                        <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                             className="h-[18px] brightness-0 dark:brightness-100" />
                    </Link>

                    {/* Nav links — centro */}
                    <div className="hidden lg:flex items-center gap-6">
                        {[
                            { href: '#galeria',   label: 'Galería'  },
                            { href: '#servicios', label: 'Servicios'},
                            { href: '#eventos',   label: 'Eventos'  },
                            { href: '#nosotros',  label: 'Nosotros' },
                            { href: '#contacto',  label: 'Contacto' },
                        ].map(n => (
                            <a key={n.href} href={n.href}
                               className="font-sans text-[10px] uppercase tracking-[0.18em]
                                          text-spa-on-light-dim dark:text-spa-on-dark-dim
                                          hover:text-gold dark:hover:text-gold transition-colors">
                                {n.label}
                            </a>
                        ))}
                    </div>

                    {/* Acciones — derecha */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Redes sociales */}
                        <div className="hidden md:flex items-center gap-0.5 mr-1">
                            <a href="https://www.instagram.com/marceloruizoficial/" target="_blank" rel="noopener noreferrer"
                               title="Instagram"
                               className="p-1.5 text-spa-on-light-dim/40 dark:text-gold/30 hover:text-gold transition-colors">
                                <Icon name="photo_camera" className="text-[16px]" />
                            </a>
                            <a href="https://www.tiktok.com/@marceloruizoficial" target="_blank" rel="noopener noreferrer"
                               title="TikTok"
                               className="p-1.5 text-spa-on-light-dim/40 dark:text-gold/30 hover:text-gold transition-colors">
                                <Icon name="play_circle" className="text-[16px]" />
                            </a>
                            <a href="https://www.facebook.com/marceloninfaruiz/?locale=es_LA" target="_blank" rel="noopener noreferrer"
                               title="Facebook"
                               className="p-1.5 text-spa-on-light-dim/40 dark:text-gold/30 hover:text-gold transition-colors">
                                <Icon name="thumb_up" className="text-[16px]" />
                            </a>
                        </div>

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

                {/* ── Hero (siempre oscuro) ── */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
                    <video autoPlay muted loop playsInline
                           className="absolute inset-0 w-full h-full object-cover opacity-35"
                           src="/images/LOGOS3.mp4" />
                    <div className="absolute inset-0 bg-gradient-to-b
                                    from-[#0D0D0D]/70 via-[#0D0D0D]/20 to-[#0D0D0D] pointer-events-none" />
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,164,101,0.09) 0%, transparent 65%)' }} />

                    <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                        <p className="text-[10px] uppercase tracking-[0.45em] text-gold/50 mb-8">Bienvenidos al</p>

                        <div className="flex flex-col items-center gap-4 mb-6">
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

                        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/40 mb-4">
                            Belleza · Cosmética · Bienestar
                        </p>
                        <p className="font-serif italic text-white/50 text-lg leading-relaxed mb-12">
                            "Te ayudamos a brillar cada día"
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
                            <a href="#galeria"
                               className="flex items-center gap-2 px-8 py-4 rounded-sm
                                          border border-gold/30 text-gold/70 text-[11px]
                                          uppercase tracking-[0.25em] font-semibold
                                          hover:border-gold/60 hover:text-gold transition-all">
                                Ver galería
                                <Icon name="keyboard_arrow_down" className="text-[16px]" />
                            </a>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gold/30">Descubre</span>
                        <Icon name="keyboard_arrow_down" className="text-gold/30 text-[20px]" />
                    </div>
                </section>

                {/* ── Galería ── */}
                <section id="galeria" className="py-28 px-6 md:px-10 scroll-mt-[68px]">
                    <div className="max-w-6xl mx-auto">
                        <SectionTitle tag="Nuestro trabajo" title="Galería" />
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
                            {GALERIA.map((src, i) => (
                                <div key={i} className="break-inside-avoid mb-3 overflow-hidden rounded-sm">
                                    <img src={src} alt={`Galería ${i + 1}`}
                                         className="w-full hover:scale-105 transition-transform duration-700 block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Videos de Servicios ── */}
                <section id="videos" className="py-28 px-6 md:px-10 bg-spa-border/30 dark:bg-spa-surface scroll-mt-[68px]">
                    <div className="max-w-6xl mx-auto">
                        <SectionTitle tag="En acción" title="Nuestros Trabajos" />
                        <p className="text-center text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim/50 -mt-10 mb-12">
                            Pasa el cursor sobre cada video para reproducirlo
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {VIDEOS.map(v => <VideoCard key={v.src} src={v.src} titulo={v.titulo} />)}
                        </div>
                    </div>
                </section>

                {/* ── Eventos Especiales ── */}
                <section id="eventos" className="py-28 px-6 md:px-10 scroll-mt-[68px]">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle tag="Para tus momentos únicos" title="Eventos Especiales" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {EVENTOS.map(e => (
                                <div key={e.titulo}
                                     className="group relative overflow-hidden rounded-sm aspect-[4/5] cursor-pointer">
                                    <img src={e.img} alt={e.titulo}
                                         className="absolute inset-0 w-full h-full object-cover
                                                    group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/85 via-[#0D0D0D]/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="font-serif text-xl text-white mb-1">{e.titulo}</h3>
                                        <p className="text-[10px] text-white/60 uppercase tracking-widest">{e.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Servicios ── */}
                <section id="servicios" className="py-28 px-6 md:px-10 bg-spa-border/30 dark:bg-spa-surface scroll-mt-[68px]">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle tag="Todo lo que necesitas" title="Nuestros Servicios" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {SERVICIOS.map(s => (
                                <div key={s.titulo}
                                     className="bezel-card bg-white dark:bg-transparent rounded-sm p-6
                                                hover:border-gold/50 transition-all group shadow-sm dark:shadow-none">
                                    <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center mb-5
                                                    group-hover:bg-gold/15 transition-colors">
                                        <Icon name={s.icon} className="text-gold text-[22px]" />
                                    </div>
                                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-2">{s.titulo}</h3>
                                    <p className="text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Especialistas ── */}
                <section className="py-28 px-6 md:px-10">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle tag="Conoce a nuestro equipo" title="Nuestros Especialistas" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {ESPECIALISTAS.map(e => (
                                <div key={e.alt}
                                     className="bezel-card bg-white dark:bg-transparent rounded-sm p-8 text-center
                                                hover:border-gold/50 transition-all group shadow-sm dark:shadow-none">
                                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center
                                                    font-sans text-2xl font-bold text-gold-text mx-auto mb-6
                                                    shadow-[0_0_20px_rgba(201,164,101,0.2)]">
                                        {e.inicial}
                                    </div>
                                    <img src={e.logo} alt={e.alt}
                                         className="h-7 mx-auto mb-3 brightness-0 dark:brightness-100
                                                    group-hover:drop-shadow-[0_0_8px_rgba(232,193,127,0.4)]
                                                    dark:group-hover:brightness-100 transition-all" />
                                    <p className="text-[10px] uppercase tracking-widest text-gold-mid dark:text-gold/40 mb-4">{e.rol}</p>
                                    <p className="text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed">{e.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Reseñas ── */}
                {resenas.length > 0 && (
                    <section className="py-28 px-6 md:px-10 bg-spa-border/30 dark:bg-spa-surface">
                        <div className="max-w-5xl mx-auto">
                            <SectionTitle tag="Lo que dicen nuestros clientes" title="Reseñas" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {resenas.map((r, i) => (
                                    <div key={i}
                                         className="bezel-card bg-white dark:bg-transparent rounded-sm p-6
                                                    flex flex-col gap-4 hover:border-gold/40 transition-all shadow-sm dark:shadow-none">
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

                {/* ── Nosotros ── */}
                <section id="nosotros" className="py-28 px-6 md:px-10 scroll-mt-[68px]">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle tag="Quiénes somos" title="Acerca de Nosotros" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="bezel-card bg-white dark:bg-transparent rounded-sm p-8 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                                        <Icon name="flag" className="text-gold text-[20px]" />
                                    </div>
                                    <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark font-normal">Misión</h3>
                                </div>
                                <p className="font-serif italic text-spa-on-light-dim dark:text-spa-on-dark-dim/70 leading-relaxed text-sm">
                                    "Somos un spa dedicado a realzar la belleza y el estilo de nuestros clientes, brindando experiencias exclusivas de relajación y cuidado personal. Nos especializamos en tratamientos de estética, peluquería y bienestar, combinando elegancia, sofisticación y un servicio personalizado."
                                </p>
                            </div>
                            <div className="bezel-card bg-white dark:bg-transparent rounded-sm p-8 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                                        <Icon name="visibility" className="text-gold text-[20px]" />
                                    </div>
                                    <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark font-normal">Visión</h3>
                                </div>
                                <p className="font-serif italic text-spa-on-light-dim dark:text-spa-on-dark-dim/70 leading-relaxed text-sm">
                                    "Ser el spa más prestigioso de La Paz, reconocido por nuestro estilo inigualable, la excelencia en cada servicio y la capacidad de transformar la belleza en una experiencia única. Aspiramos a ser un referente en estilismo y bienestar."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {VALORES.map(v => (
                                <div key={v.titulo}
                                     className="bezel-card bg-white dark:bg-transparent rounded-sm p-5 text-center
                                                hover:border-gold/40 transition-all shadow-sm dark:shadow-none">
                                    <Icon name={v.icon} className="text-gold text-[28px] mb-3" />
                                    <p className="font-sans text-[11px] uppercase tracking-widest
                                                   text-spa-on-light dark:text-spa-on-dark font-semibold mb-2">
                                        {v.titulo}
                                    </p>
                                    <p className="text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim/50 leading-relaxed">
                                        {v.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Contacto & Horario ── */}
                <section id="contacto" className="py-28 px-6 md:px-10 bg-spa-border/30 dark:bg-spa-surface scroll-mt-[68px]">
                    <div className="max-w-5xl mx-auto">
                        <SectionTitle tag="Encuéntranos" title="Contacto & Horario" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Horario */}
                            <div className="bezel-card bg-white dark:bg-transparent rounded-sm p-8 shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                                        <Icon name="schedule" className="text-gold text-[20px]" />
                                    </div>
                                    <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark font-normal">
                                        Horario de Atención
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {HORARIO.map(h => (
                                        <div key={h.dia}
                                             className="flex items-center justify-between pb-3
                                                        border-b border-spa-border dark:border-gold/10 last:border-0 last:pb-0">
                                            <span className="font-sans text-xs uppercase tracking-widest
                                                             text-spa-on-light dark:text-spa-on-dark">
                                                {h.dia}
                                            </span>
                                            <span className={`font-sans text-xs ${h.cerrado ? 'text-red-400' : 'text-gold-mid dark:text-gold/60'}`}>
                                                {h.horas}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                {/* Dirección */}
                                <div className="bezel-card bg-white dark:bg-transparent rounded-sm p-6 shadow-sm dark:shadow-none">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-sm bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon name="location_on" className="text-gold text-[18px]" />
                                        </div>
                                        <div>
                                            <p className="font-sans text-[10px] uppercase tracking-widest
                                                           text-spa-on-light-dim dark:text-spa-on-dark-dim mb-1">
                                                Dirección
                                            </p>
                                            <p className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark">
                                                Aspiazu y 20 de Octubre
                                            </p>
                                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                La Paz, Bolivia
                                            </p>
                                            <a href="https://maps.app.goo.gl/rVyhezgw73NURxPX9"
                                               target="_blank" rel="noopener noreferrer"
                                               className="inline-flex items-center gap-1 mt-2
                                                          font-sans text-[10px] uppercase tracking-widest
                                                          text-gold-mid dark:text-gold/50 hover:text-gold transition-colors">
                                                <Icon name="open_in_new" className="text-[12px]" />
                                                Ver en mapa
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Redes sociales */}
                                <div className="bezel-card bg-white dark:bg-transparent rounded-sm p-6 shadow-sm dark:shadow-none">
                                    <p className="font-sans text-[10px] uppercase tracking-widest
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim mb-4">
                                        Síguenos en redes sociales
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { href: 'https://www.instagram.com/marceloruizoficial/', icon: 'photo_camera', label: '@marceloruizoficial', red: 'Instagram' },
                                            { href: 'https://www.tiktok.com/@marceloruizoficial',    icon: 'play_circle',  label: '@marceloruizoficial', red: 'TikTok'    },
                                            { href: 'https://www.facebook.com/marceloninfaruiz/?locale=es_LA', icon: 'thumb_up', label: 'Marcelo & Ninfa Ruiz', red: 'Facebook' },
                                        ].map(r => (
                                            <a key={r.red} href={r.href} target="_blank" rel="noopener noreferrer"
                                               className="flex items-center gap-3 group">
                                                <div className="w-8 h-8 rounded-sm bg-gold/10 flex items-center justify-center
                                                                group-hover:bg-gold/20 transition-colors shrink-0">
                                                    <Icon name={r.icon} className="text-gold text-[16px]" />
                                                </div>
                                                <div>
                                                    <p className="font-sans text-[9px] uppercase tracking-widest
                                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                        {r.red}
                                                    </p>
                                                    <p className="font-sans text-xs text-spa-on-light dark:text-spa-on-dark
                                                                   group-hover:text-gold transition-colors">
                                                        {r.label}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-36 px-6 text-center relative overflow-hidden">
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
                <footer className="bg-spa-border/40 dark:bg-spa-surface border-t border-spa-border dark:border-gold/10 py-10 px-6 md:px-10">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div className="flex flex-col gap-2.5">
                            <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                                 className="h-6 brightness-0 dark:brightness-100" />
                            <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                                 className="h-6 brightness-0 dark:brightness-100" />
                            <img src="/images/Recurso%205DIANA%20RUIZ%20LOGO2.png" alt="Diana Ruiz"
                                 className="h-5 brightness-0 dark:brightness-100" />
                            <p className="text-[9px] text-spa-on-light-dim/40 dark:text-gold/20 uppercase tracking-widest mt-1">
                                Aspiazu y 20 de Octubre · La Paz, Bolivia
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {[
                                { href: 'https://www.instagram.com/marceloruizoficial/', icon: 'photo_camera', label: 'Instagram' },
                                { href: 'https://www.tiktok.com/@marceloruizoficial',    icon: 'play_circle',  label: 'TikTok'    },
                                { href: 'https://www.facebook.com/marceloninfaruiz/?locale=es_LA', icon: 'thumb_up', label: 'Facebook' },
                            ].map(r => (
                                <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
                                   title={r.label}
                                   className="w-9 h-9 border border-spa-border dark:border-gold/20 rounded-sm
                                              flex items-center justify-center
                                              text-spa-on-light-dim dark:text-gold/40
                                              hover:border-gold/50 hover:text-gold dark:hover:text-gold transition-all">
                                    <Icon name={r.icon} className="text-[16px]" />
                                </a>
                            ))}
                        </div>

                        <div className="text-right">
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
