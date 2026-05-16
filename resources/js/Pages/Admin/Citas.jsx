import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useState, useEffect } from "react";

function Icon({ name, className = "" }) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{
                fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
            }}
        >
            {name}
        </span>
    );
}

const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];
const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DIAS_SEMANA_L = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const ESTADO = {
    PENDIENTE: {
        label: "Pendiente",
        text: "text-amber-400",
        bg: "bg-amber-400/10",
        dot: "bg-amber-400",
        ring: "ring-amber-400/30",
    },
    CONFIRMADA: {
        label: "Confirmada",
        text: "text-blue-400",
        bg: "bg-blue-400/10",
        dot: "bg-blue-400",
        ring: "ring-blue-400/30",
    },
    COMPLETADA: {
        label: "Completada",
        text: "text-green-400",
        bg: "bg-green-400/10",
        dot: "bg-green-400",
        ring: "ring-green-400/30",
    },
    CANCELADA: {
        label: "Cancelada",
        text: "text-red-400",
        bg: "bg-red-400/10",
        dot: "bg-red-400",
        ring: "ring-red-400/30",
    },
    NO_ASISTIO: {
        label: "No asistió",
        text: "text-gray-400",
        bg: "bg-gray-400/10",
        dot: "bg-gray-500",
        ring: "ring-gray-400/30",
    },
};

function toDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function addDays(dateStr, n) {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + n);
    return toDateStr(d);
}

function getMondayOf(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    const dow = (d.getDay() + 6) % 7; // 0=Mon
    d.setDate(d.getDate() - dow);
    return toDateStr(d);
}

function buildCalendar(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const startDow = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = startDow; i > 0; i--)
        cells.push({ date: new Date(year, month - 1, 1 - i), current: false });
    for (let d = 1; d <= daysInMonth; d++)
        cells.push({ date: new Date(year, month - 1, d), current: true });
    let nd = 1;
    while (cells.length < 42)
        cells.push({ date: new Date(year, month, nd++), current: false });
    return cells;
}

