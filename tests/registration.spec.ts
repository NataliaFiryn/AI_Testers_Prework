import { expect, test } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { RegistrationPage } from '../src/pages/registration.page';
import { generateRegistrationEmail } from '../src/utils/generate-registration-email';

test(
  'should register a new user successfully',
  { tag: '@registration' },
  async ({ page }, testInfo) => {
    // Arrange
    const email = generateRegistrationEmail(testInfo.workerIndex);
    const registrationPage = new RegistrationPage(page);
    const loginPage = new LoginPage(page);

    await registrationPage.goto();

    // Act
    const registrationResponse = await registrationPage.register(
      email,
      'Playwright Registration Test',
      'TestReg-2026!'
    );

    // Assert
    expect(registrationResponse.status()).toBe(201);
    await expect(registrationPage.successBanner).toContainText(
      'Registration successful!'
    );
    await expect(page).toHaveURL('/login.html');
    await expect(loginPage.pageTitle).toBeVisible();
  }
);
