/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.html", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        forest: "#2F4A3A",
        sage: "#A7B79A",
        stone: "#EDE9DF",
        charcoal: "#2B2B2B",
      },
      fontFamily: {
        sans: ["Satoshi", "Inter", "Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "8px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
