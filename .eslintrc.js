// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-dupe-keys': 'error',
    'no-extra-semi': 'error',
    'no-empty': 'error',
    'no-useless-escape': 'error',
    'no-empty-pattern': 'error',
    'no-constant-condition': 'error',
    'no-mixed-spaces-and-tabs': 'error',
    'react/react-in-jsx-scope': 'off',
    "react/prop-types": "off"
  },
};
