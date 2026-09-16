# Hooks and CI

Load for local-hook or automated-gate changes. Adapt to manager, workspaces, scripts,
and provider. Hooks are not required for unrelated lint fixes.

## Local checks

Use staged checks when wanted; put full-project types in pre-commit, pre-push, or CI
according to cost and preference. Illustrative npm/standalone-formatting fragment:

```json
{
  "scripts": {
    "prepare": "husky",
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx,mts,cts,js,mjs,cjs}": [
      "prettier --write",
      "eslint --fix --max-warnings=0"
    ],
    "*.{json,md,yml,yaml}": "prettier --write"
  }
}
```

Preserve existing prepare behavior rather than overwriting it.
Follow current Husky initialization guidance for authorized new setup in a Git repo.
Adapt globs to parsers/ignores; array tasks run sequentially. Avoid overlapping concurrent
tasks editing the same files or duplicate formatting when ESLint runs Prettier.

Example .husky/pre-commit after initialization:

```sh
npm run lint-staged
```

Validate changed hooks in a disposable Git fixture with supported files, fixable and
non-fixable issues. Check matching and commit rejection without touching the user's index.
An empty staged set is insufficient.

## CI design

Inspect triggers, path filters, dependencies, permissions, concurrency, runtime versions,
and required-check names. Integrate when coverage fits; separate workflows may suit
independent triggers. One workflow can expose multiple PR checks.
Preserve dependency edges and required-check names.

Choose serial jobs to avoid expensive failed tests or parallel jobs for complete feedback
sooner. needs: quality is a scheduling policy, not mandatory.
Check conditional/skipped jobs do not weaken enforcement.

Illustrative job fragment in an existing npm/GitHub Actions workflow:

```yaml
jobs:
  quality:
    name: Quality checks
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: npm
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npm run typecheck
```

Assumes committed .nvmrc, npm lockfile, and these scripts. Use actual runtime config or
supported matrix. Select action tags/SHA pins for current compatibility and repo policy;
tags shown are examples, not latest-version claims.
Monorepos may need working directories and explicit cache lockfile paths.
Use reproducible installs for other managers.

New workflow triggers must match actual branches and intended coverage, with no required
filename. Preserve permissions needed by unrelated jobs.
Quality commands must not fix/write source. CI is authoritative because hooks can be
bypassed. Document versions actually tested: one matrix entry does not cover engines.

Sources: [Husky](https://typicode.github.io/husky/get-started.html),
[lint-staged](https://github.com/lint-staged/lint-staged),
[GitHub status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks),
[setup-node](https://github.com/actions/setup-node).
