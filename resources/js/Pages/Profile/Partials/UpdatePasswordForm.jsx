import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
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

export default function UpdatePasswordForm() {
    const passwordInput        = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    }

    return (
        <section>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-spa-border dark:border-gold/10">
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon name="lock" className="text-gold text-[20px]" />
                </div>
                <div>
                    <h2 className="font-serif text-xl text-spa-on-light dark:text-spa-on-dark font-normal">
                        Cambiar contraseña
                    </h2>
                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        Usa una contraseña larga y segura para proteger tu cuenta
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Contraseña actual */}
                <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest
                                       text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                        Contraseña actual
                    </label>
                    <input
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className={inputCls}
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                {/* Nueva contraseña */}
                <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest
                                       text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                        Nueva contraseña
                    </label>
                    <input
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className={inputCls}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Confirmar contraseña */}
                <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest
                                       text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                        Confirmar nueva contraseña
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className={inputCls}
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

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
                            ? <><Icon name="autorenew" className="text-[14px] animate-spin" /> Actualizando...</>
                            : <><Icon name="shield" className="text-[14px]" /> Actualizar contraseña</>
                        }
                    </button>

                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 font-sans text-xs text-green-400">
                            <Icon name="check_circle" className="text-[14px]" />
                            Contraseña actualizada
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
