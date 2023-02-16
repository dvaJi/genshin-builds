module.exports = {
  organizeImportsSkipDestructiveCodeActions: true,
  plugins: [
    require("prettier-plugin-astro"),
    require("prettier-plugin-organize-imports"),
    require("prettier-plugin-tailwindcss"),
  ],
};
