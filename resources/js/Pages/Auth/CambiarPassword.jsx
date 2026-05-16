import { Head, useForm } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import InputError from "@/Components/InputError";
import { useState } from "react";

function Icon({ name }) {
    return (
        <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
        >
            {name}
        </span>
    );
}

function GoldWave({ className }) {
    return (
        <svg className={className} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M250 50 C350 50, 450 150, 450 250 C450 350, 350 450, 250 450 C150 450, 50 350, 50 250 C50 150, 150 50, 250 50Z"
                stroke="rgba(232,193,127,0.15)" strokeWidth="1" fill="none" />
            <path d="M250 100 C330 100, 400 170, 400 250 C400 330, 330 400, 250 400 C170 400, 100 330, 100 250 C100 170, 170 100, 250 100Z"
                stroke="rgba(232,193,127,0.1)" strokeWidth="1" fill="none" />
            <path d="M50 250 Q150 100, 250 250 Q350 400, 450 250"
                stroke="rgba(232,193,127,0.12)" strokeWidth="1" fill="none" />
        </svg>
    );
}

export default function CambiarPassword() {
    const { dark, toggle } = useTheme();
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.change.update"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Cambiar contraseña" />

            <div className="flex h-screen overflow-hidden">
                {/* Panel izquierdo */}
                <div className="hidden md:flex w-1/2 bg-spa-bg relative flex-col items-center justify-center overflow-hidden">
                    <GoldWave className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-60" />
                    <GoldWave className="absolute -bottom-32 -right-32 w-[400px] h-[400px] opacity-40 rotate-45" />
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(135deg, rgba(232,193,127,0.03) 0%, transparent 60%)" }} />

                    <div className="relative z-10 text-center px-12">
                        <img src="/images/MARCELO%20BLANCO.png" alt="Marcelo Ruiz"
                            className="h-12 mx-auto mb-6 drop-shadow-[0_2px_10px_rgba(232,193,127,0.35)]" />
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-10 bg-gold/30" />
                            <span className="text-gold text-xs">✦</span>
                            <span className="h-px w-10 bg-gold/30" />
                        </div>
                        <img src="/images/NINFA%20BLANCO.png" alt="Ninfa Rodriguez"
                            className="h-12 mx-auto mb-6 drop-shadow-[0_2px_10px_rgba(232,193,127,0.35)]" />
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-10 bg-gold/30" />
                            <span className="text-gold text-xs">✦</span>
                            <span className="h-px w-10 bg-gold/30" />
                        </div>
                        <p className="font-serif italic text-spa-on-dark-dim/60 text-base leading-relaxed max-w-xs mx-auto">
                            "Tu seguridad es nuestra prioridad."
                        </p>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center
                                bg-spa-ivory dark:bg-spa-surface px-8 relative">
                    <button onClick={toggle}
                        className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5
                                   rounded-full border border-spa-border dark:border-gold/20
                                   text-spa-on-light-dim dark:text-gold/60
                                   hover:border-gold/50 transition-all
                                   font-sans text-[10px] uppercase tracking-widest">
                        <Icon name={dark ? "light_mode" : "dark_mode"} />
                        {dark ? "Light" : "Dark"}
                    </button>

                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                    <Icon name="lock_reset" />
                                </div>
                                <div className="h-px flex-1 bg-gold/20" />
                            </div>
                            <h2 className="font-serif text-4xl font-normal italic text-gold-mid dark:text-gold mb-2">
                                Nueva contraseña
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-px w-8 bg-gold/30" />
                                <span className="text-gold/50 text-xs">✦</span>
                            </div>
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                Por seguridad debes establecer una contraseña personal antes de continuar.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {/* Nueva contraseña */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Nueva contraseña
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="lock" />
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="••••••••"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                        autoFocus
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)}
                                        className="text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors">
                                        <Icon name={showNew ? "visibility_off" : "visibility"} />
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1 text-xs" />
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Confirmar contraseña
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="lock_check" />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        placeholder="••••••••"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors">
                                        <Icon name={showConfirm ? "visibility_off" : "visibility"} />
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full gold-gradient shimmer-btn py-4 rounded-none
                                           font-sans text-[11px] uppercase tracking-[0.25em] font-semibold
                                           text-gold-text hover:brightness-110 active:scale-[0.99]
                                           transition-all duration-300 disabled:opacity-60">
                                {processing ? "Guardando..." : "Establecer contraseña →"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
