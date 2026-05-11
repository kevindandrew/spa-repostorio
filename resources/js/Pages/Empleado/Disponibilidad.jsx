import { Head, useForm, router } from '@inertiajs/react';
import EmpleadoLayout from '@/Layouts/EmpleadoLayout';
import { useState } from 'react';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const DIAS = [
    { dia: 1, nombre: 'Lunes',     corto: 'LUN' },
    { dia: 2, nombre: 'Martes',    corto: 'MAR' },
    { dia: 3, nombre: 'Miércoles', corto: 'MIÉ' },
    { dia: 4, nombre: 'Jueves',    corto: 'JUE' },
    { dia: 5, nombre: 'Viernes',   corto: 'VIE' },
    { dia: 6, nombre: 'Sábado',    corto: 'SÁB' },
    { dia: 0, nombre: 'Domingo',   corto: 'DOM' },
];

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm bg-spa-surface border border-gold/20 rounded-lg
                            shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden">
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

const inputCls = "w-full bg-spa-bg border border-gold/20 rounded-sm px-3 py-2.5 font-sans text-sm text-spa-on-dark focus:border-gold/60 focus:outline-none transition-colors";

/* Convierte "HH:MM" a minutos desde medianoche para calcular altura visual */
function toMin(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

/* Calcula altura/top relativo a jornada 06:00–22:00 (960 min) */
const DAY_START = 6 * 60;   // 06:00
const DAY_RANGE = 16 * 60;  // 16 horas visibles

export default function Disponibilidad({ slots, empleado }) {
    const [editDia, setEditDia]       = useState(null); // { dia, slot|null }
    const [confirmDel, setConfirmDel] = useState(null);

    const form = useForm({ dia_semana: '', hora_inicio: '', hora_fin: '' });

    function openAdd(dia) {
        setEditDia({ dia });
        form.setData({ dia_semana: dia, hora_inicio: '08:00', hora_fin: '18:00' });
    }

    function openEdit(dia, slot) {
        setEditDia({ dia, slot });
        form.setData({
            dia_semana:  dia,
            hora_inicio: slot.hora_inicio,
            hora_fin:    slot.hora_fin,
        });
    }

    function submitForm(e) {
        e.preventDefault();
        form.post(route('empleado.disponibilidad.store'), {
            onSuccess: () => { setEditDia(null); form.reset(); },
        });
    }

    function handleToggle(slot) {
        router.patch(route('empleado.disponibilidad.toggle', slot.id));
    }

    function handleDelete() {
        router.delete(route('empleado.disponibilidad.destroy', confirmDel), {
            onSuccess: () => setConfirmDel(null),
        });
    }

    /* Index slots by dia_semana */
    const slotByDia = {};
    slots.forEach(s => { slotByDia[s.dia_semana] = s; });

    /* Stats */
    const diasActivos  = slots.filter(s => s.activo).length;
    const horasTotal   = slots.filter(s => s.activo).reduce((acc, s) => {
        return acc + (toMin(s.hora_fin) - toMin(s.hora_inicio)) / 60;
    }, 0);

    /* Hour labels for timeline (06:00 – 22:00) */
    const hourLabels = Array.from({ length: 9 }, (_, i) => `${String(6 + i * 2).padStart(2, '0')}:00`);

    return (
        <EmpleadoLayout title="Mi Disponibilidad">
            <Head title="Disponibilidad — Especialista" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                        Mi Disponibilidad
                    </h2>
                    <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        {diasActivos} días activos · {horasTotal.toFixed(0)} horas semanales
                    </p>
                </div>
            </div>

            {/* ── Vista de semana visual ── */}
            <div className="kpi-card mb-5 overflow-x-auto">
                <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark mb-6">
                    Vista Semanal
                </h3>

                <div className="flex gap-0">
                    {/* Columna de horas */}
                    <div className="flex flex-col shrink-0 w-12 pt-7">
                        {hourLabels.map(h => (
                            <div key={h} style={{ height: `${100 / 8}%`, minHeight: 48 }}
                                 className="flex items-start">
                                <span className="font-sans text-[9px] text-gold/30 leading-none">{h}</span>
                            </div>
                        ))}
                    </div>

                    {/* Columnas de días */}
                    <div className="flex flex-1 gap-1 min-w-[560px]">
                        {DIAS.map(({ dia, nombre, corto }) => {
                            const slot = slotByDia[dia];
                            const CELL_H = 384; // px for 16 hours

                            let topPx   = 0;
                            let heightPx = 0;
                            if (slot) {
                                const startMin = Math.max(toMin(slot.hora_inicio), DAY_START);
                                const endMin   = Math.min(toMin(slot.hora_fin),   DAY_START + DAY_RANGE);
                                topPx    = ((startMin - DAY_START) / DAY_RANGE) * CELL_H;
                                heightPx = Math.max(((endMin - startMin) / DAY_RANGE) * CELL_H, 20);
                            }

                            const isTodayDow = new Date().getDay() === dia;

                            return (
                                <div key={dia} className="flex-1 flex flex-col">
                                    {/* Day header */}
                                    <div className={`text-center py-1.5 mb-1 rounded-sm font-sans text-[9px] uppercase tracking-widest
                                                     ${isTodayDow ? 'bg-gold/15 text-gold' : 'text-spa-on-light-dim dark:text-gold/30'}`}>
                                        {corto}
                                    </div>

                                    {/* Time column */}
                                    <div className="relative flex-1 rounded-sm bg-white/[0.02] dark:bg-white/[0.02] border border-gold/5"
                                         style={{ height: CELL_H }}>
                                        {/* Hour grid lines */}
                                        {hourLabels.map((_, i) => (
                                            <div key={i}
                                                 className="absolute inset-x-0 border-t border-gold/5"
                                                 style={{ top: `${(i / 8) * 100}%` }} />
                                        ))}

                                        {/* Availability block */}
                                        {slot && (
                                            <div className={`absolute inset-x-1 rounded-sm transition-all
                                                            ${slot.activo
                                                                ? 'gold-gradient opacity-80'
                                                                : 'bg-gray-400/20 border border-gray-400/20'}`}
                                                 style={{ top: topPx, height: Math.max(heightPx, 20) }}>
                                                <div className="px-1.5 pt-1.5">
                                                    <p className={`font-sans text-[9px] font-semibold leading-none
                                                                   ${slot.activo ? 'text-black/70' : 'text-gray-400'}`}>
                                                        {slot.hora_inicio}
                                                    </p>
                                                    {heightPx > 40 && (
                                                        <p className={`font-sans text-[8px] leading-none mt-0.5
                                                                       ${slot.activo ? 'text-black/50' : 'text-gray-500'}`}>
                                                            {slot.hora_fin}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add button if no slot */}
                                        {!slot && (
                                            <button onClick={() => openAdd(dia)}
                                                    className="absolute inset-0 flex items-center justify-center
                                                               opacity-0 hover:opacity-100 transition-opacity group">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full
                                                                border border-dashed border-gold/30 text-gold/40
                                                                group-hover:border-gold/60 group-hover:text-gold
                                                                transition-all">
                                                    <Icon name="add" className="text-[16px]" />
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Cards detalle por día ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {DIAS.map(({ dia, nombre }) => {
                    const slot      = slotByDia[dia];
                    const isTodayDow = new Date().getDay() === dia;

                    return (
                        <div key={dia}
                             className={`kpi-card group flex flex-col border transition-all duration-200
                                         ${isTodayDow ? 'border-gold/30' : 'border-transparent hover:border-gold/20'}
                                         ${slot && !slot.activo ? 'opacity-50' : ''}`}>

                            {/* Día */}
                            <div className="flex items-center justify-between mb-3">
                                <p className={`font-sans text-[10px] uppercase tracking-widest font-semibold
                                               ${isTodayDow ? 'text-gold' : 'text-spa-on-light dark:text-spa-on-dark'}`}>
                                    {nombre}
                                </p>
                                {isTodayDow && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                )}
                            </div>

                            {slot ? (
                                <>
                                    {/* Horas */}
                                    <div className="flex-1 mb-3">
                                        <p className="font-serif text-xl gold-gradient-text leading-none">
                                            {slot.hora_inicio}
                                        </p>
                                        <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1">
                                            hasta {slot.hora_fin}
                                        </p>
                                        <p className="font-sans text-[9px] text-gold/40 mt-0.5">
                                            {((toMin(slot.hora_fin) - toMin(slot.hora_inicio)) / 60).toFixed(1)}h
                                        </p>
                                    </div>

                                    {/* Estado badge */}
                                    <span className={`inline-flex items-center gap-1 mb-3 px-2 py-0.5 rounded-sm
                                                      font-sans text-[8px] uppercase tracking-wider self-start
                                                      ${slot.activo ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                                        <span className={`w-1 h-1 rounded-full ${slot.activo ? 'bg-green-400' : 'bg-gray-400'}`} />
                                        {slot.activo ? 'Activo' : 'Inactivo'}
                                    </span>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-1 pt-2 border-t border-gold/10">
                                        <button onClick={() => handleToggle(slot)}
                                                className={`p-1.5 rounded-sm transition-colors
                                                            ${slot.activo
                                                                ? 'text-spa-on-dark-dim hover:text-amber-400 hover:bg-amber-400/10'
                                                                : 'text-spa-on-dark-dim hover:text-green-400 hover:bg-green-400/10'}`}
                                                title={slot.activo ? 'Desactivar' : 'Activar'}>
                                            <Icon name={slot.activo ? 'toggle_on' : 'toggle_off'} className="text-[18px]" />
                                        </button>
                                        <button onClick={() => openEdit(dia, slot)}
                                                className="p-1.5 text-spa-on-dark-dim hover:text-gold hover:bg-gold/10 rounded-sm transition-colors">
                                            <Icon name="edit" className="text-[14px]" />
                                        </button>
                                        <button onClick={() => setConfirmDel(slot.id)}
                                                className="p-1.5 text-spa-on-dark-dim hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-colors">
                                            <Icon name="delete" className="text-[14px]" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
                                    <button onClick={() => openAdd(dia)}
                                            className="flex flex-col items-center gap-1.5 text-gold/30 hover:text-gold/60 transition-colors group">
                                        <div className="w-8 h-8 rounded-full border border-dashed border-gold/20 group-hover:border-gold/50
                                                        flex items-center justify-center transition-colors">
                                            <Icon name="add" className="text-[16px]" />
                                        </div>
                                        <span className="font-sans text-[9px] uppercase tracking-widest">Agregar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal agregar/editar */}
            <Modal open={!!editDia}
                   onClose={() => { setEditDia(null); form.reset(); }}
                   title={editDia?.slot ? `Editar — ${DIAS.find(d => d.dia === editDia?.dia)?.nombre}` : `Agregar — ${DIAS.find(d => d.dia === editDia?.dia)?.nombre}`}>
                {editDia && (
                    <form onSubmit={submitForm} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">
                                    Hora inicio
                                </label>
                                <input type="time" value={form.data.hora_inicio}
                                       onChange={e => form.setData('hora_inicio', e.target.value)}
                                       className={inputCls} />
                                {form.errors.hora_inicio && (
                                    <p className="mt-1 font-sans text-[11px] text-red-400">{form.errors.hora_inicio}</p>
                                )}
                            </div>
                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">
                                    Hora fin
                                </label>
                                <input type="time" value={form.data.hora_fin}
                                       onChange={e => form.setData('hora_fin', e.target.value)}
                                       className={inputCls} />
                                {form.errors.hora_fin && (
                                    <p className="mt-1 font-sans text-[11px] text-red-400">{form.errors.hora_fin}</p>
                                )}
                            </div>
                        </div>

                        {/* Preview duration */}
                        {form.data.hora_inicio && form.data.hora_fin && toMin(form.data.hora_fin) > toMin(form.data.hora_inicio) && (
                            <div className="px-3 py-2 bg-gold/5 rounded-sm border border-gold/10 text-center">
                                <p className="font-sans text-xs text-gold/70">
                                    Jornada de{' '}
                                    <span className="text-gold font-semibold">
                                        {((toMin(form.data.hora_fin) - toMin(form.data.hora_inicio)) / 60).toFixed(1)} horas
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => { setEditDia(null); form.reset(); }}
                                    className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                                Cancelar
                            </button>
                            <button type="submit" disabled={form.processing}
                                    className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50">
                                {form.processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal confirmar borrado */}
            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Eliminar Horario">
                <p className="font-sans text-sm text-spa-on-dark mb-6">
                    ¿Eliminar este horario? Podrás volver a agregarlo cuando quieras.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDel(null)}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleDelete}
                            className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </EmpleadoLayout>
    );
}
