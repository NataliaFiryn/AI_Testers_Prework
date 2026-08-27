import type { Locator, Page, Response } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class RegistrationPage extends BasePage {
  readonly successBanner: Locator;
  readonly emailInput: Locator;
  readonly displayNameInput: Locator;
  readonly passwordInput: Locator;

  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.registration);
    this.emailInput = page.getByTestId('email-input');
    this.displayNameInput = page.getByTestId('display-name-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.successBanner = page.getByRole('alert');
  }

  alertWithText(text: string): Locator {
    return this.page.getByRole('alert').filter({ hasText: text });
  }

  async fillRegistrationForm(
    email: string,
    displayName: string,
    password: string
  ): Promise<void> {
    await this.emailInput.fill(email);
    await this.displayNameInput.fill(displayName);
    await this.passwordInput.fill(password);
  }

  async typeDisplayName(displayName: string): Promise<void> {
    await this.displayNameInput.clear();
    await this.displayNameInput.pressSequentially(displayName);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async submitAndWaitForRegistrationResponse(): Promise<Response> {
    const registrationResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/v1/register') &&
        response.request().method() === 'POST'
    );

    await this.submit();

    return registrationResponsePromise;
  }

  async register(
    email: string,
    displayName: string,
    password: string
  ): Promise<Response> {
    await this.fillRegistrationForm(email, displayName, password);

    return this.submitAndWaitForRegistrationResponse();
  }
}
