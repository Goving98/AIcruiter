/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            primary: {
                900: '#0F172A', // Dark blue base
                800: '#1E293B',
                700: '#334155',
              },
              accent: {
                500: '#FF6B6B', // Coral red
                600: '#E73C3C',
              },
              secondary: {
                400: '#38BDF8', // Sky blue
                500: '#0EA5E9',
            }
        },
      },
    },
    plugins: [],
  }

 
