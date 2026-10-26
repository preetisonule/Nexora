/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Master Design System Palette
        brand: {
          subtle: '#F3EEFF',
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          50: '#F3EEFF',
          100: '#EDE4FF',
          200: '#DDD0FF',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#3B1A75',
          950: '#251049',
        },
        ink: {
          primary: '#1E1B2E',
          secondary: '#6B6880',
          tertiary: '#9E9AB3',
          border: '#ECE8F5',
          darkText: '#F4F1FB',
          darkMuted: '#A9A4BC',
          darkBorder: '#2C2540',
        },
        canvas: {
          main: '#FFFFFF',
          subtle: '#F8F6FD',
          elevated: '#FFFFFF',
          border: '#ECE8F5',
          darkMain: '#100C1C',
          darkSubtle: '#15111F',
          darkElevated: '#1A1529',
          darkBorder: '#2C2540',
        },
        state: {
          success: '#238653',
          warning: '#B7791F',
          error: '#C53D43',
          info: '#2563A6',
        },
        go: {
          blue: '#00ADD8',
          deep: '#007D9C',
          dark: '#002C3D',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'page-title': ['30px', { lineHeight: '36px', fontWeight: '700' }],
        'section-heading': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'card-title': ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'body': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'supporting': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'code': ['13px', { lineHeight: '20px', fontWeight: '400' }],
      },
      spacing: {
        'card-p': '18px',
        'section-gap': '28px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(76, 29, 149, 0.05)',
        'card': '0 1px 3px 0 rgba(76, 29, 149, 0.06), 0 1px 2px -1px rgba(76, 29, 149, 0.06)',
        'elevated': '0 4px 6px -1px rgba(76, 29, 149, 0.08), 0 2px 4px -2px rgba(76, 29, 149, 0.06)',
        'modal': '0 20px 25px -5px rgba(76, 29, 149, 0.1), 0 8px 10px -6px rgba(76, 29, 149, 0.1)',
      },
      borderRadius: {
        'subtle': '6px',
        'card': '16px',
        'panel': '20px',
        'modal': '16px',
      }
    },
  },
  plugins: [],
};
