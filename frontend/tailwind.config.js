/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: {
          500: '#8b5cf6',
          600: '#7c3aed',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-button': 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-upload': 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        'gradient-solve': 'linear-gradient(45deg, #4ecdc4 0%, #44a08d 100%)',
        'gradient-video': 'linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)',
      },
      backdropBlur: {
        'glass': '10px',
      }
    },
  },
  plugins: [],
}
