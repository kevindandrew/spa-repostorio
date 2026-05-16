import { Head, useForm, router } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import { useRef, useState } from "react";

function Icon({ name }) {
    return (
        <span className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

function OTPInput({ value, onChange }) {
    const inputs = useRef([]);

    function handleChange(i, e) {
        const val = e.target.value.replace(/\D/g, "").slice(-1);
        const next = [...value];
        next[i] = val;
        onChange(next);
        if (val && i < 5) inputs.current[i + 1]?.focus();
    }

    function handleKeyDown(i, e) {
        if (e.key === "Backspace" && !value[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
    }

    function handlePaste(e) {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (text.length === 6) {
            onChange(text.split(""));
            inputs.current[5]?.focus();
        }
        e.preventDefault();
    }

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }, (_, i) => (
                <input key={i}
                    ref={el => inputs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={value[i] || ""}
                    autoFocus={i === 0}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center font-serif text-2xl
                               bg-white dark:bg-spa-bg
                               border-b-2 border-spa-border dark:border-gold/20
                               focus:border-gold dark:focus:border-gold
                               text-spa-on-light dark:text-gold
                               focus:outline-none transition-colors" />
            ))}
        </div>
    );
}

export default function VerificarDosFactores({ correo, status }) {
    const { dark, toggle } = useTheme();
    const [digits, setDigits] = useState(Array(6).fill(""));
    const [reenviando, setReenviando] = useState(false);

    const { post, processing, errors, setData } = useForm({ codigo: "" });

    function handleDigitsChange(next) {
        setDigits(next);
        setData("codigo", next.join(""));
    }

    function submit(e) {
        e.preventDefault();
        post(route("2fa.store"));
    }

    function reenviar() {
        setReenviando(true);
        router.post(route("2fa.reenviar"), {}, {
            onFinish: () => setReenviando(false),
        });
    }

    return (
        <>
            <Head title="Verificación en dos pasos" />

            <div className="min-h-screen flex items-center justify-center
                            bg-spa-ivory dark:bg-spa-bg px-6 relative">
                <button onClick={toggle}
                    className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5
                               rounded-full border border-spa-border dark:border-gold/20
                               text-spa-on-light-dim dark:text-gold/60 hover:border-gold/50 transition-all
                               font-sans text-[10px] uppercase tracking-widest">
                    <Icon name={dark ? "light_mode" : "dark_mode"} />
                    {dark ? "Light" : "Dark"}
                </button>

                <div className="w-full max-w-md">
                    {/* Icono */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30
                                        flex items-center justify-center">
                            <span className="material-symbols-outlined text-gold text-[32px]"
                                style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}>
                                shield_lock
                            </span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-4xl font-normal italic text-gold-mid dark:text-gold mb-3">
                            Verificación
                        </h2>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="h-px w-8 bg-gold/30" />
                            <span className="text-gold/50 text-xs">✦</span>
                            <span className="h-px w-8 bg-gold/30" />
                        </div>
                        <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            Enviamos un código de seguridad a
                        </p>
                        <p className="font-sans text-sm font-medium text-gold-mid dark:text-gold mt-1">
                            {correo}
                        </p>
                    </div>

                    {/* Flash */}
                    {status && (
                        <div className="mb-6 flex items-center gap-2 bg-green-50 dark:bg-green-900/20
                                        border border-green-200 dark:border-green-500/30 px-4 py-3 rounded-sm">
                            <Icon name="check_circle" />
                            <p className="font-sans text-sm text-green-700 dark:text-green-400">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        <OTPInput value={digits} onChange={handleDigitsChange} />

                        {errors.codigo && (
                            <p className="text-center font-sans text-xs text-red-500">{errors.codigo}</p>
                        )}

                        <button type="submit" disabled={processing || digits.join("").length < 6}
                            className="w-full gold-gradient shimmer-btn py-4 rounded-none
                                       font-sans text-[11px] uppercase tracking-[0.25em] font-semibold
                                       text-gold-text hover:brightness-110 active:scale-[0.99]
                                       transition-all duration-300 disabled:opacity-50">
                            {processing ? "Verificando..." : "Ingresar →"}
                        </button>
                    </form>

                    {/* Reenviar */}
                    <div className="mt-8 text-center space-y-3">
                        <p className="font-sans text-[11px] text-spa-on-light-dim dark:text-spa-on-dark-dim">
                            ¿No recibiste el código?
                        </p>
                        <button onClick={reenviar} disabled={reenviando}
                            className="font-sans text-[10px] uppercase tracking-widest text-gold-mid hover:text-gold
                                       transition-colors disabled:opacity-50">
                            {reenviando ? "Reenviando..." : "Reenviar código"}
                        </button>
                        <div className="pt-2">
                            <a href={route("login")}
                                className="font-sans text-[10px] uppercase tracking-widest
                                           text-spa-on-light-dim/50 dark:text-spa-on-dark-dim/40
                                           hover:text-gold/60 transition-colors">
                                ← Volver al login
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
