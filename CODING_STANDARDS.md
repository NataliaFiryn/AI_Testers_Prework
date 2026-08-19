# Coding Standards

## Page Objects

Page Objects are stored in `src/pages/` as TypeScript classes. Each class receives a Playwright `Page` in its constructor, defines page locators, and exposes reusable methods for navigation or user interactions. Tests create these objects and use their locators and methods while keeping test expectations in `tests/`.

### Guidelines

- Keep page locators and reusable interaction methods in Page Objects.
- Do not place assertions or verifications in Page Objects. Keep all `expect` calls and result checks in test files only.
- Use clear class, locator, and method names that describe the page element or user action.
- Keep methods small and focused on one interaction or short user flow.
- Reuse locators and methods instead of duplicating selectors or interaction logic across tests.
- Prefer stable Playwright locators, such as roles or test IDs, when available.
- Expose only the locators that tests need for assertions; keep implementation-only locators private.
