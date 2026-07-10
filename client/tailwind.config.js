export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF6EC',
          100: '#F5EFE1',
          200: '#EDE3CE',
          300: '#DDCFB0',
          400: '#C2AE87',
          500: '#9C8763',
          600: '#6B6355',
          700: '#4A4438',
          800: '#2E2A22',
          900: '#201C16',
          950: '#17140F',
        },
        paper: { DEFAULT: '#FFFCF5', dark: '#241F16' },
        accent: { DEFAULT: '#FF5A3C', dark: '#FF6B4A' },
        danger: { DEFAULT: '#C23B22', dark: '#E4665A' },

        dusk: '#2B1B4E',
        magenta: '#C6247B',
        sunset: '#FF7A3D',
        sun: '#FFD23F',
        island: '#FFFDF7',
        silver: '#E3E6EA',
        bronze: '#E0954A',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['Karla', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        carnival: ['"Titan One"', 'sans-serif'],
        festive: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        stamp: '3px 3px 0 0 #201C16',
        'stamp-dark': '3px 3px 0 0 #F5EFE1',
        'stamp-sm': '2px 2px 0 0 #201C16',
        'stamp-sm-dark': '2px 2px 0 0 #F5EFE1',
      },
      borderRadius: {
        card: '1.25rem',
      },
    },
  },
  plugins: [],
}
