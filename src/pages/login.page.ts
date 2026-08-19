import type { Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.login);
    this.pageTitle = page.getByRole('heading', {
      name: 'Login to Your User Account'
    });
  }
}
