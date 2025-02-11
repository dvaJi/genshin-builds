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
  // importOrderSeparation: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
};
