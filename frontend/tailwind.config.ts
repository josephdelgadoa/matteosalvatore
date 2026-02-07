import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },
    extend: {
      colors: {
        ms: {
          black: '#0A0A0A',
          charcoal: '#1A1A1A',
          graphite: '#2D2D2D',
          stone: '#4A4A4A',
          slate: '#737373',
          silver: '#A8A8A8',
          fog: '#D4D4D4',
          pearl: '#EDEDED',
          ivory: '#F7F7F7',
          white: '#FFFFFF',
          brand: {
            primary: '#1A1A1A',
            accent: '#8B7355',
          },
          product: {
            blanco: '#FAFAFA',
            negro: '#0F0F0F',
            azul: '#2C3E50',
            beige: '#D4C4B0',
            rojo: '#A63446',
          },
          success: '#2D5F2E',
          error: '#C1292E',
          warning: '#D97706',
          info: '#0369A1',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.75' }],
        xl: ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
      },
      'fade-in': {
        'from': { opacity: '0', transform: 'translateY(20px)' },
        'to': { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-up': {
        'from': { opacity: '0', transform: 'translateY(40px)' },
        'to': { opacity: '1', transform: 'translateY(0)' },
      },
      'scale-in': {
        'from': { opacity: '0', transform: 'scale(0.95)' },
        'to': { opacity: '1', transform: 'scale(1)' },
      },
      'slide-in-left': {
        'from': { opacity: '0', transform: 'translateX(-30px)' },
        'to': { opacity: '1', transform: 'translateX(0)' },
      },
      'reveal': {
        'from': { left: '0%' },
        'to': { left: '100%' },
      }
    },
    animation: {
      'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'slide-in-left': 'slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      'reveal': 'reveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards',
    }
  },
  plugins: [],
};
export default config;
