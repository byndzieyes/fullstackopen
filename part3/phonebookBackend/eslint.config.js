import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/']),

  {
    files: ['**/*.js'],

    extends: [js.configs.recommended],

    languageOptions: {
      globals: globals.node,
    },

    plugins: {
      '@stylistic': stylistic,
    },

    rules: {
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],
      '@stylistic/no-trailing-spaces': 'error',
    },
  },
]);
