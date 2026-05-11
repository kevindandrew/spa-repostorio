import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function Icon({ name }) {
    return (
        <span className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
            {name}
        </span>
    );
}

export default function FlashToast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [msg, setMsg]         = useState({ text: '', type: 'success' });

    useEffect(() => {
        const text = flash?.success || flash?.error;
        const type = flash?.error ? 'error' : 'success';
        if (text) {
            setMsg({ text, type });
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 3500);
            return () => clearTimeout(t);
        }
    }, [flash?.success, flash?.error]);

    if (!visible) return null;

    const isError = msg.type === 'error';

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3
                         px-5 py-3.5 rounded-sm shadow-2xl
                         font-sans text-sm max-w-sm
                         border backdrop-blur-sm
                         animate-[fadeInUp_0.3s_ease]
                         ${isError
                             ? 'bg-red-950/90 border-red-500/30 text-red-300'
                             : 'bg-spa-surface/95 border-gold/30 text-spa-on-dark'
                         }`}>
            <Icon name={isError ? 'error' : 'check_circle'} />
            <span className={isError ? 'text-red-300' : 'text-spa-on-dark'}>
                {msg.text}
            </span>
            <button onClick={() => setVisible(false)}
                    className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                <Icon name="close" />
            </button>
        </div>
    );
}
