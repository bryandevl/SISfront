/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Incluye todos los archivos donde usas Tailwind
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",  // Cambia a tu color deseado
        'primary-foreground': "#ffffff",
        background: "#f8fafc", // Color de fondo deseado
      },
    },
  },
  plugins: [],
};