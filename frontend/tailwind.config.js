/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090e',
          800: '#0d111a',
          700: '#151b28',
          600: '#1f293d',
          500: '#2d3b54'
        },
        brand: {
          cyan: '#00f2fe',
          purple: '#7928ca',
          orange: '#ff4e00',
          emerald: '#10b981'
        }
      }
    },
  },
  plugins: [],
}
