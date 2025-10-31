import forms from '@tailwindcss/forms'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="heyho-dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Custom text color hierarchy
        text: {
          primary: '#3209BB',    // Main text
          secondary: '#939393',  // Secondary text
          tertiary: '#9F9F9F',   // Tertiary text
          quaternary: '#BAB8B8', // Subtle text
          light: '#F4F4F4',      // Very light text
          dark: '#444444',       // Dark gray for sidebar items
        },
        // Theme colors for utility classes
        primary: {
          DEFAULT: '#3209BB',
          focus: '#2807A3',
          content: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6366f1',
          focus: '#4f46e5',
          content: '#ffffff',
        },
        // Semantic state colors
        success: {
          DEFAULT: '#10b981',
          content: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          content: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444',
          content: '#ffffff',
        },
        info: {
          DEFAULT: '#3b82f6',
          content: '#ffffff',
        },
      },
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
          // Brand color - Deep blue/purple
          primary: '#3209BB',
          'primary-focus': '#2807A3',     // Darker for hover
          'primary-content': '#ffffff',    // White text on primary

          // Secondary - Using lighter purple for accents
          secondary: '#6366f1',
          'secondary-focus': '#4f46e5',
          'secondary-content': '#ffffff',

          // Accent - Keep green for success states
          accent: '#10b981',
          'accent-focus': '#059669',
          'accent-content': '#ffffff',

          // Neutral - Using gray scale
          neutral: '#939393',
          'neutral-focus': '#6b7280',
          'neutral-content': '#ffffff',

          // Base colors - Backgrounds and surfaces
          'base-100': '#F6F6F6',          // Main content background
          'base-200': '#F3F3F3',          // Sidebar background
          'base-300': '#E5E5E5',          // Borders and dividers
          'base-content': '#3209BB',      // Main text color (primary brand)

          // Semantic states
          info: '#3b82f6',
          'info-content': '#ffffff',

          success: '#10b981',
          'success-content': '#ffffff',

          warning: '#f59e0b',
          'warning-content': '#ffffff',

          error: '#ef4444',
          'error-content': '#ffffff',

          // Custom CSS variables for fine-tuning
          '--rounded-box': '0.75rem',     // Border radius for cards
          '--rounded-btn': '0.5rem',      // Border radius for buttons
          '--rounded-badge': '1rem',      // Border radius for badges
          '--animation-btn': '0.2s',      // Button animation duration
          '--animation-input': '0.2s',    // Input animation duration
          '--btn-focus-scale': '0.98',    // Button press scale
          '--border-btn': '1px',          // Button border width
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