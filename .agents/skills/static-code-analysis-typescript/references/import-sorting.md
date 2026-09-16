# Import sorting

Load for sorting reviews, conflicts, setups, or migrations. Sorting is optional.
Preserve working strategies unless replacement is in scope.

Simple-import-sort is a reasonable ESLint option. Existing IanVS, Trivago, perfectionist,
or import/order setups may meet requirements. Compare grouping, side-effect behavior,
compatibility, and preferences rather than declaring a universal winner.

Install a compatible eslint-plugin-simple-import-sort when selected.
Add this object to defineConfig before formatting-conflict overrides:

```js
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const sortingConfig = {
  files: ['**/*.{js,mjs,cjs,ts,tsx,mts,cts}'],
  plugins: { 'simple-import-sort': simpleImportSort },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
```

Actually include sortingConfig in the export; adapt extensions.
Default groups: side effects, node: builtins, packages, absolute/other imports, relative
imports. Scoped packages are not a distinct default group. Aliases may need regex groups.

## Editor conflicts

source.organizeImports can disagree with ESLint or Prettier sorting. If competing orders
are observed, choose one authority and disable the competing action for affected files.
Do not remove unrelated settings or claim ESLint avoids every such conflict.

## Migration

1. Inspect old options, editor actions, grouping, and sensitive initialization.
2. Verify replacement versions' peer dependencies and current maintainer documentation.
   A plugin major version does not prove support for the same Prettier major.
3. Remove only the replaced dependency, plugin entry, and its options. Preserve other
   plugins entries and unrelated formatter/editor settings. Update the lockfile.
4. Add agreed replacement/grouping; disable overlapping rules/actions if needed.
5. Autofix agreed files, inspect the diff, run non-mutating lint/format checks, and
   exercise tests or initialization affected by reordering.

Simple-import-sort preserves bare side effects' relative order but groups them ahead of
other imports. IanVS treats them as barriers other imports cannot cross. Migration can
affect execution even when relative bare-import order is preserved.
Do not blindly normalize order-sensitive code.

IanVS documents Babel parser plugins with TypeScript syntax support. Avoid unsupported
claims about a distinct TS parser, superior speed, or future Prettier compatibility.
Check specific installed versions.

Sources: [simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort),
[IanVS](https://github.com/ianvs/prettier-plugin-sort-imports),
[Trivago](https://github.com/trivago/prettier-plugin-sort-imports).
