import forms from '@tailwindcss/forms'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="heyho-dark"]'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [forms, daisyui],
  daisyui: {
    themes: [
      {
        heyho: {
          primary: '#3b82f6', // Blue 500
          'primary-focus': '#2563eb', // Blue 600
          'primary-content': '#ffffff',

          secondary: '#8b5cf6', // Purple 500
          'secondary-focus': '#7c3aed', // Purple 600
          'secondary-content': '#ffffff',

          accent: '#10b981', // Green 500
          'accent-focus': '#059669', // Green 600
          'accent-content': '#ffffff',

          neutral: '#1f2937', // Gray 800
          'neutral-focus': '#111827', // Gray 900
          'neutral-content': '#ffffff',

          'base-100': '#ffffff',
          'base-200': '#f9fafb', // Gray 50
          'base-300': '#f3f4f6', // Gray 100
          'base-content': '#1f2937',

          info: '#3b82f6',
          'info-content': '#ffffff',

          success: '#10b981',
          'success-content': '#ffffff',

          warning: '#f59e0b',
          'warning-content': '#ffffff',

          error: '#ef4444',
          'error-content': '#ffffff',
        },
        'heyho-dark': {
          primary: '#60a5fa', // Blue 400 (lighter for dark mode)
          'primary-focus': '#3b82f6',
          'primary-content': '#ffffff',

          secondary: '#a78bfa', // Purple 400
          'secondary-focus': '#8b5cf6',
          'secondary-content': '#ffffff',

          accent: '#34d399', // Green 400
          'accent-focus': '#10b981',
          'accent-content': '#000000',

          neutral: '#374151', // Gray 700
          'neutral-focus': '#1f2937', // Gray 800
          'neutral-content': '#f9fafb',

          'base-100': '#1a1d20', // Custom dark
          'base-200': '#212529', // Dark 800
          'base-300': '#343a40', // Dark 700
          'base-content': '#f9fafb',

          info: '#60a5fa',
          'info-content': '#000000',

          success: '#34d399',
          'success-content': '#000000',

          warning: '#fbbf24',
          'warning-content': '#000000',

          error: '#f87171',
          'error-content': '#000000',
        },
      },
    ],
    darkTheme: 'heyho-dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root',
  },
} 