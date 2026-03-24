import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A34',
          light: '#2D5248',
          dark: '#122420',
        },
        gold: {
          DEFAULT: '#C8A96A',
          light: '#D9BC8A',
          dark: '#A8894A',
        },
        paper: {
          DEFAULT: '#F5F3EF',
          dark: '#EAE7DF',
        },
        card: {
          DEFAULT: '#FAFAFA',
          dark: '#1A2826',
        },
        islamicGreen: '#1E3A34',
        muted: '#6B7280',
      },
      fontFamily: {
        arabic: ['"Scheherazade New"', '"Amiri"', 'serif'],
        amiri: ['"Amiri"', 'serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
      },
      fontSize: {
        'qawl': ['1.35rem', { lineHeight: '2.2', letterSpacing: '0.01em' }],
        'kitab': ['1.5rem', { lineHeight: '2.4', letterSpacing: '0.02em' }],
        'kitab-lg': ['1.75rem', { lineHeight: '2.5', letterSpacing: '0.02em' }],
        'kitab-xl': ['2rem', { lineHeight: '2.6', letterSpacing: '0.02em' }],
      },
      boxShadow: {
        'neu': '8px 8px 16px #cfcfcf, -8px -8px 16px #ffffff',
        'neu-sm': '4px 4px 8px #cfcfcf, -4px -4px 8px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #cfcfcf, inset -4px -4px 8px #ffffff',
        'neu-dark': '8px 8px 16px #0d1a18, -8px -8px 16px #1e3830',
        'neu-dark-sm': '4px 4px 8px #0d1a18, -4px -4px 8px #1e3830',
        'gold-glow': '0 0 20px rgba(200, 169, 106, 0.3)',
        'green-glow': '0 0 20px rgba(30, 58, 52, 0.2)',
      },
      borderRadius: {
        'islamic': '0.75rem',
        'islamic-lg': '1.25rem',
      },
      backgroundImage: {
        'gradient-islamic': 'linear-gradient(135deg, #1E3A34 0%, #2D5248 50%, #1E3A34 100%)',
        'gradient-gold': 'linear-gradient(135deg, #C8A96A 0%, #D9BC8A 50%, #A8894A 100%)',
        'gradient-paper': 'linear-gradient(135deg, #F5F3EF 0%, #EAE7DF 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
