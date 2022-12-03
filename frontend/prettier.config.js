module.exports = {
  importOrder: [
    "^react",
    "^next/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@mui/(.*)$",
    "^@/(.*)/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
