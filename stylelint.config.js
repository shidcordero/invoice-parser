module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
    'selector-pseudo-element-no-unknown': null,
    'no-invalid-position-at-import-rule': null
  },
  ignoreFiles: ['node_modules/*.s+(a|c)ss']
}
