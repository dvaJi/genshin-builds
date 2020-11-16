module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-1": "#333",
      },
      height: {
        "500px": "500px",
      },
      backgroundColor: {
        vulcan: {
          50: "#F4F4F4",
          100: "#E8E8E9",
          200: "#C6C6C8",
          300: "#A3A4A7",
          400: "#5F6065",
          500: "#1A1C23",
          600: "#171920",
          700: "#101115",
          800: "#1a1c23",
          900: "#121317",
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
