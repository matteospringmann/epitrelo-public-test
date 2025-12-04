// web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class', // Active le mode sombre avec la classe 'dark'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#6d28d9", // Violet
                    light: "#8b5cf6",
                    dark: "#5b21b6",
                },
                secondary: "#db2777", // Rose
                background: "#f8fafc", // Arrière-plan (slate-50)
                surface: "#f1f5f9", // Surface des cartes/listes (slate-100)
                text: {
                    DEFAULT: "#1e293b", // Texte principal (slate-800)
                    muted: "#64748b", // Texte secondaire (slate-500)
                },
            },
            backgroundImage: {
                "grid-pattern":
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e2e8f0'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
            },
        },
    },
    plugins: [],
};
