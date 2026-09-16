import js from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      'coverage/**',
      'playwright/.auth/**',
      'dist/**',
      '.agents/**',
      '.codex/**',
      '.playwright-mcp/**',
      '.vscode/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off'
    }
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'src/fixtures/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-raw-locators': 'warn',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-web-first-assertions': 'error'
    }
  },
  prettier
];
