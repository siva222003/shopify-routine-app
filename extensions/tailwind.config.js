/** @type {import('tailwindcss').Config} */
module.exports = {
  // important: true,
  content: ["./test-app-theme-app/**/*.{liquid,js}"],
  theme: {
    extend: {
      colors: {
        primaryGreen: "#3A643B",
        primaryGrey: "#A0A0A0",
        primaryCream: "#FFF7E2",
        primaryBlack: "#2E2F2E",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
