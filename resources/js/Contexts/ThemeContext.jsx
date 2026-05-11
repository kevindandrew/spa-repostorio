import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem('spa-theme');
        return saved ? saved === 'dark' : true; // dark por defecto
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('spa-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('spa-theme', 'light');
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
