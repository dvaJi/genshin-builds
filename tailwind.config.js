const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-1": "#333",
        "hsr-accent": "#439eac",
        "hsr-bg": "#15141a",
        "hsr-surface1": "#191820e6",
        "hsr-surface2": "#22212ce6",
        "hsr-surface3": "#292e38e6",
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
      fontSize: {
        xxs: ".625rem",
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
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
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
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
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
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".card": {
          position: "relative",
          backgroundColor: "rgba(35,39,52,var(--tw-bg-opacity))",
          marginTop: theme("spacing.4"),
          minWidth: "0",
          borderRadius: theme("borderRadius.lg"),
          boxShadow: "0 0 0 1px rgba(55, 65, 81, 0.6)",
          padding: theme("spacing.4"),
        },
        ".badge": {
          backgroundColor: theme("backgroundColor.gray.600"),
          backgroundOpacity: theme("backgroundOpacity.70"),
          marginRight: theme("spacing.1"),
          borderRadius: theme("borderRadius.DEFAULT"),
          border: theme("border.gray.500"),
          borderOpacity: theme("borderOpacity.40"),
          padding: theme("spacing.1"),
          fontSize: theme("fontSize.xs"),
          fontWeight: theme("fontWeight.bold"),
        },
      });
    }),
  ],
};
