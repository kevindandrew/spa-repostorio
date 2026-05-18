import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
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

const ESTADOS = [
    { value: 'todas',      label: 'Todas'      },
    { value: 'PENDIENTE',  label: 'Pendientes' },
    { value: 'CONFIRMADA', label: 'Confirmadas'},
    { value: 'COMPLETADA', label: 'Completadas'},
    { value: 'CANCELADA',  label: 'Canceladas' },
];

const ESTADO_STYLE = {
    PENDIENTE:  { text: 'text-amber-400',  bg: 'bg-amber-400/10',  label: 'Pendiente',   icon: 'pending' },
    CONFIRMADA: { text: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Confirmada',  icon: 'check_circle' },
    COMPLETADA: { text: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Completada',  icon: 'task_alt' },
    CANCELADA:  { text: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Cancelada',   icon: 'cancel' },
    NO_ASISTIO: { text: 'text-gray-400',   bg: 'bg-gray-400/10',   label: 'No asistió',  icon: 'person_off' },
};

export default function Citas({ citas, filtroEstado }) {
    const { props } = usePage();
    const flash      = props.flash ?? {};
    const [cancelId, setCancelId]   = useState(null);
    const [resenaCita, setResenaCita] = useState(null); // cita a calificar

    const resenaForm = useForm({ cita_id: '', calificacion: 0, comentario: '' });

    function abrirResena(cita) {
        setResenaCita(cita);
        resenaForm.setData({ cita_id: cita.id, calificacion: 0, comentario: '' });
    }

    function submitResena(e) {
        e.preventDefault();
        resenaForm.post(route('cliente.resenas.store'), {
            onSuccess: () => { setResenaCita(null); resenaForm.reset(); },
        });
    }

    function handleFiltro(estado) {
        router.get(route('cliente.citas.index'), { estado }, { preserveScroll: true });
    }

    function confirmarCancelacion() {
        router.patch(route('cliente.citas.cancelar', cancelId), {}, {
            onSuccess: () => setCancelId(null),
        });
    }

    return (
        <ClienteLayout title="Mis Citas">
            <Head title="Mis Citas — Spa Marcelo Ruiz & Ninfa Rodriguez" />

            {/* Flash */}
            {flash.success && (
                <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-sm
                                bg-green-500/10 border border-green-500/20 text-green-400">
                    <Icon name="check_circle" className="text-[18px]" />
                    <span className="font-sans text-sm">{flash.success}</span>
                </div>
            )}

            {/* Cabecera + CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
                <div className="flex-1">
                    <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-spa-on-light-dim dark:text-gold/50 mb-1">
                        Historial completo
                    </p>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                        Mis Citas
                    </h2>
                </div>
                <Link href={route('cliente.reservar.index')}
                      className="gold-gradient shimmer-btn flex items-center gap-2
                                 px-5 py-2.5 rounded-sm font-sans text-[11px] uppercase
                                 tracking-[0.2em] font-semibold text-gold-text
                                 transition-all hover:brightness-110 whitespace-nowrap">
                    <Icon name="add" className="text-[16px]" />
                    Nueva Cita
                </Link>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-6">
                {ESTADOS.map(e => (
                    <button key={e.value}
                            onClick={() => handleFiltro(e.value)}
                            className={`px-4 py-1.5 rounded-full font-sans text-[10px] uppercase tracking-wider
                                        transition-all duration-200 border
                                        ${filtroEstado === e.value
                                            ? 'gold-gradient text-gold-text border-transparent'
                                            : 'border-spa-border dark:border-gold/20 text-spa-on-light-dim dark:text-spa-on-dark-dim hover:border-gold/40'
                                        }`}>
                        {e.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {citas.length === 0 ? (
                <div className="kpi-card flex flex-col items-center py-16 text-center">
                    <Icon name="event_busy" className="text-[48px] text-spa-on-light-dim dark:text-spa-on-dark-dim/40 mb-4" />
                    <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-2">Sin citas</p>
                    <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mb-6">
                        {filtroEstado === 'todas'
                            ? 'Aún no tienes citas registradas.'
                            : `No tienes citas con estado "${ESTADOS.find(e => e.value === filtroEstado)?.label}".`}
                    </p>
                    <Link href={route('cliente.reservar.index')}
                          className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold hover:opacity-70 transition-opacity">
                        Reservar ahora →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {citas.map((cita) => {
                        const s = ESTADO_STYLE[cita.estado] ?? ESTADO_STYLE.PENDIENTE;
                        const cancelable = cita.estado === 'PENDIENTE' || cita.estado === 'CONFIRMADA';
                        return (
                            <div key={cita.id}
                                 className="kpi-card flex flex-col sm:flex-row sm:items-center gap-4
                                            border border-transparent hover:border-gold/20 transition-all duration-200">

                                {/* Fecha */}
                                <div className="flex items-center gap-4 sm:gap-0">
                                    <div className="shrink-0 w-14 text-center">
                                        <p className="font-serif text-2xl leading-none text-spa-on-light dark:text-gold">
                                            {cita.dia}
                                        </p>
                                        <p className="font-sans text-[10px] uppercase tracking-widest
                                                       text-spa-on-light-dim dark:text-gold/50 mt-0.5">
                                            {cita.mes}
                                        </p>
                                        <p className="font-sans text-xs text-gold mt-1 font-medium">
                                            {cita.hora}
                                        </p>
                                    </div>

                                    <div className="sm:hidden w-px h-14 bg-gold/20 shrink-0" />
                                </div>

                                <div className="hidden sm:block w-px h-14 bg-gold/20 shrink-0 mx-2" />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans text-sm font-medium text-spa-on-light dark:text-spa-on-dark truncate">
                                        {cita.servicio}
                                        {cita.duracion && (
                                            <span className="ml-2 font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim font-normal">
                                                {cita.duracion} min
                                            </span>
                                        )}
                                    </p>
                                    <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5 truncate">
                                        <Icon name="person" className="text-[12px] align-middle mr-0.5" />
                                        {cita.empleado}
                                    </p>
                                    {cita.notas_cliente && (
                                        <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim/60 mt-1 truncate italic">
                                            "{cita.notas_cliente}"
                                        </p>
                                    )}
                                    {cita.notas_empleado && (
                                        <p className="font-sans text-[11px] text-gold/60 mt-1 truncate">
                                            <Icon name="medical_services" className="text-[11px] align-middle mr-0.5" />
                                            {cita.notas_empleado}
                                        </p>
                                    )}
                                </div>

                                {/* Estado + precio + acciones */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-sm
                                                       font-sans text-[9px] uppercase tracking-wider
                                                       ${s.bg} ${s.text}`}>
                                        <Icon name={s.icon} className="text-[11px]" />
                                        {s.label}
                                    </span>
                                    {cita.precio && (
                                        <span className="font-serif text-base text-spa-on-light dark:text-spa-on-dark">
                                            Bs {parseFloat(cita.precio).toFixed(2)}
                                        </span>
                                    )}
                                    {/* Calificar — solo COMPLETADA sin reseña */}
                                    {cita.estado === 'COMPLETADA' && !cita.resena && (
                                        <button onClick={() => abrirResena(cita)}
                                                className="flex items-center gap-1 font-sans text-[10px]
                                                           text-gold/60 hover:text-gold uppercase tracking-wider transition-colors">
                                            <Icon name="star" className="text-[12px]" />
                                            Calificar
                                        </button>
                                    )}
                                    {/* Reseña ya enviada */}
                                    {cita.resena && (
                                        <div className="flex flex-col items-end gap-0.5">
                                            <Stars value={cita.resena.calificacion} size="text-[12px]" />
                                            {cita.resena.comentario && (
                                                <span className="font-sans text-[9px] italic text-spa-on-light-dim dark:text-spa-on-dark-dim/60 max-w-[120px] truncate">
                                                    "{cita.resena.comentario}"
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {cancelable && (
                                        <button onClick={() => setCancelId(cita.id)}
                                                className="font-sans text-[10px] text-red-400/60 hover:text-red-400
                                                           uppercase tracking-wider transition-colors">
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal calificar */}
            {resenaCita && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     onClick={() => setResenaCita(null)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 kpi-card max-w-md w-full p-8"
                         onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">
                                Calificar servicio
                            </h3>
                            <button onClick={() => setResenaCita(null)}
                                    className="text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors">
                                <Icon name="close" className="text-[20px]" />
                            </button>
                        </div>

                        {/* Info cita */}
                        <div className="mb-6 px-4 py-3 rounded-sm bg-gold/5 border border-gold/15">
                            <p className="font-serif text-base text-spa-on-light dark:text-spa-on-dark">
                                {resenaCita.servicio}
                            </p>
                            <p className="font-sans text-xs italic text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                                <Icon name="person" className="text-[12px] align-middle mr-0.5" />
                                {resenaCita.empleado} · {resenaCita.fecha}
                            </p>
                        </div>

                        <form onSubmit={submitResena} className="space-y-5">
                            {/* Estrellas interactivas */}
                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim mb-3">
                                    Tu calificación *
                                </label>
                                <div className="flex items-center gap-3">
                                    <Stars value={resenaForm.data.calificacion}
                                           onChange={v => resenaForm.setData('calificacion', v)}
                                           size="text-[32px]" />
                                    {resenaForm.data.calificacion > 0 && (
                                        <span className="font-serif text-2xl gold-gradient-text">
                                            {resenaForm.data.calificacion}/5
                                        </span>
                                    )}
                                </div>
                                {resenaForm.errors.calificacion && (
                                    <p className="mt-1 text-xs text-red-400">{resenaForm.errors.calificacion}</p>
                                )}
                            </div>

                            {/* Comentario */}
                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                                    Comentario <span className="normal-case tracking-normal">(opcional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={resenaForm.data.comentario}
                                    onChange={e => resenaForm.setData('comentario', e.target.value)}
                                    placeholder="¿Cómo fue tu experiencia?"
                                    className="w-full bg-white dark:bg-spa-surface-low border border-spa-border dark:border-gold/20
                                               rounded-sm px-4 py-3 font-sans text-sm text-spa-on-light dark:text-spa-on-dark
                                               placeholder:text-spa-on-light-dim/50 dark:placeholder:text-spa-on-dark-dim/40
                                               focus:outline-none focus:border-gold/60 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="button"
                                        onClick={() => setResenaCita(null)}
                                        className="flex-1 py-3 border border-spa-border dark:border-gold/20
                                                   font-sans text-[11px] uppercase tracking-wider
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                   hover:border-gold/40 transition-all rounded-sm">
                                    Cancelar
                                </button>
                                <button type="submit"
                                        disabled={resenaForm.data.calificacion === 0 || resenaForm.processing}
                                        className="flex-1 gold-gradient shimmer-btn py-3
                                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                                   text-gold-text rounded-sm hover:brightness-110 transition-all
                                                   disabled:opacity-40 disabled:cursor-not-allowed">
                                    {resenaForm.processing ? 'Enviando...' : 'Enviar reseña'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal confirmar cancelación */}
            {cancelId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     onClick={() => setCancelId(null)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 kpi-card max-w-sm w-full text-center p-8"
                         onClick={e => e.stopPropagation()}>
                        <Icon name="event_busy" className="text-[40px] text-red-400 mb-3" />
                        <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-2">
                            ¿Cancelar esta cita?
                        </h3>
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mb-7">
                            Esta acción no se puede deshacer. Si cambias de opinión, deberás reservar de nuevo.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setCancelId(null)}
                                    className="flex-1 py-3 border border-spa-border dark:border-gold/20
                                               font-sans text-[11px] uppercase tracking-wider
                                               text-spa-on-light-dim dark:text-spa-on-dark-dim
                                               hover:border-gold/40 transition-all rounded-sm">
                                Volver
                            </button>
                            <button onClick={confirmarCancelacion}
                                    className="flex-1 py-3 bg-red-500/10 border border-red-500/30
                                               font-sans text-[11px] uppercase tracking-wider text-red-400
                                               hover:bg-red-500/20 transition-all rounded-sm">
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
}
