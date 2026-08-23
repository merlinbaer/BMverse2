const expoConfig = require('eslint-config-expo/flat')
const reactNative = require('eslint-plugin-react-native')
const prettier = require('eslint-plugin-prettier')

// Find the instances already used by expo-config to avoid "Cannot redefine" errors
const tsPlugin = expoConfig.find(c => c.plugins && c.plugins['@typescript-eslint'])?.plugins['@typescript-eslint']
const importPlugin = expoConfig.find(c => c.plugins && c.plugins['import'])?.plugins['import']

module.exports = [
  ...expoConfig,
  {
    plugins: {
      'react-native': reactNative,
      prettier: prettier,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': [
        'error',
        {
          skip: ['AppText'],
        },
      ],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
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
      'react-hooks/immutability': 'off',
    },
    settings: {
      react: {
        version: '19.2.3',
      },
    },
  },
  {
    files: ['src/app/**/*.tsx', 'src/app/**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'eslint.config.js',
      '.expo/',
      'android/',
      'ios/',
      'web-build/',
      '*.config.js',
      'supabase/',
    ],
  },
]
