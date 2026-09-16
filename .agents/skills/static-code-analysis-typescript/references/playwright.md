# Playwright linting

Load for Playwright tooling. Scope framework rules to actual tests.
Install a compatible plugin only when needed within the requested scope.
Add this object to defineConfig before formatting-conflict overrides:

```js
import playwright from 'eslint-plugin-playwright';

const playwrightConfig = {
  files: ['tests/**/*.{ts,tsx,mts,cts}', 'e2e/**/*.{ts,tsx,mts,cts}'],
  extends: [playwright.configs['flat/recommended']],
};
```

Actually include playwrightConfig in the export. Replace directories/globs with runner
patterns and extensions, including JS where used. General TS configuration must also
cover tests. Inspect effective configuration for a test and a non-test file.

Preserve recommended rules unless demonstrated needs justify overrides.
Configure settings.playwright.globalAliases only for real aliases; do not copy arbitrary
setup/health names or universally disable no-nested-step.
Ignore actual generated reports/artifacts in lint/format configs.
Type-check relevant tests/configs with suitable types and inclusion.

Choose modules for the actual runner/runtime. Do not assume an internal bundler or
mandatory bundler resolution. For Cypress/other runners, preserve their own plugins
and globals and consult their documentation.
Recommend Playwright editor extensions only when editor work is in scope.

Sources: [ESLint plugin](https://github.com/playwright-community/eslint-plugin-playwright),
[Playwright TypeScript](https://playwright.dev/docs/test-typescript).
