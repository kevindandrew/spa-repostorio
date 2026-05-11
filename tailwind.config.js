import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans:    ['Montserrat', ...defaultTheme.fontFamily.sans],
                serif:   ['EB Garamond', ...defaultTheme.fontFamily.serif],
                display: ['EB Garamond', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                gold: {
                    light:   '#ffdeaa',
                    soft:    '#f7bd48',
                    DEFAULT: '#e8c17f',
                    mid:     '#c9a465',
                    deep:    '#ba880f',
                    brown:   '#775922',
                    dark:    '#5d420b',
                    text:    '#271900',
                },
                spa: {
                    // Dark surfaces
                    bg:              '#0D0D0D',
                    surface:         '#131313',
                    'surface-low':   '#1c1b1b',
                    'surface-mid':   '#201f1f',
                    'surface-high':  '#2a2a2a',
                    'surface-top':   '#353534',
                    outline:         '#9a8f81',
                    'outline-dim':   '#4e4639',
                    'on-dark':       '#e5e2e1',
                    'on-dark-dim':   '#d1c5b5',
                    // Light surfaces
                    ivory:           '#FAF8F4',
                    cream:           '#FFF8F5',
                    white:           '#FFFFFF',
                    border:          '#EDE8DF',
                    'on-light':      '#1A1A1A',
                    'on-light-dim':  '#6B5E4E',
                },
            },
            boxShadow: {
                'gold-sm':  '0 0 10px rgba(232,193,127,0.15)',
                'gold-md':  '0 0 20px rgba(201,164,101,0.2)',
                'gold-lg':  '0 0 40px rgba(201,164,101,0.25)',
                'luxury':   '0 10px 40px rgba(0,0,0,0.6), 0 0 20px rgba(232,193,127,0.05)',
            },
        },
    },
    plugins: [forms],
};
