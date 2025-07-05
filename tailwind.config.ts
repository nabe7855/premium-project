/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif JP', 'serif'],
        rounded: ['Noto Sans JP', 'sans-serif'],
        noto: ['Noto Sans JP', 'sans-serif'],
        mono: 'var(--font-mono)',
        dancing: ['Dancing Script', 'cursive'],
        sans: 'var(--font-sans)',
      },
      colors: {
        // Predefined colors
        strawberry: {
          50: '#fff0f5',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        cream: {
          50: '#fefdfb',
          100: '#fef9f3',
          200: '#fcf1e6',
          300: '#f8e4d0',
          400: '#f2d1a9',
          500: '#e9ba82',
          600: '#dfa05c',
          700: '#d4853e',
          800: '#c26d27',
          900: '#a85817',
        },
        // Additional colors (e.g., Tokyo, Osaka)
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        rose: {
          50: '#FFF8F8',
          100: '#FFE4E1',
          200: '#FFCCD5',
          300: '#FFB3BA',
          400: '#FF99A3',
          500: '#FF8A95',
        },
        tokyo: {
          50: '#fef7f7',
          100: '#fdeaea',
          200: '#fbd9db',
          300: '#f7b8bc',
          400: '#f18f96',
          500: '#e85d75',
          600: '#d63c5e',
          700: '#b22d4a',
          800: '#962843',
          900: '#81263f',
        },
        osaka: {
          50: '#fffbf0',
          100: '#fff4d9',
          200: '#ffe8b3',
          300: '#ffd882',
          400: '#ffc250',
          500: '#ffab2e',
          600: '#ff8f08',
          700: '#e6730a',
          800: '#bf5c0e',
          900: '#9c4b10',
        },
        nagoya: {
          50: '#faf7ff',
          100: '#f1ecff',
          200: '#e5ddff',
          300: '#d2c1ff',
          400: '#b897ff',
          500: '#9b69ff',
          600: '#8844ff',
          700: '#7932e8',
          800: '#6626c4',
          900: '#5522a3',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-tokyo': 'linear-gradient(135deg, #fdeaea 0%, #f7b8bc 50%, #e85d75 100%)',
        'gradient-osaka': 'linear-gradient(135deg, #fff4d9 0%, #ffe8b3 50%, #ffab2e 100%)',
        'gradient-nagoya': 'linear-gradient(135deg, #f1ecff 0%, #e5ddff 50%, #9b69ff 100%)',
        'polka-dot': 'radial-gradient(circle, #FFE4E1 2px, transparent 2px)',
        'hero-gradient': 'linear-gradient(135deg, #FFF8F8 0%, #FFE4E1 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.8s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        twinkle: 'twinkle 0.4s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 1s infinite',
        spinScale: 'spinScale 1.2s ease-out forwards',
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.07) rotate(-1deg)' },
          '50%': { transform: 'scale(1.05) rotate(1deg)' },
          '70%': { transform: 'scale(1.06) rotate(-0.5deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spinScale: {
          '0%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({
      addUtilities,
    }: {
      addUtilities: (
        utilities: Record<string, Record<string, string>>,
        variants?: string[],
      ) => void;
    }) {
      // Adding custom utility class for text-foreground
      addUtilities(
        {
          '.text-foreground': {
            color: 'hsl(var(--foreground))',
          },
        },
        ['responsive', 'hover'],
      );
    },
  ],
};
