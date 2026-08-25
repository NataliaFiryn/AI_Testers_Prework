# Rolnopol Test Plan

## Objective

Check that the main Rolnopol features work according to the official documentation at `http://localhost:3000/docs.html`.

## Scope

- Registration, login, and logout
- Profile management
- Fields, animals, staff, and assignments
- Marketplace offers and purchases
- Account balance and transaction history
- Access control and basic error handling

Performance and security audits are not included.

## Test setup

- Application: `http://localhost:3000`
- Browser: Chromium
- Use at least two demo accounts for marketplace scenarios
- Use `emptyuser@rolnopol.demo.pl` / `demoPass123` for an account without resources
- Record balances and resource ownership before marketplace tests

## Test scenarios

Coverage statuses describe implemented assertions, not test execution results:

- **Automated**: the expected result is asserted by a Playwright test.
- **Partial**: only part of the expected result is asserted.
- **Missing**: no corresponding Playwright assertion exists in `tests/`.

| ID  | Scenario                                              | Expected result                                                                                | Coverage  | Automated test         | Tags                                        |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------- | ---------------------- | ------------------------------------------- |
| 1   | Register with valid data                              | The API returns `201`, a success message is shown, and the user is redirected to login.        | Automated | `registration.spec.ts` | `@registration @positive`                   |
| 2   | Log in and log out                                    | Valid login succeeds; logout removes access to protected pages.                                | Missing   | —                      | `@auth @smoke @positive`                    |
| 3   | Log in with invalid credentials                       | Login is rejected with an error message.                                                       | Missing   | —                      | `@auth @negative`                           |
| 4   | View and update the profile                           | Profile data is displayed and valid changes are saved.                                         | Missing   | —                      | `@profile @positive`                        |
| 5   | Add, edit, and remove a field                         | Field changes are saved and visible in the farm overview.                                      | Missing   | —                      | `@fields @crud @positive`                   |
| 6   | Add animals and assign them to a field                | Animal data and field assignment are saved correctly.                                          | Missing   | —                      | `@animals @assignments @positive`           |
| 7   | Add staff and assign them to a field                  | Staff data and assignment are saved correctly.                                                 | Missing   | —                      | `@staff @assignments @positive`             |
| 8   | Submit invalid farm resource data                     | Invalid data is rejected without changing existing data.                                       | Missing   | —                      | `@farm-resources @validation @negative`     |
| 9   | Browse and filter marketplace offers                  | Available field and animal offers are displayed correctly.                                     | Missing   | —                      | `@marketplace @positive`                    |
| 10  | Create an offer for an owned, unassigned resource     | One offer is created with correct details, price, and `active` status.                         | Missing   | —                      | `@marketplace @offers @positive`            |
| 11  | Buy an available resource                             | Ownership and balances update, transaction records are created, and the offer becomes `sold`.  | Missing   | —                      | `@marketplace @purchase @smoke @positive`   |
| 12  | Buy with insufficient funds                           | Purchase is blocked with an insufficient-funds error; ownership and balances do not change.    | Missing   | —                      | `@marketplace @purchase @negative`          |
| 13  | Review balance and transaction history                | Balance and transaction entries match completed operations.                                    | Missing   | —                      | `@finance @transactions @positive`          |
| 14  | Access another user's protected resources             | Unauthorized access or modification is blocked.                                                | Missing   | —                      | `@access-control @negative`                 |
| 15  | Check application and database health                 | Health endpoints report that the services are available.                                       | Missing   | —                      | `@health @smoke`                            |
| 16  | Offer an assigned or already offered resource         | Assigned resources become `unavailable`; duplicate offers are blocked.                         | Missing   | —                      | `@marketplace @offers @negative`            |
| 17  | Buy your own, sold, or unavailable offer              | Purchase is blocked and no ownership or balance changes occur.                                 | Missing   | —                      | `@marketplace @purchase @negative`          |
| 18  | Cancel an active offer                                | The offer becomes `cancelled` and cannot be purchased.                                         | Missing   | —                      | `@marketplace @offers @positive`            |
| 19  | Transfer funds to another user                        | Both balances and transaction histories update by the transferred amount.                      | Missing   | —                      | `@finance @transfer @positive`              |
| 20  | Register with an existing email and test login limits | Duplicate registration is rejected and repeated failed logins are rate-limited.                | Missing   | —                      | `@registration @auth @rate-limit @negative` |
| 21  | Access admin features as a farmer                     | Access to admin and superadmin functionality is blocked.                                       | Missing   | —                      | `@access-control @roles @negative`          |
| 22  | Use an expired session                                | Access is rejected after the documented session lifetime.                                      | Missing   | —                      | `@auth @session @negative`                  |
| 23  | Load the home page                                    | The response succeeds and the expected title, main heading, and introductory text are visible. | Automated | `main.smoke.spec.ts`   | `@navigation @smoke`                        |
| 24  | Load the alerts page                                  | The response succeeds and the expected title, main heading, and alerts heading are visible.    | Automated | `main.smoke.spec.ts`   | `@navigation @alerts @smoke`                |
| 25  | Load the documentation page                           | The response succeeds and the expected title, main heading, and guide heading are visible.     | Automated | `main.smoke.spec.ts`   | `@navigation @documentation @smoke`         |
| 26  | Load the registration page                            | The response succeeds and the expected title, main heading, and account heading are visible.   | Automated | `main.smoke.spec.ts`   | `@navigation @registration @smoke`          |
| 27  | Load the Swagger page                                 | The response succeeds and the expected title and Swagger heading are visible.                  | Automated | `main.smoke.spec.ts`   | `@navigation @documentation @smoke`         |

## Completion criteria

- All automated scenarios pass in the intended test environment.
- Missing and partial scenarios are executed manually or automated before release.
- Registration, login, farm management, and marketplace purchase work correctly.
- There are no open issues involving unauthorized access, incorrect ownership, or incorrect balances.
- Any other failures are documented with reproduction steps and evidence.
