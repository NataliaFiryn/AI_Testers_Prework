# Rolnopol Test Plan

## Objective

Check that the main Rolnopol features work according to the official documentation at `<BASE_URL>/docs.html`.

## Scope

- Registration, login, and logout
- Profile management
- Fields, animals, staff, and assignments
- Marketplace offers and purchases
- Account balance and transaction history
- Access control and basic error handling

Performance and security audits are not included.

## Test setup

- Application: configured through `BASE_URL` in the local `.env` file or the CI environment
- Browser: Chromium
- Use at least two demo accounts for marketplace scenarios
- Use `emptyuser@rolnopol.demo.pl` / `demoPass123` for an account without resources
- Record balances and resource ownership before marketplace tests

## Test scenarios

Coverage statuses describe implemented assertions, not test execution results:

- **Automated**: the expected result is asserted by a Playwright test.
- **Partial**: only part of the expected result is asserted.
- **Missing**: no corresponding Playwright assertion exists in `tests/`.

| ID  | Scenario                                              | Expected result                                                                                | Coverage  | Automated test              | Tags                                        |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------- | --------------------------- | ------------------------------------------- |
| 1   | Register with valid data                              | The API returns `201`, a success message is shown, and the user is redirected to login.        | Automated | `registration.spec.ts`      | `@registration @positive`                   |
| 2   | Log in and log out                                    | Valid login succeeds; logout removes access to protected pages.                                | Partial   | `auth/demo-user.spec.ts`    | `@auth @smoke @positive`                    |
| 3   | Log in with invalid credentials                       | Login is rejected with an error message.                                                       | Missing   | —                           | `@auth @negative`                           |
| 4   | View and update the profile                           | Profile data is displayed and valid changes are saved.                                         | Automated | `profile.spec.ts`           | `@profile @positive`                        |
| 5   | Add, edit, and remove a field                         | Field changes are saved and visible in the farm overview.                                      | Partial   | `auth/staff-fields.spec.ts` | `@fields @crud @positive`                   |
| 6   | Add animals and assign them to a field                | Animal data and field assignment are saved correctly.                                          | Missing   | —                           | `@animals @assignments @positive`           |
| 7   | Add staff and assign them to a field                  | Staff data and assignment are saved correctly.                                                 | Partial   | `auth/staff-fields.spec.ts` | `@staff @assignments @positive`             |
| 8   | Submit invalid farm resource data                     | Invalid data is rejected without changing existing data.                                       | Missing   | —                           | `@farm-resources @validation @negative`     |
| 9   | Browse and filter marketplace offers                  | Available field and animal offers are displayed correctly.                                     | Missing   | —                           | `@marketplace @positive`                    |
| 10  | Create an offer for an owned, unassigned resource     | One offer is created with correct details, price, and `active` status.                         | Missing   | —                           | `@marketplace @offers @positive`            |
| 11  | Buy an available resource                             | Ownership and balances update, transaction records are created, and the offer becomes `sold`.  | Missing   | —                           | `@marketplace @purchase @smoke @positive`   |
| 12  | Buy with insufficient funds                           | Purchase is blocked with an insufficient-funds error; ownership and balances do not change.    | Missing   | —                           | `@marketplace @purchase @negative`          |
| 13  | Review balance and transaction history                | Balance and transaction entries match completed operations.                                    | Missing   | —                           | `@finance @transactions @positive`          |
| 14  | Access another user's protected resources             | Unauthorized access or modification is blocked.                                                | Missing   | —                           | `@access-control @negative`                 |
| 15  | Check application and database health                 | Health endpoints report that the services are available.                                       | Missing   | —                           | `@health @smoke`                            |
| 16  | Offer an assigned or already offered resource         | Assigned resources become `unavailable`; duplicate offers are blocked.                         | Missing   | —                           | `@marketplace @offers @negative`            |
| 17  | Buy your own, sold, or unavailable offer              | Purchase is blocked and no ownership or balance changes occur.                                 | Missing   | —                           | `@marketplace @purchase @negative`          |
| 18  | Cancel an active offer                                | The offer becomes `cancelled` and cannot be purchased.                                         | Missing   | —                           | `@marketplace @offers @positive`            |
| 19  | Transfer funds to another user                        | Both balances and transaction histories update by the transferred amount.                      | Missing   | —                           | `@finance @transfer @positive`              |
| 20  | Register with an existing email and test login limits | Duplicate registration is rejected and repeated failed logins are rate-limited.                | Partial   | `registration.spec.ts`      | `@registration @auth @rate-limit @negative` |
| 21  | Access admin features as a farmer                     | Access to admin and superadmin functionality is blocked.                                       | Missing   | —                           | `@access-control @roles @negative`          |
| 22  | Use an expired session                                | Access is rejected after the documented session lifetime.                                      | Missing   | —                           | `@auth @session @negative`                  |
| 23  | Load the home page                                    | The response succeeds and the expected title, main heading, and introductory text are visible. | Automated | `main.smoke.spec.ts`        | `@navigation @smoke`                        |
| 24  | Load the alerts page                                  | The response succeeds and the expected title, main heading, and alerts heading are visible.    | Automated | `main.smoke.spec.ts`        | `@navigation @alerts @smoke`                |
| 25  | Load the documentation page                           | The response succeeds and the expected title, main heading, and guide heading are visible.     | Automated | `main.smoke.spec.ts`        | `@navigation @documentation @smoke`         |
| 26  | Load the registration page                            | The response succeeds and the expected title, main heading, and account heading are visible.   | Automated | `main.smoke.spec.ts`        | `@navigation @registration @smoke`          |
| 27  | Load the Swagger page                                 | The response succeeds and the expected title and Swagger heading are visible.                  | Automated | `main.smoke.spec.ts`        | `@navigation @documentation @smoke`         |

