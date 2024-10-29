const { SkeletonBodyText } = require("@shopify/polaris");

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
        secondaryGreen: "#3A643BB2",
        skeletonCream: "#fff6e3",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        xsm: "370px",
        ssm: "400px",
        ssmd: "450px",
        lMd: "900px",
        "2xld": "2000px",
      },
    },
  },
  plugins: [],
};
