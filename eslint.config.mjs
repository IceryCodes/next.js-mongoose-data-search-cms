import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const Filename = fileURLToPath(import.meta.url);
const Dirname = path.dirname(Filename);
const compat = new FlatCompat({
  baseDirectory: Dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/node_modules/', '**/build/', '**/dist/', '**/.eslintrc', '**/.eslintignore', '**/eslint.config.mjs'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
    "next",
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      import: _import,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json'],
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'unknown'],

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-native',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
            {
              pattern: '*.scss',
              group: 'index',

              patternOptions: {
                matchBase: true,
              },
            },
          ],

          pathGroupsExcludedImportTypes: ['react', 'express'],
          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/namespace': 'off',
      'object-curly-spacing': ['error', 'always'],
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/named': 'off',
      'import/no-duplicates': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/no-named-as-default': 'off',
      'no-else-return': 'off',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'no-continue': 'off',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 0,
        },
      ],

      'no-plusplus': 'off',

      'no-trailing-spaces': [
        'error',
        {
          skipBlankLines: false,
          ignoreComments: true,
        },
      ],

      'no-useless-return': 'warn',

      'no-underscore-dangle': [
        'error',
        {
          allow: ['_id'],
        },
      ],

      'no-unused-vars': 'off',

      'no-use-before-define': [
        'error',
        {
          variables: false,
          functions: false,
        },
      ],

      'object-shorthand': [
        'error',
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],
      quotes: 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          jsxSingleQuote: false,
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: 'always',
          trailingComma: 'es5',
          printWidth: 125,
          proseWrap: 'never',
          endOfLine: 'auto',
        },
      ],
      semi: ['error', 'always'],
      '@next/next/no-duplicate-head': 'off',
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'react/destructuring-assignment': 'off',

      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unused-prop-types': 'off',
      'react/no-unused-state': 'warn',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/react-in-jsx-scope': 'off',
    },
  },
];
