/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./utils/**/*.{js,jsx,ts,tsx}", "./constants/**/*.{js,jsx,ts,tsx}", "app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Most Used in Chat App)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main blue (most used)
          600: '#2563eb',  // Dark blue (gradient end)
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Slate/Gray Colors (Most used for backgrounds and text)
        slate: {
          50: '#f8fafc',   // Lightest gray (bg-slate-50)
          100: '#f1f5f9',  // Very light gray
          200: '#e2e8f0',  // Light gray (border-slate-200)
          300: '#cbd5e1',  // Medium light gray
          400: '#94a3b8',  // Medium gray
          500: '#64748b',  // Medium dark gray
          600: '#475569',  // Dark gray (text-slate-600)
          700: '#334155',  // Darker gray
          800: '#1e293b',  // Very dark gray
          900: '#0f172a',  // Darkest gray
        },
        
        // Success/Green Colors
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main green (bg-green-500)
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // Destructive/Red Colors
        red: {
          50: '#fef2f2',
          100: '#fee2e2',  // bg-red-100
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',  // text-red-600
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Purple Colors (for groups)
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Main purple
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        
        // Pink Colors (for gradient combinations)
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',  // Used in purple-to-pink gradients
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [],
}

