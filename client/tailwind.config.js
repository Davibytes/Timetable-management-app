/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        dark: {
          canvas: '#0a0a0a',
          surface: '#1a1a1a',
          elevated: '#222222',
          border: {
            subtle: '#2a2a2a',
            prominent: '#3a3a3a',
          }
        },
        // Light Mode Colors
        light: {
          canvas: '#faf9f5',
          surface: '#ffffff',
          elevated: '#e8ebe6',
          border: {
            subtle: '#e8ebe6',
            prominent: '#d0d3ce',
          }
        },
        // Accent Colors (Dark)
        indigo: {
          DEFAULT: '#6731b7',
          velvet: '#523e93',
          light: '#9975cd',
        },
        // Accent Colors (Light)
        sage: {
          DEFAULT: '#5a7a5f',
          dark: '#4a6a50',
        },
        slate: '#7591a3',
        // Text Colors (Dark)
        'text-dark': {
          primary: '#ffffff',
          secondary: '#c3c3c3',
          muted: '#808080',
        },
        // Text Colors (Light)
        'text-light': {
          primary: '#1f2d1f',
          secondary: '#4a5a4f',
          muted: '#8a9a8f',
        },
        // Semantic Colors (Dark)
        'semantic-dark': {
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          info: '#2196f3',
        },
        // Semantic Colors (Light)
        'semantic-light': {
          success: '#2d7a3e',
          warning: '#b8860b',
          error: '#b44336',
          info: '#2563a8',
        },
      },
      fontFamily: {
        dongle: ['Dongle', 'sans-serif'],
        comfortaa: ['Comfortaa', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'hero': '56px',
        'h1': '40px',
        'h2': '32px',
        'h3': '24px',
        'h4': '20px',
        'body-lg': '18px',
        'body': '16px',
        'small': '14px',
        'caption': '12px',
      },
      lineHeight: {
        'hero': '1.1',
        'h1': '1.2',
        'h2': '1.3',
        'h3': '1.4',
        'h4': '1.5',
        'body': '1.6',
        'small': '1.5',
        'caption': '1.4',
      },
      borderRadius: {
        'tag': '4px',
        'button': '8px',
        'input': '8px',
        'card': '16px',
        'elevated': '20px',
      },
      boxShadow: {
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'dropdown-dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'modal-dark': '0 20px 60px rgba(0, 0, 0, 0.6)',
        'primary-dark': '0 2px 8px rgba(103, 49, 183, 0.3)',
        'card-light': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover-light': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown-light': '0 8px 32px rgba(0, 0, 0, 0.15)',
        'modal-light': '0 20px 60px rgba(0, 0, 0, 0.2)',
        'primary-light': '0 2px 8px rgba(90, 122, 95, 0.25)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}