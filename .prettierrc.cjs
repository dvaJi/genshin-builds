/** @type {import("prettier").Config} */
module.exports = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  pluginSearchDirs: false,
  importOrder: [
    "server-only",
    "^@([^/]+)(.*)/?(.*)$",
    "^@/(.*)/?(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  trailingComma: "es5",
};
