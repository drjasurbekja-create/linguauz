// Tailwind sozlamalari (avval HTML içida `tailwind.config = {...}` bölib, CDN orqali işlardi).
// CSS'ni qayta yiğiş: npm run build:css  — natija HTML içidagi TAILWIND-BUILD blokiga yoziladi.
const BUILD_BLOCK = /<!-- TAILWIND-BUILD-START -->[\s\S]*?<!-- TAILWIND-BUILD-END -->/;

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: {
        files: ['./ingliz_tili_4_ko_nikma_akademiyasi.html'],
        // Oldingi yiğilgan CSS'ni qayta skanerlamaymiz — faqat haqiqiy belgilaş va JS kodi
        transform: { html: (code) => code.replace(BUILD_BLOCK, '') }
    },
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                }
            },
            animation: {
                'pulse-ring': 'pulseRing 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite',
                'wave': 'soundWave 1.2s ease-in-out infinite',
                'bounce-short': 'bounceShort 0.5s ease-in-out 1',
            },
            keyframes: {
                pulseRing: {
                    '0%': { transform: 'scale(0.95)', opacity: '0.7' },
                    '50%': { transform: 'scale(1.35)', opacity: '0' },
                    '100%': { transform: 'scale(0.95)', opacity: '0' },
                },
                soundWave: {
                    '0%, 100%': { height: '8px' },
                    '50%': { height: '28px' },
                },
                bounceShort: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                }
            }
        }
    }
};
