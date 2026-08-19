import type { Locator, Page, Response } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class RegistrationPage extends BasePage {
  readonly successBanner: Locator;

  private readonly emailInput: Locator;
  private readonly displayNameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.registration);
    this.emailInput = page.getByTestId('email-input');
    this.displayNameInput = page.getByTestId('display-name-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.successBanner = page.getByRole('alert');
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
