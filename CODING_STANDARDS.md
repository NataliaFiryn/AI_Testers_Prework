# Coding Standards

This document is the single source of truth for implementation and testing conventions in this repository. Repository configuration files remain authoritative for executable tool behavior.

## TypeScript and code quality

- Follow the strict TypeScript settings in `tsconfig.json`.
- Use clear names that describe the responsibility of classes, functions, methods, variables, and locators.
- Keep functions and methods small and focused on one responsibility.
- Follow the rules defined in `eslint.config.mjs`.

## Formatting

- Format code with Prettier using `.prettierrc`.
- Use single quotes and omit trailing commas, as configured by Prettier.
- Do not manually format code in a way that conflicts with the formatter.

## Comments and documentation

- Prefer clear names and small, focused units over comments that restate what the code does.
- Remove obvious, redundant, stale, or commented-out code comments.
- Use concise JSDoc only when it explains non-obvious intent, important context, an architectural boundary, or a public contract that types and names do not communicate clearly.
- Keep comments accurate and close to the code they explain.

## Testing

- Use the Playwright Test framework for automated tests.
- Follow the settings and conventions in `playwright.config.ts`.
- Structure each test using the Arrange, Act, Assert pattern. Separate the phases with blank lines when that improves readability; do not add labels that merely restate the phase.
- Keep assertions and verifications in test files. Do not place them in Page Objects.
- Prefer Playwright web-first assertions and do not use fixed timeouts, in accordance with `eslint.config.mjs`.

## Page Objects

Page Objects are stored in `src/pages/` as TypeScript classes. Each class receives a Playwright `Page` in its constructor, defines page locators, and exposes reusable methods for navigation or user interactions. Tests create these objects and use their locators and methods while keeping test expectations in `tests/`.

### Guidelines

- Keep page locators and reusable interaction methods in Page Objects.
- Use clear class, locator, and method names that describe the page element or user action.
- Keep methods small and focused on one interaction or short user flow.
- Reuse locators and methods instead of duplicating selectors or interaction logic across tests.
- Prefer stable Playwright locators, such as roles or test IDs, when available. Avoid raw locators when a semantic locator is suitable.
- Expose only the locators that tests need for assertions; keep implementation-only locators private.

## Validation

Run the checks relevant to the change:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`, or a targeted Playwright test command when appropriate
