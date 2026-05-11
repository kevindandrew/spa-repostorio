import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Stars from '@/Components/Stars';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const DIAS_LABEL = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function today() {
    return new Date().toISOString().split('T')[0];
}

export default function Reservar({ servicios, empleados, slots, diasDisponibles, perfilEmpleado, preselect }) {
    const [step, setStep]                   = useState(1);
    const [servicioId, setServicioId]       = useState(preselect?.servicio_id ?? null);
    const [empleadoId, setEmpleadoId]       = useState(preselect?.empleado_id ?? null);
    const [fecha, setFecha]                 = useState(preselect?.fecha ?? '');
    const [loadingSlots, setLoadingSlots]   = useState(false);
    const [showPerfil, setShowPerfil]       = useState(false);
    const [loadingPerfil, setLoadingPerfil] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        servicio_id:   servicioId ?? '',
        empleado_id:   empleadoId ?? '',
        fecha:         fecha,
        hora:          '',
        notas_cliente: '',
    });

    const servicioActual = servicios.find(s => s.id === servicioId);
    const empleadoActual = empleados.find(e => e.id === empleadoId);

    // Inicializa step si hay preselect
    useEffect(() => {
        if (preselect?.servicio_id) setStep(2);
    }, []);

    function selectServicio(id) {
        setServicioId(id);
        setData(d => ({ ...d, servicio_id: id }));
        setStep(2);
    }

    function selectEmpleado(id) {
        setEmpleadoId(id);
        setFecha('');
        setData(d => ({ ...d, empleado_id: id, fecha: '', hora: '' }));
        router.get(route('cliente.reservar.index'),
            { servicio_id: servicioId, empleado_id: id },
            { only: ['diasDisponibles'], preserveState: true, preserveScroll: true }
        );
    }

    function openPerfil(id) {
        setLoadingPerfil(true);
        router.get(route('cliente.reservar.index'),
            { perfil_empleado_id: id },
            {
                only: ['perfilEmpleado'],
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => { setLoadingPerfil(false); setShowPerfil(true); },
                onError:   () => setLoadingPerfil(false),
            }
        );
    }

    function handleFecha(f) {
        setFecha(f);
        setData(d => ({ ...d, fecha: f, hora: '' }));
        if (servicioId && empleadoId && f) {
            setLoadingSlots(true);
            router.get(route('cliente.reservar.index'),
                { servicio_id: servicioId, empleado_id: empleadoId, fecha: f },
                {
                    only: ['slots'],
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setLoadingSlots(false),
                }
            );
        }
    }

    function selectHora(h) {
        setData(d => ({ ...d, hora: h }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('cliente.reservar.store'));
    }

    const canGoStep3 = empleadoId && fecha && slots !== null && slots !== undefined;

    return (
        <ClienteLayout title="Reservar Cita">
            <Head title="Reservar — Spa Marcelo Ruiz & Ninfa Rodriguez" />

            {/* Progress bar */}
            <div className="flex items-center mb-8 gap-0">
                {[
                    { n: 1, label: 'Servicio'     },
                    { n: 2, label: 'Especialista' },
                    { n: 3, label: 'Confirmar'    },
                ].map(({ n, label }, i) => (
                    <div key={n} className={`flex items-center ${i < 2 ? 'flex-1' : ''}`}>
                        <button onClick={() => n < step && setStep(n)}
                                className={`flex items-center gap-2 group
                                            ${n < step ? 'cursor-pointer' : 'cursor-default'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                             font-sans text-xs font-bold shrink-0 transition-all
                                             ${step > n
                                                 ? 'gold-gradient text-gold-text'
                                                 : step === n
                                                     ? 'border-2 border-gold text-gold bg-gold/10'
                                                     : 'border border-spa-border dark:border-white/10 text-spa-on-light-dim dark:text-spa-on-dark-dim'
                                             }`}>
                                {step > n ? <Icon name="check" className="text-[14px]" /> : n}
                            </div>
                            <span className={`font-sans text-[10px] uppercase tracking-wider hidden sm:block
                                              ${step >= n ? 'text-gold' : 'text-spa-on-light-dim dark:text-spa-on-dark-dim'}`}>
                                {label}
                            </span>
                        </button>
                        {i < 2 && (
                            <div className={`flex-1 h-px mx-3 transition-all ${step > n ? 'bg-gold/40' : 'bg-spa-border dark:bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* ── STEP 1: Elegir servicio ── */}
            {step === 1 && (
                <div>
                    <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-1">
                        Elige un servicio
                    </h3>
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mb-6">
                        ¿Qué experiencia deseas hoy?
                    </p>

                    {servicios.length === 0 ? (
                        <div className="kpi-card text-center py-12">
                            <Icon name="spa" className="text-[40px] text-spa-on-light-dim dark:text-spa-on-dark-dim/40 mb-3" />
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                No hay servicios disponibles por el momento.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {servicios.map(s => (
                                <button key={s.id}
                                        onClick={() => selectServicio(s.id)}
                                        className={`text-left kpi-card group transition-all duration-200 p-5
                                                   border-2 hover:border-gold/50
                                                   ${servicioId === s.id
                                                       ? 'border-gold/60 bg-gold/5'
                                                       : 'border-transparent'
                                                   }`}>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <Icon name="auto_awesome" className="text-gold/50 text-[15px]" />
                                        <span className="font-sans text-[9px] uppercase tracking-widest text-gold/60">
                                            {s.categoria}
                                        </span>
                                    </div>
                                    <p className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark mb-2 leading-snug group-hover:text-gold transition-colors">
                                        {s.nombre}
                                    </p>
                                    {s.descripcion && (
                                        <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mb-3 line-clamp-2 leading-relaxed">
                                            {s.descripcion}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-center mt-auto pt-3
                                                    border-t border-spa-border dark:border-gold/10">
                                        <span className="flex items-center gap-1 font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                            <Icon name="schedule" className="text-[13px]" />
                                            {s.duracion} min
                                        </span>
                                        <span className="font-serif text-xl gold-gradient-text">
                                            ${s.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── STEP 2: Especialista + Fecha ── */}
            {step === 2 && (
                <div>
                    {/* Resumen servicio seleccionado */}
                    {servicioActual && (
                        <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-sm
                                        bg-gold/5 border border-gold/20">
                            <Icon name="auto_awesome" className="text-gold text-[18px]" />
                            <div className="flex-1 min-w-0">
                                <p className="font-sans text-xs uppercase tracking-widest text-gold/70">Servicio seleccionado</p>
                                <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark truncate">
                                    {servicioActual.nombre}
                                    <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim ml-2 not-italic">
                                        {servicioActual.duracion} min · ${servicioActual.precio.toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            <button onClick={() => setStep(1)}
                                    className="font-sans text-[10px] uppercase tracking-wider text-gold/50 hover:text-gold transition-colors">
                                Cambiar
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Especialistas */}
                        <div>
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                Elige tu especialista
                            </h3>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mb-4">
                                Todos nuestros especialistas están certificados
                            </p>
                            <div className="space-y-3">
                                {empleados.map(e => (
                                    <div key={e.id}
                                         className={`flex items-center gap-3 p-4 rounded-sm
                                                    transition-all duration-200 border
                                                    ${empleadoId === e.id
                                                        ? 'border-gold/60 bg-gold/5'
                                                        : 'border-spa-border dark:border-gold/10 hover:border-gold/30'
                                                    }`}>
                                        {/* Clickable area — selects specialist */}
                                        <button onClick={() => selectEmpleado(e.id)}
                                                className="flex items-center gap-3 flex-1 min-w-0 text-left">
                                            <div className={`w-11 h-11 rounded-full flex items-center justify-center
                                                              font-sans text-base font-bold shrink-0
                                                              ${empleadoId === e.id
                                                                  ? 'gold-gradient text-gold-text'
                                                                  : 'bg-gold/10 text-gold'
                                                              }`}>
                                                {e.nombre.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark truncate">
                                                    {e.nombre}
                                                </p>
                                                <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim truncate">
                                                    {e.especialidad}
                                                </p>
                                                {e.avg_calificacion !== null && (
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Stars value={Math.round(e.avg_calificacion)} size="text-[11px]" />
                                                        <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                            {e.avg_calificacion} ({e.total_resenas})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => openPerfil(e.id)}
                                                    disabled={loadingPerfil}
                                                    className="font-sans text-[9px] uppercase tracking-wider
                                                               px-2.5 py-1.5 rounded-sm border border-gold/30
                                                               text-gold/70 hover:text-gold hover:border-gold/60
                                                               transition-all disabled:opacity-40">
                                                {loadingPerfil ? '...' : 'Ver perfil'}
                                            </button>
                                            {empleadoId === e.id && (
                                                <Icon name="check_circle" className="text-gold text-[20px]" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fecha */}
                        <div>
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                Elige la fecha
                            </h3>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mb-4">
                                {diasDisponibles && diasDisponibles.length > 0
                                    ? <>Disponible: <span className="text-gold">
                                            {diasDisponibles.map(d => DIAS_LABEL[d]).join(', ')}
                                        </span></>
                                    : empleadoId
                                        ? 'Selecciona una fecha para ver horarios disponibles'
                                        : 'Primero elige un especialista'
                                }
                            </p>

                            <input
                                type="date"
                                min={today()}
                                value={fecha}
                                disabled={!empleadoId}
                                onChange={e => handleFecha(e.target.value)}
                                className="w-full bg-white dark:bg-spa-surface-low border border-spa-border dark:border-gold/20
                                           rounded-sm px-4 py-3 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                           focus:outline-none focus:border-gold/60 transition-all
                                           disabled:opacity-40 disabled:cursor-not-allowed"
                            />

                            {/* Indicador de slots */}
                            {fecha && (
                                <div className="mt-4 p-3 rounded-sm border border-spa-border dark:border-gold/10">
                                    {loadingSlots ? (
                                        <div className="flex items-center gap-2 text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                            <Icon name="autorenew" className="text-[16px] animate-spin text-gold" />
                                            <span className="font-sans text-xs">Buscando horarios...</span>
                                        </div>
                                    ) : slots === null || slots === undefined ? (
                                        <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                            Cargando disponibilidad...
                                        </p>
                                    ) : slots.length === 0 ? (
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <Icon name="event_busy" className="text-[16px]" />
                                            <span className="font-sans text-xs">Sin horarios disponibles este día</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <Icon name="event_available" className="text-[16px]" />
                                            <span className="font-sans text-xs">{slots.length} horario{slots.length !== 1 ? 's' : ''} disponible{slots.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón continuar */}
                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setStep(3)}
                                disabled={!canGoStep3 || slots?.length === 0}
                                className="gold-gradient shimmer-btn px-8 py-3 font-sans text-[11px]
                                           uppercase tracking-[0.2em] font-semibold text-gold-text
                                           rounded-sm transition-all hover:brightness-110
                                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100">
                            Ver horarios →
                        </button>
                    </div>
                </div>
            )}

            {/* ── STEP 3: Horario + Notas + Confirmar ── */}
            {step === 3 && (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Slots + notas */}
                        <div className="lg:col-span-2">
                            <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark mb-1">
                                Elige tu horario
                            </h3>
                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mb-6">
                                Horarios disponibles para el {fecha}
                            </p>

                            {loadingSlots ? (
                                <div className="flex items-center gap-3 py-8">
                                    <Icon name="autorenew" className="text-[22px] animate-spin text-gold" />
                                    <span className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        Cargando horarios...
                                    </span>
                                </div>
                            ) : !slots || slots.length === 0 ? (
                                <div className="kpi-card text-center py-8">
                                    <Icon name="event_busy" className="text-[36px] text-amber-400/60 mb-3" />
                                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        No hay horarios disponibles. Intenta otra fecha.
                                    </p>
                                    <button type="button" onClick={() => setStep(2)}
                                            className="mt-4 font-sans text-[11px] uppercase tracking-wider text-gold hover:opacity-70 transition-opacity">
                                        ← Cambiar fecha
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-8">
                                    {slots.map(h => (
                                        <button key={h}
                                                type="button"
                                                onClick={() => selectHora(h)}
                                                className={`py-3 px-2 rounded-sm font-sans text-sm font-medium
                                                            transition-all duration-200 border
                                                            ${data.hora === h
                                                                ? 'gold-gradient text-gold-text border-transparent shadow-md'
                                                                : 'border-spa-border dark:border-gold/20 text-spa-on-light dark:text-spa-on-dark hover:border-gold/40'
                                                            }`}>
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Notas */}
                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                                    Notas adicionales <span className="normal-case tracking-normal">(opcional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notas_cliente}
                                    onChange={e => setData('notas_cliente', e.target.value)}
                                    placeholder="Alergias, preferencias, indicaciones especiales..."
                                    className="w-full bg-white dark:bg-spa-surface-low border border-spa-border dark:border-gold/20
                                               rounded-sm px-4 py-3 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                               placeholder:text-spa-on-light-dim/50 dark:placeholder:text-spa-on-dark-dim/40
                                               focus:outline-none focus:border-gold/60 transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Resumen lateral */}
                        <div>
                            <div className="kpi-card sticky top-24">
                                <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold/70 mb-5">
                                    Resumen de tu cita
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Icon name="auto_awesome" className="text-gold/50 text-[16px] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-sans text-[9px] uppercase tracking-wider text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                Servicio
                                            </p>
                                            <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark leading-tight">
                                                {servicioActual?.nombre}
                                            </p>
                                            <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                {servicioActual?.duracion} min
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Icon name="person" className="text-gold/50 text-[16px] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-sans text-[9px] uppercase tracking-wider text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                Especialista
                                            </p>
                                            <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark leading-tight">
                                                {empleadoActual?.nombre}
                                            </p>
                                            <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                {empleadoActual?.especialidad}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Icon name="calendar_today" className="text-gold/50 text-[16px] mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-sans text-[9px] uppercase tracking-wider text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                Fecha
                                            </p>
                                            <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark leading-tight">
                                                {fecha}
                                            </p>
                                        </div>
                                    </div>

                                    {data.hora && (
                                        <div className="flex items-start gap-3">
                                            <Icon name="schedule" className="text-gold text-[16px] mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-sans text-[9px] uppercase tracking-wider text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                    Horario
                                                </p>
                                                <p className="font-serif text-xl gold-gradient-text leading-tight">
                                                    {data.hora}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-spa-border dark:border-gold/10 pt-4 mb-5">
                                    <div className="flex justify-between items-center">
                                        <span className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim uppercase tracking-wider">
                                            Total
                                        </span>
                                        <span className="font-serif text-2xl gold-gradient-text">
                                            ${servicioActual?.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button type="submit"
                                        disabled={!data.hora || processing}
                                        className="w-full gold-gradient shimmer-btn py-3.5 font-sans text-[11px]
                                                   uppercase tracking-[0.2em] font-semibold text-gold-text
                                                   rounded-sm transition-all hover:brightness-110
                                                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100">
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Icon name="autorenew" className="text-[14px] animate-spin" />
                                            Reservando...
                                        </span>
                                    ) : (
                                        <>
                                            <Icon name="event_available" className="text-[14px] mr-1.5 align-middle" />
                                            Confirmar Reserva
                                        </>
                                    )}
                                </button>

                                {errors.hora && (
                                    <p className="mt-2 font-sans text-xs text-red-400 text-center">{errors.hora}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nav steps */}
                    <div className="mt-6">
                        <button type="button"
                                onClick={() => setStep(2)}
                                className="font-sans text-[11px] uppercase tracking-wider text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors">
                            ← Cambiar especialista o fecha
                        </button>
                    </div>
                </form>
            )}
            {/* ── Modal perfil especialista ── */}
            {showPerfil && perfilEmpleado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     onClick={() => setShowPerfil(false)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Panel */}
                    <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto
                                    bg-white dark:bg-spa-surface-low rounded-sm
                                    border border-spa-border dark:border-gold/20 shadow-2xl"
                         onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-spa-surface-low
                                        border-b border-spa-border dark:border-gold/10 px-6 pt-6 pb-4">
                            <button onClick={() => setShowPerfil(false)}
                                    className="absolute top-4 right-4 text-spa-on-light-dim dark:text-spa-on-dark-dim
                                               hover:text-gold transition-colors">
                                <Icon name="close" className="text-[20px]" />
                            </button>

                            {/* Avatar + nombre */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center
                                                font-sans text-2xl font-bold text-gold-text shrink-0">
                                    {perfilEmpleado.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark leading-tight">
                                        {perfilEmpleado.nombre}
                                    </h3>
                                    {perfilEmpleado.especialidad && (
                                        <p className="font-sans text-[10px] uppercase tracking-widest text-gold/60 mt-0.5">
                                            {perfilEmpleado.especialidad}
                                        </p>
                                    )}
                                    {perfilEmpleado.avg_calificacion !== null ? (
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <Stars value={Math.round(perfilEmpleado.avg_calificacion)} size="text-[14px]" />
                                            <span className="font-serif text-sm gold-gradient-text">
                                                {perfilEmpleado.avg_calificacion}
                                            </span>
                                            <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                ({perfilEmpleado.total_resenas} reseña{perfilEmpleado.total_resenas !== 1 ? 's' : ''})
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                            Sin calificaciones aún
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-6">

                            {/* Bio */}
                            {perfilEmpleado.bio && (
                                <div>
                                    <p className="font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-2">
                                        Acerca de
                                    </p>
                                    <p className="font-sans text-sm text-spa-on-light dark:text-spa-on-dark leading-relaxed">
                                        {perfilEmpleado.bio}
                                    </p>
                                </div>
                            )}

                            {/* Reseñas */}
                            <div>
                                <p className="font-sans text-[9px] uppercase tracking-widest text-gold/50 mb-3">
                                    Reseñas de clientes
                                </p>

                                {perfilEmpleado.resenas.length === 0 ? (
                                    <div className="flex flex-col items-center py-6 text-center">
                                        <Icon name="rate_review" className="text-[32px] text-spa-on-light-dim/30 dark:text-spa-on-dark-dim/20 mb-2" />
                                        <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim italic">
                                            Este especialista aún no tiene reseñas.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {perfilEmpleado.resenas.map((r, i) => (
                                            <div key={i}
                                                 className="p-3 rounded-sm bg-spa-border/20 dark:bg-white/5
                                                            border border-spa-border dark:border-gold/10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Stars value={r.calificacion} size="text-[13px]" />
                                                    <span className="font-sans text-[9px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                                        {r.fecha}
                                                    </span>
                                                </div>
                                                {r.comentario && (
                                                    <p className="font-sans text-xs text-spa-on-light dark:text-spa-on-dark italic leading-relaxed">
                                                        "{r.comentario}"
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-spa-surface-low
                                        border-t border-spa-border dark:border-gold/10 px-6 py-4">
                            <button onClick={() => { selectEmpleado(perfilEmpleado.id); setShowPerfil(false); }}
                                    className="w-full gold-gradient shimmer-btn py-3 font-sans text-[11px]
                                               uppercase tracking-[0.2em] font-semibold text-gold-text
                                               rounded-sm transition-all hover:brightness-110">
                                <Icon name="person_check" className="text-[14px] mr-1.5 align-middle" />
                                Seleccionar este especialista
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
}
