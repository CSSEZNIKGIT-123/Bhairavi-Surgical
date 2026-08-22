/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cedccd",
          300: "#a6c2a4",
          400: "#79a377",
          500: "#558653",
          600: "#416c40",
          700: "#345634",
          800: "#2a452a",
          900: "#233924",
          950: "#131f14",
        },
        forest: {
          DEFAULT: "#243928",
          dark: "#1A2B1E",
          deep: "#132016",
          light: "#37553D",
        },
        cream: {
          50: "#FCFAF6",
          100: "#F7F3EB",
          200: "#EFE8DC",
          300: "#E4D8C4",
          DEFAULT: "#FAF8F5",
          card: "#F4EFE6",
        },
        terracotta: {
          DEFAULT: "#BA4E2A",
          dark: "#A13E1D",
          light: "#D8633D",
        },
        gold: {
          DEFAULT: "#C5A880",
          light: "#E5D4BE",
          dark: "#A3865D",
        },
        charcoal: {
          DEFAULT: "#1F2620",
          muted: "#5B665E",
          light: "#8F9C92",
        },
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(36, 57, 40, 0.06), 0 2px 6px -1px rgba(36, 57, 40, 0.04)',
        'card': '0 10px 30px -5px rgba(36, 57, 40, 0.08), 0 4px 10px -2px rgba(36, 57, 40, 0.04)',
        'elevated': '0 20px 40px -10px rgba(36, 57, 40, 0.12), 0 8px 16px -4px rgba(36, 57, 40, 0.06)',
        'glow': '0 0 25px rgba(186, 78, 42, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
