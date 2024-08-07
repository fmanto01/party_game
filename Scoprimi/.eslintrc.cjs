module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@stylistic', '@typescript-eslint'],
  rules: {
    '@stylistic/indent': ['error', 2],
    '@stylistic/arrow-spacing': 'warn',
    '@stylistic/block-spacing': 'error',
    '@stylistic/space-infix-ops': 'warn',
    '@stylistic/no-multiple-empty-lines': 'warn',

    'no-const-assign': 'error',
    'no-duplicate-imports': 'warn',
    'camelcase': 'warn',
    'eqeqeq': 'warn', // Consiglia di usare === e !==
    'curly': 'warn', // Richiede l'uso delle graffe per tutti i blocchi
    'no-eval': 'error', // Disabilita l'uso di eval()
    'no-implied-eval': 'error', // Disabilita l'uso implicito di eval()
    'no-with': 'error', // Disabilita l'uso di with
    'no-unused-vars': ['warn', { 'args': 'none' }], // Segnala le variabili non utilizzate, ma ignora gli argomenti delle funzioni
    'no-multi-spaces': 'warn', // Disabilita l'uso di spazi multipli
    'comma-dangle': ['warn', 'always-multiline'], // Richiede una virgola finale negli oggetti e array multilinea
    'semi': ['error', 'always'], // Richiede l'uso del punto e virgola
    'quotes': ['warn', 'single', { 'avoidEscape': true }], // Preferisce l'uso di virgolette singole
    'eol-last': ['warn', 'always'], // Richiede una linea vuota alla fine dei file
    'arrow-body-style': 'warn', // Require braces around arrow function bodies
    'block-scoped-var': 'warn', // Enforce the use of variables within the scope they are defined
    'no-else-return': 'error',
    'no-param-reassign': 'error',
    'no-var': 'error', // Require let or const instead of var
    'vars-on-top': 'warn',
    'sort-vars': 'warn',
  },
};
