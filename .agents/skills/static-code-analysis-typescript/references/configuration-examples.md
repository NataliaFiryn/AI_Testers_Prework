# Configuration examples

Adapt to installed versions, runtime, file types, and workspaces. Verify peer dependencies
and Node requirements before installation; do not copy a stale version snapshot.

## ESLint and standalone Prettier

Dev packages: eslint, @eslint/js, typescript-eslint, typescript, globals, prettier,
eslint-config-prettier. Use an ESLint version supporting defineConfig/extends.

```js
// eslint.config.mjs
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/**', 'coverage/**'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  prettier,
);
```

Selectors scope extends in the same object. Adapt browser globals, JavaScript source
types, JSX handling, and actual generated ignores.
For typed linting, evaluate recommendedTypeChecked and parserOptions.projectService: true
in the TS object. Verify TSConfig inclusion and config-root handling; avoid typed rules
on JavaScript or out-of-project files.

## Scripts and formatter

Merge this fragment; adapt aggregates to the package manager and existing names.

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit",
    "check": "npm run format:check && npm run lint && npm run typecheck"
  }
}
```

Zero warnings is a policy choice. Preserve suitable project-reference/build checks
for composite projects. check:ci can be an alias when useful.
Formatter options are preferences; an optional baseline is:

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

Inspect Prettier/ESLint ignores separately. Ignore actual generated output and follow
lockfile formatting policy. Sorting is not required for ordinary formatting setup.

## Intentional integrated formatting

When retaining eslint-plugin-prettier, place its recommended config after conflicting
rules. For a TS-only split, scope it through a TS files/extends object.
Ensure separate Prettier checks cover remaining types using explicit globs or a dedicated
ignore file. Verify representative files rather than assuming a negative glob excludes TS.
Avoid duplicate staged formatting checks.

## TypeScript choices

| Environment | Starting point to evaluate |
| --- | --- |
| Node runtime | Suitable Node module mode, often NodeNext, with matching resolution; inspect package type/extensions |
| Bundler processes source | preserve or ESNext modules with bundler resolution according to tool/TS support |
| Existing CommonJS toolchain | Preserve compatible settings unless module migration is requested |
| Published library | Match emitted output and consumers; a no-emit application template is insufficient |

Illustrative bundler-managed type-check-only configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

Choose target, includes, JSX, libs, and environment types for the actual project.
Modern source syntax does not require ESM output. noEmit does not select resolution.
Avoid unnecessary source maps without emit or baseUrl without need.
Module migrations may affect exports, extensions, interop, and runtime behavior; verify.

## Editor integration

Recommend ESLint/Prettier extensions only when relevant. For autofix on save, configure
source.fixAll.eslint using supported editor syntax; extension installation alone does
not guarantee autofix. Preserve unrelated preferences.
See [Import sorting](import-sorting.md) for competing actions.

Sources:
[typescript-eslint](https://typescript-eslint.io/getting-started/),
[typed linting](https://typescript-eslint.io/getting-started/typed-linting/),
[ESLint](https://eslint.org/docs/latest/use/configure/configuration-files),
[Prettier](https://prettier.io/docs/integrating-with-linters),
[TypeScript](https://www.typescriptlang.org/docs/handbook/modules/reference.html).
