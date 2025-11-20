/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        frog: {
          green: '#90EE90',
          lime: '#32CD32',
          dark: '#2F4F2F',
        },
        mood: {
          stoned: '#90EE90',
          excited: '#FFD700',
          sleepy: '#4682B4',
          hungry: '#FF6347',
          philosophical: '#9370DB',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'croak': 'croak 0.5s ease-in-out',
        'catch': 'catch 0.8s ease-out',
        'summon': 'summon 2s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        croak: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.2) rotate(-5deg)' },
          '75%': { transform: 'scale(1.2) rotate(5deg)' },
        },
        catch: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-30px) scale(1.3)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        summon: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          '50%': { transform: 'scale(1.5) rotate(180deg)', opacity: 0.5 },
          '100%': { transform: 'scale(2) rotate(360deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
