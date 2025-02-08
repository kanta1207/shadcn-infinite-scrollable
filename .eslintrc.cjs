module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['react-refresh', 'prettier', 'unused-imports', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    'unused-imports/no-unused-imports-ts': 'warn',
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000'], ['^'], ['^@?\\w'], ['^@(js|image)(/.*|$)'], ['^\\.']]
      }
    ],
    'simple-import-sort/exports': 'error'
  }
}
