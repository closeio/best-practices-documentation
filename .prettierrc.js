module.exports = {
  arrowParens: 'always',
  importOrder: ['^@@/', '^@/', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  proseWrap: 'always',
  singleQuote: true,
  trailingComma: 'all',
};
