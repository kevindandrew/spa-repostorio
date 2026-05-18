import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';

function Icon({ name, className = '' }) {
    return (
        <span className={`material-symbols-outlined ${className}`}
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function DeleteUserForm() {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    function openModal()  { setConfirming(true); }
    function closeModal() { setConfirming(false); clearErrors(); reset(); }

    function submit(e) {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError:   () => passwordInput.current?.focus(),
            onFinish:  () => reset(),
        });
    }

    return (
        <section>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-red-500/20">
                <div className="w-10 h-10 rounded-sm bg-red-500/10 flex items-center justify-center shrink-0">
                    <Icon name="delete_forever" className="text-red-400 text-[20px]" />
                </div>
                <div>
                    <h2 className="font-serif text-xl text-red-400 font-normal">
                        Eliminar cuenta
                    </h2>
                    <p className="font-sans text-xs text-spa-on-light-dim dark:text-spa-on-dark-dim mt-0.5">
                        Tu cuenta quedará desactivada. Solo un administrador puede reactivarla.
                    </p>
                </div>
            </div>

            <button onClick={openModal}
                    className="flex items-center gap-2 px-6 py-3 rounded-sm
                               border border-red-500/30 text-red-400
                               font-sans text-[11px] uppercase tracking-[0.2em] font-semibold
                               hover:bg-red-500/10 hover:border-red-500/50 transition-all">
                <Icon name="delete_forever" className="text-[15px]" />
                Eliminar mi cuenta
            </button>

            {/* Modal confirmación */}
            {confirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     onClick={closeModal}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-md bg-white dark:bg-spa-surface-low
                                    border border-red-500/20 rounded-sm shadow-2xl"
                         onClick={e => e.stopPropagation()}>

                        {/* Header modal */}
                        <div className="flex items-center justify-between px-6 py-5
                                        border-b border-red-500/15">
                            <div className="flex items-center gap-3">
                                <Icon name="warning" className="text-red-400 text-[22px]" />
                                <h3 className="font-serif text-lg text-spa-on-light dark:text-spa-on-dark">
                                    ¿Eliminar tu cuenta?
                                </h3>
                            </div>
                            <button onClick={closeModal}
                                    className="text-spa-on-light-dim dark:text-spa-on-dark-dim
                                               hover:text-spa-on-light dark:hover:text-spa-on-dark transition-colors">
                                <Icon name="close" className="text-[20px]" />
                            </button>
                        </div>

                        {/* Cuerpo modal */}
                        <form onSubmit={submit} className="px-6 py-5 space-y-5">
                            <p className="font-sans text-sm text-spa-on-light-dim dark:text-spa-on-dark-dim leading-relaxed">
                                Tu cuenta quedará desactivada y no podrás iniciar sesión. Tu historial de citas se conserva. Si deseas reactivarla, deberás contactar a un administrador del spa.
                            </p>

                            <div>
                                <label className="block font-sans text-[10px] uppercase tracking-widest
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Ingresa tu contraseña"
                                    autoFocus
                                    className="w-full bg-white dark:bg-spa-surface
                                               border border-spa-border dark:border-gold/20 rounded-sm
                                               px-4 py-3 font-sans text-sm
                                               text-spa-on-light dark:text-spa-on-dark
                                               placeholder:text-spa-on-light-dim/40 dark:placeholder:text-spa-on-dark-dim/40
                                               focus:outline-none focus:border-red-400/60 transition-all"
                                />
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 border border-spa-border dark:border-gold/20
                                                   rounded-sm font-sans text-[11px] uppercase tracking-wider
                                                   text-spa-on-light-dim dark:text-spa-on-dark-dim
                                                   hover:border-gold/40 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit"
                                        disabled={processing || !data.password}
                                        className="flex-1 py-3 bg-red-500/10 border border-red-500/30
                                                   rounded-sm font-sans text-[11px] uppercase tracking-wider
                                                   text-red-400 hover:bg-red-500/20 hover:border-red-500/50
                                                   transition-all flex items-center justify-center gap-2
                                                   disabled:opacity-40 disabled:cursor-not-allowed">
                                    {processing
                                        ? <><Icon name="autorenew" className="text-[13px] animate-spin" /> Eliminando...</>
                                        : <><Icon name="delete_forever" className="text-[13px]" /> Sí, eliminar</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
