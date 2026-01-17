module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint-config-expo',
  ],
  plugins: [
    'react',
    'react-hooks',
    'react-native',
    '@typescript-eslint',
    'import',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {}, // so that @/ alias is resolved
      'babel-module': {}, // optional if Babel resolver is used
    },
  },
  env: {
    browser: true,
    node: true,
    'react-native/react-native': true,
  },
  rules: {
    // React / TS specific
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // Code Style / Prettier
    'prettier/prettier': 'error',
    'import/no-unresolved': 'error',
    'react-native/no-inline-styles': 'warn',
    // Unused vars / imports
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    // Optional:
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ['src/app/**/*.tsx', 'src/app/**/*.ts'],
      rules: {
        'import/no-unused-modules': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
}
