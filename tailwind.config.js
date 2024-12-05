/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'dot-pulse': {
          '0%': { boxShadow: '9999px 0 0 -5px' },
          '30%': { boxShadow: '9999px 0 0 2px' },
          '60%, 100%': { boxShadow: '9999px 0 0 -5px' },
        },
        'dot-pulse-before': {
          '0%': { boxShadow: '9984px 0 0 -5px' },
          '30%': { boxShadow: '9984px 0 0 2px' },
          '60%, 100%': { boxShadow: '9984px 0 0 -5px' },
        },
        'dot-pulse-after': {
          '0%': { boxShadow: '10014px 0 0 -5px' },
          '30%': { boxShadow: '10014px 0 0 2px' },
          '60%, 100%': { boxShadow: '10014px 0 0 -5px' },
        },
      },
      animation: {
        'dot-pulse': 'dot-pulse 1.5s infinite linear 0.25s',
        'dot-pulse-before': 'dot-pulse-before 1.5s infinite linear',
        'dot-pulse-after': 'dot-pulse-after 1.5s infinite linear 0.5s',
      },
      backgroundImage: {
        'primary-gradient': '-webkit-gradient(linear,right top,left top,from(rgba(20, 110, 180,.08)),to(rgba(20, 110, 180,0)))',
      },
      screens: {
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
        '2xl': '1400px',
        // => @media (min-width: 992px) { ... }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    container: {
      padding: {
        DEFAULT: '1rem',
      },
      screens: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
        '2xl': '1320px',
      },
    },
  },
  plugins: [],
};
