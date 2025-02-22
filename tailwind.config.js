/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Modern sports-themed color palette
        primary: {
          DEFAULT: '#10B981', // Emerald-500
          hover: '#059669', // Emerald-600
        },
        secondary: {
          DEFAULT: '#6366F1', // Indigo-500
          hover: '#4F46E5', // Indigo-600
        },
        background: {
          dark: '#0F172A', // Slate-900
          card: '#1E293B', // Slate-800
          hover: '#334155', // Slate-700
        },
        border: {
          DEFAULT: '#334155', // Slate-700
          light: '#475569', // Slate-600
        }
      }
    },
  },
  plugins: [],
};