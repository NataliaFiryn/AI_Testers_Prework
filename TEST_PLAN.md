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

| ID | Scenario | Expected result |
| --- | --- | --- |
| 1 | Register with valid data | Account is created and the user is logged in. |
| 2 | Log in and log out | Valid login succeeds; logout removes access to protected pages. |
| 3 | Log in with invalid credentials | Login is rejected with an error message. |
| 4 | View and update the profile | Profile data is displayed and valid changes are saved. |
| 5 | Add, edit, and remove a field | Field changes are saved and visible in the farm overview. |
| 6 | Add animals and assign them to a field | Animal data and field assignment are saved correctly. |
| 7 | Add staff and assign them to a field | Staff data and assignment are saved correctly. |
| 8 | Submit invalid farm resource data | Invalid data is rejected without changing existing data. |
| 9 | Browse and filter marketplace offers | Available field and animal offers are displayed correctly. |
| 10 | Create an offer for an owned, unassigned resource | One offer is created with correct details, price, and `active` status. |
| 11 | Buy an available resource | Ownership and balances update, transaction records are created, and the offer becomes `sold`. |
| 12 | Buy with insufficient funds | Purchase is blocked with an insufficient-funds error; ownership and balances do not change. |
| 13 | Review balance and transaction history | Balance and transaction entries match completed operations. |
| 14 | Access another user's protected resources | Unauthorized access or modification is blocked. |
| 15 | Check application and database health | Health endpoints report that the services are available. |
| 16 | Offer an assigned or already offered resource | Assigned resources become `unavailable`; duplicate offers are blocked. |
| 17 | Buy your own, sold, or unavailable offer | Purchase is blocked and no ownership or balance changes occur. |
| 18 | Cancel an active offer | The offer becomes `cancelled` and cannot be purchased. |
| 19 | Transfer funds to another user | Both balances and transaction histories update by the transferred amount. |
| 20 | Register with an existing email and test login limits | Duplicate registration is rejected and repeated failed logins are rate-limited. |
| 21 | Access admin features as a farmer | Access to admin and superadmin functionality is blocked. |
| 22 | Use an expired session | Access is rejected after the documented session lifetime. |

## Completion criteria

- All scenarios have been executed.
- Registration, login, farm management, and marketplace purchase work correctly.
- There are no open issues involving unauthorized access, incorrect ownership, or incorrect balances.
- Any other failures are documented with reproduction steps and evidence.
