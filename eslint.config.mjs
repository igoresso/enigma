import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['src/**/*.js'],
    ignores: ['**/*.config.js', '!**/eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 2015,
      sourceType: 'module',
    },

    rules: {
      'prettier/prettier': 'error',
      'func-names': 'off',
      'eol-last': ['error', 'always'],

      'max-len': [
        'warn',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreComments: false,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
    },
  },
];
