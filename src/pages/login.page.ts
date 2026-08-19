import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.pageTitle = page.getByRole('heading', {
      name: 'Login to Your User Account'
    });
  }
}
