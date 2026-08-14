import { expect, test } from '@playwright/test';

test(
  'should register a new user successfully',
  { tag: '@registration' },
  async ({ page }, testInfo) => {
    const email = `playwright.registration.${Date.now()}.${testInfo.workerIndex}@example.com`;

    await page.goto('/register.html');

    await page.getByTestId('email-input').fill(email);
    await page
      .getByTestId('display-name-input')
      .fill('Playwright Registration Test');
    await page.getByTestId('password-input').fill('TestReg-2026!');

    const successBanner = page.getByRole('alert');
    const [registrationResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/v1/register') &&
          response.request().method() === 'POST'
      ),
      expect(successBanner).toContainText('Registration successful!'),
      page.getByTestId('register-submit-btn').click()
    ]);

    expect(registrationResponse.status()).toBe(201);
    await expect(page).toHaveURL('/login.html');
    await expect(
      page.getByRole('heading', { name: 'Login to Your User Account' })
    ).toBeVisible();
  }
);
