import { Head, Link, useForm } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import InputError from "@/Components/InputError";

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

export default function Register() {
    const { dark, toggle } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: "",
        correo: "",
        telefono: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Crear cuenta" />

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
                            "Únete a nuestra comunidad de bienestar y belleza."
                        </p>
                    </div>
                </div>

                {/* Panel derecho */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center
                                bg-spa-ivory dark:bg-spa-surface px-8 relative overflow-y-auto py-8">
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
                        <div className="mb-8">
                            <h2 className="font-serif text-4xl font-normal italic text-gold-mid dark:text-gold mb-2">
                                Crear cuenta
                            </h2>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="h-px w-8 bg-gold/30" />
                                <span className="text-gold/50 text-xs">✦</span>
                            </div>
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim">
                                Regístrate para reservar tus citas y más
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Nombre */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Nombre completo
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="person" />
                                    <input
                                        type="text"
                                        name="nombre"
                                        autoFocus
                                        value={data.nombre}
                                        onChange={(e) => setData("nombre", e.target.value)}
                                        placeholder="Tu nombre completo"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                </div>
                                <InputError message={errors.nombre} className="mt-1 text-xs" />
                            </div>

                            {/* Correo */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Correo electrónico
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="mail" />
                                    <input
                                        type="email"
                                        name="correo"
                                        autoComplete="email"
                                        value={data.correo}
                                        onChange={(e) => setData("correo", e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                </div>
                                <InputError message={errors.correo} className="mt-1 text-xs" />
                            </div>

                            {/* Teléfono */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Teléfono <span className="normal-case tracking-normal opacity-50">(opcional)</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="phone" />
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={data.telefono}
                                        onChange={(e) => setData("telefono", e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                </div>
                                <InputError message={errors.telefono} className="mt-1 text-xs" />
                            </div>

                            {/* Contraseña */}
                            <div className="relative">
                                <label className="font-sans text-[10px] text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                  uppercase tracking-[0.25em] block mb-1">
                                    Contraseña
                                </label>
                                <div className="flex items-center gap-3">
                                    <Icon name="lock" />
                                    <input
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="••••••••"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
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
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        placeholder="••••••••"
                                        className="input-luxury-light dark:input-luxury flex-1"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full gold-gradient shimmer-btn py-4 rounded-none
                                           font-sans text-[11px] uppercase tracking-[0.25em] font-semibold
                                           text-gold-text hover:brightness-110 active:scale-[0.99]
                                           transition-all duration-300 disabled:opacity-60">
                                {processing ? "Creando cuenta..." : "Crear cuenta →"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center gap-3 justify-center mb-4">
                                <span className="h-px flex-1 bg-spa-border dark:bg-gold/10" />
                                <span className="font-sans text-[9px] text-spa-on-light-dim/50 dark:text-gold/30 uppercase tracking-[0.3em]">
                                    ¿Ya tienes cuenta?
                                </span>
                                <span className="h-px flex-1 bg-spa-border dark:bg-gold/10" />
                            </div>
                            <Link href={route("login")}
                                className="font-sans text-[10px] uppercase tracking-widest text-gold-mid hover:text-gold transition-colors">
                                Iniciar sesión →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
