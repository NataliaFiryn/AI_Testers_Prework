---
name: static-code-analysis-typescript
description: "Review, configure, or migrate TypeScript static-analysis tooling: ESLint, type checking, formatting, and related local or CI checks. Use for tooling configuration and quality-gate requests rather than general source-code reviews."
---

# TypeScript Static Analysis

Produce a consistent quality workflow appropriate to the repository and request.
Preserve working tools and team conventions unless changes are requested or necessary.

## Select the task mode

- **Review:** inspect and report prioritized findings without editing files.
  Run relevant non-mutating checks; do not run installers, fixers, or staged-file tasks.
- **Setup/fix:** implement requested tooling or resolve a specific configuration issue.
  A narrow fix does not require hooks, sorting, editor settings, or CI.
- **Migration:** replace the requested component, preserve unrelated configuration,
  and verify compatibility and behavior before broader normalization.

Infer mode from the request. Ask only when ambiguity materially changes scope.
Limit formatting/autofixes to the agreed scope. Report broader normalization when
justified by repository-wide setup. Implementation does not authorize publishing,
branch-protection changes, or unrelated cleanup.

## Inspect before changing

Inspect relevant existing files:

- Package manifests, package-manager declarations, and lockfiles.
- ESLint configuration, legacy configs, and workspace overrides.
- TypeScript configs, extends chains, includes/excludes, and project references.
- Prettier config and ignores.
- Hooks and staged-file settings when local checks are in scope.
- CI workflows when automated gates are in scope.
- Editor settings and documentation affecting requested behavior.

Identify runtime, framework/test runner, module system, supported Node versions,
package manager, workspace layout, and extensions including TSX, MTS, and CTS where used.
Do not assume npm, Playwright, or GitHub Actions.
Use the existing package manager and lockfile rather than introducing another one.
Trace checks for each file category and record baseline failures before editing.

## Load only relevant references

- [Configuration examples](references/configuration-examples.md): ESLint, formatting,
  package scripts, and TypeScript compiler changes.
- [Import sorting](references/import-sorting.md): sorting reviews, conflicts, or migrations.
- [Hooks and CI](references/hooks-and-ci.md): local hooks and automated gates.
- [Playwright](references/playwright.md): Playwright-specific lint configuration.

Load only what the task needs. Snippets are examples, not a mandatory tool stack.

## Essential decisions

### Dependencies and linting

Declare TypeScript directly when scripts invoke tsc.
Before installation/upgrades, check intended versions' peer dependencies and Node
requirements in package metadata and official documentation. Retain/update the lockfile.
Derive engines.node and CI versions from runtime support policy; engines alone does
not guarantee enforcement by every installer.

Prefer flat config for new ESLint setups. Migrate working legacy configs only in scope.
Put file selectors on the objects whose rules/configs need scoping. A standalone
files object does not restrict subsequent array entries.
Separate TypeScript, JavaScript, Node, browser, and framework contexts as needed.
Keep unsupported-version warnings visible rather than hiding compatibility evidence.
Opinionated rules such as no-console and explicit return types are team choices.

Syntax-aware linting, typed linting, and compiler checks have different roles.
Consider typed rules when useful/requested, accounting for project inclusion and cost;
they do not replace compiler checks.

### Formatting and scripts

For new setups, prefer standalone Prettier and ESLint quality checks with
eslint-config-prettier disabling conflicts. Preserve intentional integrated formatting
when replacing it would create unnecessary churn.
If file types split responsibilities, verify complete coverage and avoid duplication.

Keep validation commands non-mutating and fixes explicit, for example format or lint:fix.
An aggregate check can remain non-mutating. Preserve clear existing names;
check:ci and tsc:check are not mandatory.
Installed binaries are available in package scripts without npx.

### TypeScript configuration

Choose module and moduleResolution for the actual runtime or bundler.
ESM source syntax and noEmit alone determine neither setting.
Node projects may need a Node module mode; bundler-managed projects may need
bundler resolution. Target selects language level independently of module format.

Prefer strict for new projects; enabling it in existing projects may need a separate
migration. Use noEmit for checks intended not to generate output.
Inspect project references/build scripts before replacing checks with tsc --noEmit.
Add aliases only when needed; verify runtime/test-runner support alongside typing.

### Local checks and CI

Hooks, sorting, and editor integrations are optional; absence is not necessarily a defect.
For CI changes, inspect triggers, path filters, permissions, dependencies, concurrency,
runtime settings, and required-check names.
Choose integration versus separate workflows and serial versus parallel jobs for
existing behavior and team goals. Do not force a filename or needs: quality.

## Implement and verify

1. Apply the smallest coherent change. Preserve unrelated plugins, options, and script
   consumers. Update the appropriate lockfile when dependencies change.
2. Update affected documentation for actual commands, runtime requirements,
   formatting coverage, and relevant local/CI behavior. Editor recommendations are
   needed only when editor behavior is in scope.
3. Run relevant installed lint, formatting-check, and type-check commands.
   Do not install missing tools merely for a review or claim unrun checks passed.
4. Check representative file categories are included. For scoping changes, inspect
   effective ESLint configuration for representative files; ignored files passing
   proves little. Include framework and non-framework examples where relevant.
5. Validate changed staged workflows in a disposable Git fixture with representative
   files, without touching the user's index. An empty staged set proves only command
   exit, not matching, fixes, or rejection behavior.
6. Inspect migration diffs and verify runtime/test behavior when import order or
   module settings affect execution.

Do not expand tooling fixes into unrelated cleanup to make every check green.
Report pre-existing source violations and environment limitations separately.

## Completion and reporting

- **Review:** findings include severity, file/line evidence, impact, and corrections.
  Distinguish broken behavior from preferences; state verification limits.
- **Setup/fix:** requested tooling is consistent, relevant checks were run, and
  affected documentation matches. Report unresolved failures honestly.
- **Migration:** replaced configuration is removed, unrelated settings remain,
  and affected file categories and behavior are verified.

Summarize changes and purpose, commands/results, and remaining limitations.
No particular plugin, hook, script name, or workflow filename is required.
