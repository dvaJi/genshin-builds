const plugin = require('tailwindcss/plugin');
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "accent-1": "#333",
        tof: {
          50: "#f3f5f8",
          100: "#e1e8ec",
          200: "#c7d2da",
          300: "#9fb2c1",
          400: "#859bad",
          500: "#556f85",
          600: "#4a5d70",
          700: "#404d5e",
          800: "#3a4450",
          900: "#343c45",
        },
      },
      height: {
        "500px": "500px",
      },
      width: {
        "800px": "800px",
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
          900: "#1a1d27",
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
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      zIndex: {
        1000: "1000",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  variants: {
    variants: {
      extend: {
        backgroundColor: ["odd"],
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
