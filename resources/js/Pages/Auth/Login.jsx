import { Head, useForm } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import InputError from "@/Components/InputError";
import { useState } from "react";

function Icon({ name }) {
    return (
        <span
            className="material-symbols-outlined text-[18px]"
            style={{
                fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
            }}
        >
            {name}
        </span>
    );
}

/* SVG decorativo: onda dorada de fondo */
function GoldWave({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M250 50 C350 50, 450 150, 450 250 C450 350, 350 450, 250 450 C150 450, 50 350, 50 250 C50 150, 150 50, 250 50Z"
                stroke="rgba(232,193,127,0.15)"
                strokeWidth="1"
                fill="none"
            />
            <path
                d="M250 100 C330 100, 400 170, 400 250 C400 330, 330 400, 250 400 C170 400, 100 330, 100 250 C100 170, 170 100, 250 100Z"
                stroke="rgba(232,193,127,0.1)"
                strokeWidth="1"
                fill="none"
            />
            <path
                d="M50 250 Q150 100, 250 250 Q350 400, 450 250"
                stroke="rgba(232,193,127,0.12)"
                strokeWidth="1"
                fill="none"
            />
        </svg>
    );
}

export default function Login({ status, canResetPassword }) {
    const { dark, toggle } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="flex h-screen overflow-hidden">
                {/* ── Panel izquierdo: siempre oscuro ── */}
                <div className="hidden md:flex w-1/2 bg-spa-bg relative flex-col items-center justify-center overflow-hidden">
                    {/* Decoración: ondas doradas */}
                    <GoldWave className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-60" />
                    <GoldWave className="absolute -bottom-32 -right-32 w-[400px] h-[400px] opacity-40 rotate-45" />

                    {/* Línea diagonal sutil */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(232,193,127,0.03) 0%, transparent 60%)",
                        }}
                    />

                    {/* Logo + Brand */}
                    <div className="relative z-10 text-center px-12">
                        <img
                            src="/images/MARCELO%20BLANCO.png"
                            alt="Marcelo Ruiz"
                            className="h-12 mx-auto mb-6 drop-shadow-[0_2px_10px_rgba(232,193,127,0.35)]"
                        />

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-10 bg-gold/30" />
                            <span className="text-gold text-xs">✦</span>
                            <span className="h-px w-10 bg-gold/30" />
                        </div>

                        <img
                            src="/images/NINFA%20BLANCO.png"
                            alt="Ninfa Rodriguez"
                            className="h-12 mx-auto mb-6 drop-shadow-[0_2px_10px_rgba(232,193,127,0.35)]"
                        />

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <span className="h-px w-10 bg-gold/30" />
                            <span className="text-gold text-xs">✦</span>
                            <span className="h-px w-10 bg-gold/30" />
                        </div>

                        {/* <img src="/images/Recurso%205DIANA%20RUIZ%20LOGO2.png" alt="Diana Ruiz Maquillaje"
                             className="h-10 mx-auto mb-16 drop-shadow-[0_2px_10px_rgba(232,193,127,0.35)]" /> */}

                        <p className="font-serif italic text-spa-on-dark-dim/60 text-base leading-relaxed max-w-xs mx-auto">
                            "Step into a realm of curated beauty and timeless
                            sophistication."
                        </p>
                    </div>
                </div>

                {/* ── Panel derecho: cambia con el tema ── */}
                <div
                    className="w-full md:w-1/2 flex flex-col items-center justify-center
                                bg-spa-ivory dark:bg-spa-surface px-8 relative"
                >
                    {/* Toggle tema top-right */}
                    <button
                        onClick={toggle}
                        className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5
                                       rounded-full border border-spa-border dark:border-gold/20
                                       text-spa-on-light-dim dark:text-gold/60
                                       hover:border-gold/50 transition-all
                                       font-sans text-[10px] uppercase tracking-widest"
                    >
                        <Icon name={dark ? "light_mode" : "dark_mode"} />
                        {dark ? "Light" : "Dark"}
                    </button>

                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-10">
                            <h2
                                className="font-serif text-4xl font-normal italic
                                           text-gold-mid dark:text-gold mb-2"
                            >
                                Bienvenido
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-px w-8 bg-gold/30" />
                                <span className="text-gold/50 text-xs">✦</span>
                            </div>
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                Ingresa tus credenciales para acceder al portal
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-8">
                            {/* Email */}
                            <div className="relative">
                                <label
                                    className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1"
                                >
                                    Correo electrónico
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="mail" />
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="correo@ejemplo.com"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                </div>
                                <InputError
                                    message={errors.email}
                                    className="mt-1 text-xs"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <div className="flex justify-between mb-1">
                                    <label
                                        className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                      uppercase tracking-[0.25em]"
                                    >
                                        Contraseña
                                    </label>
                                    {canResetPassword && (
                                        <a
                                            href={route("password.request")}
                                            className="font-sans text-[10px] text-gold-mid hover:text-gold
                                                      uppercase tracking-widest transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="lock" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-spa-on-light-dim dark:text-spa-on-dark-dim hover:text-gold transition-colors"
                                    >
                                        <Icon name={showPassword ? "visibility_off" : "visibility"} />
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-1 text-xs"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full gold-gradient shimmer-btn py-4 rounded-none
                                           font-sans text-[11px] uppercase tracking-[0.25em] font-semibold
                                           text-gold-text hover:brightness-110 active:scale-[0.99]
                                           transition-all duration-300 disabled:opacity-60"
                            >
                                {processing
                                    ? "Ingresando..."
                                    : "Iniciar Sesión →"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-10 text-center">
                            <div className="flex items-center gap-3 justify-center mb-4">
                                <span className="h-px flex-1 bg-spa-border dark:bg-gold/10" />
                                <span
                                    className="font-sans text-[9px] text-spa-on-light-dim/50 dark:text-gold/30
                                                 uppercase tracking-[0.3em]"
                                >
                                    ¿No tienes cuenta?
                                </span>
                                <span className="h-px flex-1 bg-spa-border dark:bg-gold/10" />
                            </div>
                            <a href={route("register")}
                               className="font-sans text-[10px] uppercase tracking-widest text-gold-mid hover:text-gold transition-colors">
                                Crear cuenta →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
