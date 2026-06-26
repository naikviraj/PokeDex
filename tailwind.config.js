/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#050508',
          secondary: '#0d0d14',
          card: 'rgba(255,255,255,0.04)',
        },
        accent: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#5B21B6',
        },
        pokered: '#FF3B3B',
      },
      borderRadius: {
        card: '24px',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'floatSilhouette 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
