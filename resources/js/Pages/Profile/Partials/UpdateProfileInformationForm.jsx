import { Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

const inputCls = `w-full bg-white dark:bg-spa-surface-low
                  border border-spa-border dark:border-gold/20 rounded-sm
                  px-4 py-3 font-sans text-sm
                  text-spa-on-light dark:text-spa-on-dark
                  placeholder:text-spa-on-light-dim/40 dark:placeholder:text-spa-on-dark-dim/40
                  focus:outline-none focus:border-gold/60 transition-all`;

export default function UpdateProfileInformationForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nombre: user.nombre ?? '',
        correo: user.correo ?? '',
    });

    function submit(e) {
        e.preventDefault();
        patch(route('profile.update'));
    }

    return (
        <section>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-spa-border dark:border-gold/10">
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon name="person" className="text-gold text-[20px]" />
                </div>
                <div>
                    <h2 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        Información personal
                    </h2>
                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        Actualiza tu nombre y correo electrónico
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Nombre */}
                <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest
                                       text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                        Nombre completo
                    </label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={e => setData('nombre', e.target.value)}
                        autoComplete="name"
                        autoFocus
                        className={inputCls}
                    />
                    <InputError message={errors.nombre} className="mt-1.5" />
                </div>

                {/* Correo */}
                <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest
                                       text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={data.correo}
                        onChange={e => setData('correo', e.target.value)}
                        autoComplete="email"
                        className={inputCls}
                    />
                    <InputError message={errors.correo} className="mt-1.5" />
                </div>

                {/* Email no verificado */}
                {mustVerifyEmail && !user.correo_verificado && (
                    <div className="px-4 py-3 rounded-sm bg-amber-400/10 border border-amber-400/20">
                        <p className="font-sans text-xs text-amber-400">
                            Tu correo no está verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline hover:opacity-70 transition-opacity"
                            >
                                Reenviar verificación
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-sans text-xs text-green-400">
                                Correo de verificación enviado.
                            </p>
                        )}
                    </div>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-4 pt-2">
                    <button type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-3 rounded-sm
                                       gold-gradient shimmer-btn font-sans text-[11px]
                                       uppercase tracking-[0.2em] font-semibold text-gold-text
                                       hover:brightness-110 transition-all
                                       disabled:opacity-50 disabled:cursor-not-allowed">
                        {processing
                            ? <><Icon name="autorenew" className="text-[14px] animate-spin" /> Guardando...</>
                            : <><Icon name="save" className="text-[14px]" /> Guardar cambios</>
                        }
                    </button>

                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 font-sans text-xs text-green-400">
                            <Icon name="check_circle" className="text-[14px]" />
                            Guardado
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
