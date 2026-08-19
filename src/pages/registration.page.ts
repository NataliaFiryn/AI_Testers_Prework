import type { Locator, Page, Response } from '@playwright/test';

export class RegistrationPage {
  readonly successBanner: Locator;

  private readonly emailInput: Locator;
  private readonly displayNameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByTestId('email-input');
    this.displayNameInput = page.getByTestId('display-name-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.successBanner = page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto('/register.html');
  }

  async register(
    email: string,
    displayName: string,
    password: string
  ): Promise<Response> {
    await this.emailInput.fill(email);
    await this.displayNameInput.fill(displayName);
    await this.passwordInput.fill(password);

    const registrationResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/v1/register') &&
        response.request().method() === 'POST'
    );

    await this.submitButton.click();

    return registrationResponsePromise;
  }
}
