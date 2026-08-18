import { expect, test } from '@playwright/test';
import { RegistrationPage } from '../src/pages/registration.page';

test(
  'should register a new user successfully',
  { tag: '@registration' },
  async ({ page }, testInfo) => {
    // Arrange
    const email = `playwright.registration.${Date.now()}.${testInfo.workerIndex}@example.com`;
    const registrationPage = new RegistrationPage(page);

    await registrationPage.goto();

    // Act
    const [registrationResponse] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/v1/register') &&
          response.request().method() === 'POST'
      ),
      expect(registrationPage.successBanner).toContainText(
        'Registration successful!'
      ),
      registrationPage.register(
        email,
        'Playwright Registration Test',
        'TestReg-2026!'
      )
    ]);

    // Assert
    expect(registrationResponse.status()).toBe(201);
    await expect(page).toHaveURL('/login.html');
    await expect(
      page.getByRole('heading', { name: 'Login to Your User Account' })
    ).toBeVisible();
  }
);