| 28 | Reject missing or invalid registration email | Empty and whitespace-only email, four malformed addresses, and an address without a domain suffix show validation feedback, stay on registration, and have no observed registration POST. | Automated | `registration.spec.ts`: registration validation: should require an email address; should reject a whitespace-only email address; should reject malformed email (parameterized); should reject an email without a domain suffix | `@registration @negative` |
| 29 | Reject missing or short registration password | Empty and two-character passwords show validation feedback, stay on registration, and have no observed registration POST. | Automated | `registration.spec.ts`: registration validation: should require a password; should reject a password below the minimum length | `@registration @negative` |
| 30 | Reject invalid registration display name | Two-character, whitespace-only, punctuation, and non-ASCII display names show validation feedback, stay on registration, and have no observed registration POST. | Automated | `registration.spec.ts`: registration validation: should reject a display name below the minimum length; should reject a whitespace-only display name; should reject display-name (parameterized) | `@registration @negative` |
| 31 | Limit display-name input length | Typing 21 characters leaves 20 characters in the display-name input. | Automated | `registration.spec.ts`: should limit the display name to 20 characters | `@registration @negative` |
| 32 | Trim whitespace around a valid registration email | The request contains the trimmed email; the API returns `201`, a success message is shown, and the page redirects to login. | Automated | `registration.spec.ts`: should trim email whitespace around a valid address | `@registration @positive` |
| 33 | Trim a valid registration display name | The request contains the trimmed display name; the API returns `201`, a success message is shown, and the page redirects to login. | Automated | `registration.spec.ts`: should trim a valid display name before registration | `@registration @positive` |
| 34 | Register without a display name | The request omits displayedName; the API returns `201`, a success message is shown, and the page redirects to login. | Automated | `registration.spec.ts`: should register without an optional display name | `@registration @positive` |

Staff and field creation tests verify saved details after reload and delete their own records after each test. Scenario 5 remains partial because field editing is not covered; scenario 7 remains partial because staff assignment is not covered.

Coverage notes:

- Scenario 2 maps to `auth/demo-user.spec.ts`, `should display the DEMO_USER profile and log out`. Login and the redirect home are asserted; protected access after logout is not checked.
- Scenario 4 maps to `profile.spec.ts`, `should display the authenticated user profile and support profile controls`. It checks displayed profile data, editor opening/cancellation, and display-name update persistence after reload. Password/email changes and account deletion are not covered; visible controls do not prove those operations work.
- Scenarios 5 and 7 map to `should persist a new field` and `should persist a new staff member`. Cleanup asserts successful deletion and absence after reload when a record exists. Field editing and staff assignment remain missing.
- Scenario 20 maps to `registration.spec.ts`, `should reject registration for an existing email`: HTTP `409`, the error response/message, and remaining on registration are asserted. Failed-login rate limiting is not covered.
- Scenarios 28?34 document behavior asserted by the current implementation; product requirements were not independently verified. No-request checks inspect requests observed by the test, not a guarantee against arbitrarily delayed requests. Scenario 31 checks input truncation only, not server-side length enforcement.
- Tags in this plan classify scenarios; they are not necessarily implemented Playwright tags. For example, the page-loading tests carry only `@smoke`.

Inspection scope: all five spec files and authentication setup under `tests/` are matched by the projects in `playwright.config.ts`. Registration/profile run in `public-tests`, page loading in `smoke-tests`, staff/fields in `demo-user` after `setup`, and logout in `demo-user-logout` after `demo-user`. No skip, fixme, or exclusive-test declarations were found. Project dependencies can prevent dependent tests from running if a prerequisite fails. This synchronization is based on source inspection; browser tests were not run.

## Completion criteria

- All automated scenarios pass in the intended test environment.
- Missing and partial scenarios are executed manually or automated before release.
- Registration, login, farm management, and marketplace purchase work correctly.
- There are no open issues involving unauthorized access, incorrect ownership, or incorrect balances.
- Any other failures are documented with reproduction steps and evidence.
