/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                obsidian: '#020617',
                electricCyan: '#22D3EE',
                deepSapphire: '#1E3A8A',
                slate: {
                    850: '#152035',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Geist Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'decode': 'decode 0.5s ease-out forwards',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1E3A8A1A 1px, transparent 1px), linear-gradient(to bottom, #1E3A8A1A 1px, transparent 1px)",
            }
        },
    },
    plugins: [],
}
