module.exports = {
  darkMode: "class",
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
          50: "#868fac",
          100: "#848ca9",
          200: "#7a829f",
          300: "#6a7390",
          400: "#5d6479",
          500: "#4a4f5e",
          600: "#3b3f4f",
          700: "#2c313f",
          800: "#232734",
          900: "#202432",
        },
      },
      borderColor: {
        vulcan: {
          50: "#bbc3dd",
          100: "#b6bed8",
          200: "#a8b0cd",
          300: "#8f9abc",
          400: "#707ca4",
          500: "#57607f",
          600: "#3d445c",
          700: "#282d3e",
          800: "#1c202c",
          900: "#161923",
        },
      },
      boxShadow: {
        innerCard: "rgba(204, 173, 112, 0.1) 0px 0px 100px 1px inset",
      },
      zIndex: {
        1000: "1000",
      },
    },
  },
  variants: {},
  plugins: [],
};
