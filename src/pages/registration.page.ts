import type { Locator, Page } from '@playwright/test';

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
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.displayNameInput.fill(displayName);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