function Modal({ open, onClose, title, children, wide = false }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative z-10 w-full ${wide ? "max-w-2xl" : "max-w-lg"} bg-spa-surface
                             border border-gold/20 rounded-lg shadow-[0_24px_80px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
                    <h2 className="font-serif text-lg text-gold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-spa-on-dark-dim hover:text-gold transition-colors"
                    >
                        <Icon name="close" className="text-[20px]" />
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block font-sans text-[10px] uppercase tracking-widest text-gold/60 mb-1.5">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 font-sans text-[11px] text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}

const inputCls =
    "w-full bg-spa-bg border border-gold/20 rounded-sm px-3 py-2.5 font-sans text-sm text-spa-on-dark placeholder:text-spa-on-dark-dim/40 focus:border-gold/60 focus:outline-none transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

/* ── Cita card (reutilizable) ───────────────────────────── */
function CitaCard({ cita, onEdit, onDelete }) {
    const s = ESTADO[cita.estado] ?? ESTADO.PENDIENTE;
    return (
        <div
            className={`p-3 rounded-md border border-gold/10 hover:border-gold/25 bg-white/[0.02] transition-all`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-1 h-7 rounded-full ${s.dot}`} />
                    <div>
                        <p className="font-serif text-sm gold-gradient-text leading-none">
                            {cita.hora}
                        </p>
                        <p className="font-sans text-[9px] text-spa-on-dark-dim">
                            {cita.hora_fin} · {cita.duracion}min
                        </p>
                    </div>
                </div>
                <span
                    className={`px-1.5 py-0.5 rounded-sm font-sans text-[8px] uppercase tracking-wider ${s.bg} ${s.text}`}
                >
                    {s.label}
                </span>
            </div>
            <p className="font-sans text-xs font-medium text-spa-on-light dark:text-spa-on-dark">
                {cita.cliente}
            </p>
            <p className="font-sans text-[10px] italic text-spa-on-light-dim dark:text-spa-on-dark-dim">
                {cita.servicio}
            </p>
            <p className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                {cita.empleado}
                {cita.precio_cobrado ? ` · $${cita.precio_cobrado}` : ""}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gold/10">
                {cita.estado === "PENDIENTE" && (
                    <button
                        onClick={() =>
                            router.patch(route("admin.citas.update", cita.id), {
                                estado: "CONFIRMADA",
                            })
                        }
                        className="flex items-center gap-0.5 font-sans text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Icon name="check_circle" className="text-[12px]" />
                        Confirmar
                    </button>
                )}
                {(cita.estado === "PENDIENTE" ||
                    cita.estado === "CONFIRMADA") && (
                    <button
                        onClick={() =>
                            router.patch(route("admin.citas.update", cita.id), {
                                estado: "COMPLETADA",
                            })
                        }
                        className="flex items-center gap-0.5 font-sans text-[9px] uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
                    >
                        <Icon name="task_alt" className="text-[12px]" />
                        Completar
                    </button>
                )}
                <div className="flex-1" />
                <button
                    onClick={() => onEdit(cita)}
                    className="p-1 text-spa-on-dark-dim hover:text-gold rounded-sm hover:bg-gold/10 transition-colors"
                >
                    <Icon name="edit" className="text-[13px]" />
                </button>
                <button
                    onClick={() => onDelete(cita.id)}
                    className="p-1 text-spa-on-dark-dim hover:text-red-400 rounded-sm hover:bg-red-400/10 transition-colors"
                >
                    <Icon name="delete" className="text-[13px]" />
                </button>
            </div>
        </div>
    );
}

/* ── Page ────────────────────────────────────────────────── */
export default function Citas({
    citas,
    year,
    month,
    fecha,
    periodo,
    semana_inicio,
    estado_filtro,
    empleado_filtro,
    empleados,
    clientes,
    servicios,
}) {
    const todayStr = toDateStr(new Date());
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth() + 1;

    const [selectedDate, setSelectedDate] = useState(() =>
        year === nowYear && month === nowMonth
            ? todayStr
            : `${year}-${String(month).padStart(2, "0")}-01`,
    );
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    useEffect(() => {
        setSelectedDate(
            year === nowYear && month === nowMonth
                ? todayStr
                : `${year}-${String(month).padStart(2, "0")}-01`,
        );
    }, [year, month]);

    /* ── Navigation helper ── */
    function navigate(params) {
        const base = {
            periodo,
            fecha,
            year,
            month,
            estado: estado_filtro,
            empleado_id: empleado_filtro,
        };
        router.get(route("admin.citas.index"), { ...base, ...params });
    }

    /* ── Period navigation ── */
    function goMonth(delta) {
        let y = year,
            m = month + delta;
        if (m < 1) {
            m = 12;
            y--;
        }
        if (m > 12) {
            m = 1;
            y++;
        }
        navigate({ periodo: "mes", year: y, month: m });
    }
    function goWeek(delta) {
        const monday = semana_inicio ?? getMondayOf(fecha);
        navigate({ periodo: "semana", fecha: addDays(monday, delta * 7) });
    }
    function goDay(delta) {
        navigate({ periodo: "dia", fecha: addDays(fecha, delta) });
    }
    function switchPeriodo(p) {
        if (p === "mes") navigate({ periodo: "mes", year, month });
        if (p === "semana")
            navigate({ periodo: "semana", fecha: getMondayOf(selectedDate) });
        if (p === "dia") navigate({ periodo: "dia", fecha: selectedDate });
    }

    /* ── Grouped by date for calendar/week ── */
    const citasByDate = {};
    citas.forEach((c) => {
        citasByDate[c.fecha] ??= [];
        citasByDate[c.fecha].push(c);
    });

    /* ── Calendar month ── */
    const cells = buildCalendar(year, month);
    const selectedCitas = (citasByDate[selectedDate] ?? [])
        .slice()
        .sort((a, b) => a.hora.localeCompare(b.hora));
    const selDateLabel = new Date(
        selectedDate + "T12:00:00",
    ).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    /* ── Semana: build 7 days Mon-Sun ── */
    const monday = semana_inicio ?? getMondayOf(fecha);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
    const weekLabel = (() => {
        const ini = new Date(weekDays[0] + "T12:00:00");
        const fin = new Date(weekDays[6] + "T12:00:00");
        return `${ini.getDate()} ${MESES[ini.getMonth()]} — ${fin.getDate()} ${MESES[fin.getMonth()]} ${fin.getFullYear()}`;
    })();

    /* ── Day view ── */
    const diaCitas = (citasByDate[fecha] ?? [])
        .slice()
        .sort((a, b) => a.hora.localeCompare(b.hora));
    const diaLabel = new Date(fecha + "T12:00:00").toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    /* ── Stats ── */
    const totalMes = citas.length;
    const pendientes = citas.filter((c) => c.estado === "PENDIENTE").length;
    const confirmadas = citas.filter((c) => c.estado === "CONFIRMADA").length;
    const completadas = citas.filter((c) => c.estado === "COMPLETADA").length;
    const canceladas = citas.filter((c) => c.estado === "CANCELADA").length;

    /* ── Forms ── */
    const form = useForm({
        cliente_id: "",
        empleado_id: "",
        servicio_id: "",
        fecha_hora_inicio: "",
        precio_cobrado: "",
        notas_cliente: "",
    });
    const editForm = useForm({
        estado: "",
        notas_empleado: "",
        precio_cobrado: "",
    });

    useEffect(() => {
        if (form.data.servicio_id) {
            const s = servicios.find((s) => s.id === form.data.servicio_id);
            if (s) form.setData("precio_cobrado", s.precio);
        }
    }, [form.data.servicio_id]);

    function openCreate(prefillDate) {
        form.reset();
        form.setData(
            "fecha_hora_inicio",
            `${prefillDate ?? selectedDate}T09:00`,
        );
        setCreateOpen(true);
    }
    function openEdit(cita) {
        setEditTarget(cita);
        editForm.setData({
            estado: cita.estado,
            notas_empleado: cita.notas_empleado ?? "",
            precio_cobrado: cita.precio_cobrado ?? "",
        });
    }
    function submitCreate(e) {
        e.preventDefault();
        form.post(route("admin.citas.store"), {
            onSuccess: () => {
                setCreateOpen(false);
                form.reset();
            },
        });
    }
    function submitEdit(e) {
        e.preventDefault();
        editForm.patch(route("admin.citas.update", editTarget.id), {
            onSuccess: () => setEditTarget(null),
        });
    }
    function handleDelete() {
        router.delete(route("admin.citas.destroy", confirmDelete), {
            onSuccess: () => setConfirmDelete(null),
        });
    }

    const empleadoNombre = empleado_filtro
        ? (empleados.find((e) => e.id === empleado_filtro)?.nombre ?? "")
        : "";

    return (
        <AdminLayout title="Citas">
            <Head title="Citas — Admin" />

            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                        {empleadoNombre
                            ? `Citas — ${empleadoNombre}`
                            : "Agenda"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            {totalMes} total
                        </span>
                        {pendientes > 0 && (
                            <>
                                <span className="text-gold/20">·</span>
                                <span className="font-sans text-[10px] text-amber-400">
                                    {pendientes} pend.
                                </span>
                            </>
                        )}
                        {confirmadas > 0 && (
                            <>
                                <span className="text-gold/20">·</span>
                                <span className="font-sans text-[10px] text-blue-400">
                                    {confirmadas} conf.
                                </span>
                            </>
                        )}
                        {completadas > 0 && (
                            <>
                                <span className="text-gold/20">·</span>
                                <span className="font-sans text-[10px] text-green-400">
                                    {completadas} comp.
                                </span>
                            </>
                        )}
                        {canceladas > 0 && (
                            <>
                                <span className="text-gold/20">·</span>
                                <span className="font-sans text-[10px] text-red-400">
                                    {canceladas} canc.
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => openCreate()}
                    className="gold-gradient shimmer-btn flex items-center gap-2 px-5 py-2.5
                                   font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                                   text-gold-text rounded-sm hover:brightness-110 transition-all"
                >
                    <Icon name="add" className="text-[16px]" />
                    Nueva Cita
                </button>
            </div>

            {/* ── Filter bar ── */}
            <div
                className="flex flex-wrap items-center gap-3 mb-5 p-3
                            bg-white dark:bg-white/[0.03]
                            border border-spa-border dark:border-gold/10 rounded-md shadow-sm dark:shadow-none"
            >
                {/* Period tabs */}
                <div className="flex items-center rounded-sm border border-spa-border dark:border-gold/20 overflow-hidden">
                    {[
                        ["dia", "Día"],
                        ["semana", "Semana"],
                        ["mes", "Mes"],
                    ].map(([p, label]) => (
                        <button
                            key={p}
                            onClick={() => switchPeriodo(p)}
                            className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest transition-all
                                            ${
                                                periodo === p
                                                    ? "bg-gold/20 text-gold-mid dark:text-gold"
                                                    : "text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold-mid dark:hover:text-gold bg-white dark:bg-transparent"
                                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <span className="h-6 w-px bg-spa-border dark:bg-gold/15 hidden sm:block" />

                {/* Status pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <button
                        onClick={() => navigate({ estado: "" })}
                        className={`px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-wider border transition-all
                                        ${
                                            !estado_filtro
                                                ? "border-gold/50 text-gold-mid dark:text-gold bg-gold/10"
                                                : "border-spa-border dark:border-gold/15 text-spa-on-light-dim dark:text-spa-on-dark-dim hover:border-gold/40"
                                        }`}
                    >
                        Todos
                    </button>
                    {Object.entries(ESTADO).map(([k, v]) => (
                        <button
                            key={k}
                            onClick={() => navigate({ estado: k })}
                            className={`px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-wider border transition-all
                                            ${
                                                estado_filtro === k
                                                    ? `${v.bg} ${v.text} border-current`
                                                    : "border-spa-border dark:border-gold/15 text-spa-on-light-dim dark:text-spa-on-dark-dim hover:border-gold/40"
                                            }`}
                        >
                            {v.label}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <span className="h-6 w-px bg-spa-border dark:bg-gold/15 hidden sm:block" />

                {/* Employee filter */}
                <div className="flex items-center gap-2">
                    <Icon
                        name="person"
                        className="text-gold/50 text-[16px] shrink-0"
                    />
                    <select
                        value={empleado_filtro}
                        onChange={(e) =>
                            navigate({ empleado_id: e.target.value })
                        }
                        style={{ color: "#374151" }}
                        className="bg-white dark:bg-spa-bg
                                       border border-spa-border dark:border-gold/20 rounded-sm
                                       pl-2.5 pr-8 py-1.5 font-sans text-sm
                                       dark:text-white
                                       focus:border-gold/50 focus:outline-none cursor-pointer transition-colors
                                       min-w-[170px]"
                    >
                        <option value="">Todos los especialistas</option>
                        {empleados.map((e) => (
                            <option
                                className="text-black dark:text-white"
                                key={e.id}
                                value={e.id}
                            >
                                {e.nombre}
                            </option>
                        ))}
                    </select>
                    {empleado_filtro && (
                        <button
                            onClick={() => navigate({ empleado_id: "" })}
                            className="text-spa-on-light-dim dark:text-gold/40 hover:text-gold transition-colors"
                        >
                            <Icon name="close" className="text-[14px]" />
                        </button>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                VISTA MES — Calendar + side panel
            ══════════════════════════════════════════════════ */}
            {periodo === "mes" && (
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                    {/* Calendar */}
                    <div className="xl:col-span-3 kpi-card">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => goMonth(-1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                            >
                                <Icon
                                    name="chevron_left"
                                    className="text-[20px]"
                                />
                            </button>
                            <div className="text-center">
                                <h3 className="font-serif text-2xl text-spa-on-light dark:text-spa-on-dark">
                                    {MESES[month - 1]}
                                </h3>
                                <p className="font-sans text-[10px] text-gold/50 tracking-widest mt-0.5">
                                    {year}
                                </p>
                            </div>
                            <button
                                onClick={() => goMonth(1)}
                                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                            >
                                <Icon
                                    name="chevron_right"
                                    className="text-[20px]"
                                />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mb-2">
                            {DIAS_SEMANA.map((d) => (
                                <div
                                    key={d}
                                    className="text-center font-sans text-[9px] uppercase tracking-widest text-spa-on-light-dim dark:text-gold/30 py-1"
                                >
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {cells.map(({ date, current }, i) => {
                                const ds = toDateStr(date);
                                const dayCitas = citasByDate[ds] ?? [];
                                const isToday = ds === todayStr;
                                const isSelected = ds === selectedDate;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(ds)}
                                        className={`relative flex flex-col items-center pt-2 pb-1.5 px-1 rounded-md min-h-[56px] transition-all group
                                                ${!current ? "opacity-25" : ""}
                                                ${isSelected ? "bg-gold/15 ring-1 ring-gold/50" : isToday ? "ring-1 ring-gold/30 bg-gold/5" : "hover:bg-gold/5"}`}
                                    >
                                        <span
                                            className={`font-sans text-sm leading-none mb-1.5 transition-colors
                                            ${isSelected ? "text-gold font-semibold" : isToday ? "text-gold" : "text-spa-on-light dark:text-spa-on-dark"}`}
                                        >
                                            {date.getDate()}
                                        </span>
                                        {isToday && !isSelected && (
                                            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-gold" />
                                        )}
                                        {dayCitas.length > 0 && (
                                            <div className="flex items-center gap-0.5 flex-wrap justify-center">
                                                {dayCitas
                                                    .slice(0, 4)
                                                    .map((c, j) => (
                                                        <span
                                                            key={j}
                                                            className={`w-1.5 h-1.5 rounded-full ${ESTADO[c.estado]?.dot ?? "bg-gold/40"}`}
                                                        />
                                                    ))}
                                                {dayCitas.length > 4 && (
                                                    <span className="font-sans text-[8px] text-gold/50">
                                                        +{dayCitas.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gold/10 flex flex-wrap gap-x-4 gap-y-2">
                            {Object.entries(ESTADO).map(([k, v]) => (
                                <div
                                    key={k}
                                    className="flex items-center gap-1.5"
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${v.dot}`}
                                    />
                                    <span className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                        {v.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="xl:col-span-2 kpi-card flex flex-col">
                        <div className="flex items-start justify-between mb-5 pb-4 border-b border-gold/10">
                            <div>
                                <p className="font-sans text-[9px] uppercase tracking-widest text-gold/40 mb-0.5">
                                    {selectedCitas.length === 0
                                        ? "Sin citas"
                                        : `${selectedCitas.length} cita${selectedCitas.length > 1 ? "s" : ""}`}
                                </p>
                                <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark capitalize leading-tight">
                                    {selDateLabel}
                                </h3>
                            </div>
                            <button
                                onClick={() => openCreate(selectedDate)}
                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-sm border border-gold/30 text-gold font-sans text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all"
                            >
                                <Icon name="add" className="text-[14px]" />
                                Agregar
                            </button>
                        </div>
                        {selectedCitas.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                                <Icon
                                    name="event_available"
                                    className="text-gold/15 text-[52px] mb-3"
                                />
                                <p className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark">
                                    Día libre
                                </p>
                                <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-1 max-w-[180px]">
                                    No hay citas programadas.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto flex-1">
                                {selectedCitas.map((cita) => (
                                    <CitaCard
                                        key={cita.id}
                                        cita={cita}
                                        onEdit={openEdit}
                                        onDelete={setConfirmDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                VISTA SEMANA — 7 columnas
            ══════════════════════════════════════════════════ */}
            {periodo === "semana" && (
                <div className="kpi-card">
                    {/* Week nav */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-gold/10">
                        <button
                            onClick={() => goWeek(-1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                        >
                            <Icon name="chevron_left" className="text-[20px]" />
                        </button>
                        <div className="text-center">
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">
                                {weekLabel}
                            </h3>
                            <p className="font-sans text-[10px] text-gold/40 tracking-widest mt-0.5 uppercase">
                                {citas.length} cita
                                {citas.length !== 1 ? "s" : ""} esta semana
                            </p>
                        </div>
                        <button
                            onClick={() => goWeek(1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                        >
                            <Icon
                                name="chevron_right"
                                className="text-[20px]"
                            />
                        </button>
                    </div>

                    {/* 7 columns */}
                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((ds, i) => {
                            const dayCitas = (citasByDate[ds] ?? [])
                                .slice()
                                .sort((a, b) => a.hora.localeCompare(b.hora));
                            const isToday = ds === todayStr;
                            const dateObj = new Date(ds + "T12:00:00");
                            return (
                                <div
                                    key={ds}
                                    className={`rounded-md border transition-all ${isToday ? "border-gold/40 bg-gold/5" : "border-gold/10"}`}
                                >
                                    {/* Day header */}
                                    <div
                                        className={`px-2 py-2 border-b ${isToday ? "border-gold/20" : "border-gold/10"} text-center`}
                                    >
                                        <p
                                            className={`font-sans text-[9px] uppercase tracking-widest ${isToday ? "text-gold" : "text-spa-on-dark-dim"}`}
                                        >
                                            {DIAS_SEMANA[i]}
                                        </p>
                                        <p
                                            className={`font-serif text-lg leading-none mt-0.5 ${isToday ? "text-gold" : "text-spa-on-light dark:text-spa-on-dark"}`}
                                        >
                                            {dateObj.getDate()}
                                        </p>
                                        {dayCitas.length > 0 && (
                                            <p className="font-sans text-[8px] text-gold/50 mt-0.5">
                                                {dayCitas.length} cita
                                                {dayCitas.length > 1 ? "s" : ""}
                                            </p>
                                        )}
                                    </div>
                                    {/* Citas */}
                                    <div className="p-1.5 space-y-1.5 min-h-[80px]">
                                        {dayCitas.length === 0 ? (
                                            <p className="font-sans text-[9px] text-spa-on-dark-dim/30 text-center py-3 italic">
                                                —
                                            </p>
                                        ) : (
                                            dayCitas.map((cita) => {
                                                const s =
                                                    ESTADO[cita.estado] ??
                                                    ESTADO.PENDIENTE;
                                                return (
                                                    <button
                                                        key={cita.id}
                                                        onClick={() =>
                                                            openEdit(cita)
                                                        }
                                                        className={`w-full text-left p-1.5 rounded-sm border ${s.bg} border-current/20 transition-all hover:brightness-110`}
                                                    >
                                                        <p
                                                            className={`font-sans text-[9px] font-semibold ${s.text}`}
                                                        >
                                                            {cita.hora}
                                                        </p>
                                                        <p className="font-sans text-[9px] text-spa-on-dark truncate">
                                                            {cita.cliente}
                                                        </p>
                                                        <p className="font-sans text-[8px] text-spa-on-dark-dim truncate italic">
                                                            {cita.servicio}
                                                        </p>
                                                    </button>
                                                );
                                            })
                                        )}
                                        <button
                                            onClick={() => openCreate(ds)}
                                            className="w-full flex items-center justify-center py-1 text-gold/20 hover:text-gold/50 transition-colors rounded-sm"
                                        >
                                            <Icon
                                                name="add"
                                                className="text-[14px]"
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                VISTA DÍA — Lista completa
            ══════════════════════════════════════════════════ */}
            {periodo === "dia" && (
                <div className="kpi-card">
                    {/* Day nav */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-gold/10">
                        <button
                            onClick={() => goDay(-1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                        >
                            <Icon name="chevron_left" className="text-[20px]" />
                        </button>
                        <div className="text-center">
                            <h3 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark capitalize">
                                {diaLabel}
                            </h3>
                            <p className="font-sans text-[10px] text-gold/40 tracking-widest mt-0.5 uppercase">
                                {diaCitas.length === 0
                                    ? "Sin citas"
                                    : `${diaCitas.length} cita${diaCitas.length > 1 ? "s" : ""}`}
                            </p>
                        </div>
                        <button
                            onClick={() => goDay(1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/20 text-gold/60 hover:text-gold hover:border-gold/50 transition-all"
                        >
                            <Icon
                                name="chevron_right"
                                className="text-[20px]"
                            />
                        </button>
                    </div>

                    {diaCitas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <Icon
                                name="event_available"
                                className="text-gold/15 text-[60px] mb-4"
                            />
                            <p className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark">
                                Día libre
                            </p>
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim mt-2">
                                No hay citas para este día.
                            </p>
                            <button
                                onClick={() => openCreate(fecha)}
                                className="mt-5 flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-sm text-gold font-sans text-[10px] uppercase tracking-widest hover:bg-gold/10 transition-all"
                            >
                                <Icon name="add" className="text-[14px]" />
                                Nueva cita
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {diaCitas.map((cita) => (
                                <CitaCard
                                    key={cita.id}
                                    cita={cita}
                                    onEdit={openEdit}
                                    onDelete={setConfirmDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Modal: Nueva Cita ── */}
            <Modal
                open={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                    form.reset();
                }}
                title="Nueva Cita"
                wide
            >
                <form onSubmit={submitCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Cliente" error={form.errors.cliente_id}>
                            <select
                                value={form.data.cliente_id}
                                onChange={(e) =>
                                    form.setData("cliente_id", e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="">Seleccionar...</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Especialista"
                            error={form.errors.empleado_id}
                        >
                            <select
                                value={form.data.empleado_id}
                                onChange={(e) =>
                                    form.setData("empleado_id", e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="">Seleccionar...</option>
                                {empleados.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre}
                                        {e.especialidad
                                            ? ` — ${e.especialidad}`
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field label="Servicio" error={form.errors.servicio_id}>
                        <select
                            value={form.data.servicio_id}
                            onChange={(e) =>
                                form.setData("servicio_id", e.target.value)
                            }
                            className={selectCls}
                        >
                            <option value="">Seleccionar servicio...</option>
                            {servicios.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre} — {s.duracion} min
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Fecha y hora"
                            error={form.errors.fecha_hora_inicio}
                        >
                            <input
                                type="datetime-local"
                                value={form.data.fecha_hora_inicio}
                                onChange={(e) =>
                                    form.setData(
                                        "fecha_hora_inicio",
                                        e.target.value,
                                    )
                                }
                                className={inputCls}
                            />
                        </Field>
                        <Field
                            label="Precio ($)"
                            error={form.errors.precio_cobrado}
                        >
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.data.precio_cobrado}
                                onChange={(e) =>
                                    form.setData(
                                        "precio_cobrado",
                                        e.target.value,
                                    )
                                }
                                className={inputCls}
                                placeholder="0.00"
                            />
                        </Field>
                    </div>
                    <Field
                        label="Notas del cliente"
                        error={form.errors.notas_cliente}
                    >
                        <textarea
                            value={form.data.notas_cliente}
                            rows={2}
                            onChange={(e) =>
                                form.setData("notas_cliente", e.target.value)
                            }
                            className={inputCls}
                            placeholder="Observaciones opcionales..."
                        />
                    </Field>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setCreateOpen(false);
                                form.reset();
                            }}
                            className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {form.processing ? "Guardando..." : "Crear Cita"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Editar ── */}
            <Modal
                open={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Editar Cita"
            >
                {editTarget && (
                    <form onSubmit={submitEdit} className="space-y-4">
                        <div className="p-3 bg-gold/5 rounded-sm border border-gold/10">
                            <p className="font-sans text-sm font-medium text-spa-on-dark">
                                {editTarget.cliente}
                            </p>
                            <p className="font-sans text-xs italic text-spa-on-dark-dim mt-0.5">
                                {editTarget.servicio} · {editTarget.fecha}{" "}
                                {editTarget.hora}
                            </p>
                        </div>
                        <Field label="Estado" error={editForm.errors.estado}>
                            <select
                                value={editForm.data.estado}
                                onChange={(e) =>
                                    editForm.setData("estado", e.target.value)
                                }
                                className={selectCls}
                            >
                                {Object.entries(ESTADO).map(([k, v]) => (
                                    <option key={k} value={k}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field
                            label="Precio cobrado ($)"
                            error={editForm.errors.precio_cobrado}
                        >
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.data.precio_cobrado}
                                onChange={(e) =>
                                    editForm.setData(
                                        "precio_cobrado",
                                        e.target.value,
                                    )
                                }
                                className={inputCls}
                            />
                        </Field>
                        <Field
                            label="Notas del especialista"
                            error={editForm.errors.notas_empleado}
                        >
                            <textarea
                                value={editForm.data.notas_empleado}
                                rows={3}
                                onChange={(e) =>
                                    editForm.setData(
                                        "notas_empleado",
                                        e.target.value,
                                    )
                                }
                                className={inputCls}
                                placeholder="Observaciones internas..."
                            />
                        </Field>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setEditTarget(null)}
                                className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={editForm.processing}
                                className="gold-gradient px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-text rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {editForm.processing
                                    ? "Guardando..."
                                    : "Actualizar"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* ── Modal: Confirmar borrado ── */}
            <Modal
                open={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Eliminar Cita"
            >
                <p className="font-sans text-sm text-spa-on-dark mb-6">
                    ¿Eliminar esta cita? La acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-4 py-2 font-sans text-[10px] uppercase tracking-widest border border-gold/20 text-gold/60 hover:text-gold rounded-sm transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-semibold bg-red-500/80 hover:bg-red-500 text-white rounded-sm transition-all"
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>
        </AdminLayout>
    );
}
