/**
 * Stars — muestra o selecciona calificación de 1-5
 * Props:
 *   value      (number)   — valor actual
 *   onChange   (fn)       — si se pasa, actúa como input interactivo
 *   size       (string)   — clase tailwind de tamaño, default 'text-[18px]'
 *   showEmpty  (bool)     — muestra estrellas vacías cuando value=0
 */
export default function Stars({ value = 0, onChange, size = 'text-[18px]', showEmpty = true }) {
    const interactive = typeof onChange === 'function';

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(n => {
                const filled = n <= value;
                return (
                    <span key={n}
                          onClick={() => interactive && onChange(n)}
                          style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24` }}
                          className={`material-symbols-outlined select-none transition-all duration-100
                                      ${size}
                                      ${filled ? 'text-gold' : 'text-gold/25'}
                                      ${interactive ? 'cursor-pointer hover:text-gold hover:scale-110' : ''}
                                      ${!showEmpty && !filled ? 'opacity-0' : ''}
                                     `}>
                        star
                    </span>
                );
            })}
        </div>
    );
}
