import type { Locator, Page } from '@playwright/test';
import type { PageUrl } from '../constants/page-urls';
import { BasePage } from './base.page';

export class ContentPage extends BasePage {
  readonly mainTitle: Locator;

  private readonly header: Locator;

  constructor(page: Page, url: PageUrl) {
    super(page, url);
    this.mainTitle = page.locator('.main-title');
    this.header = page.locator('header');
  }

  headerText(text: string): Locator {
    return this.header.getByText(text, { exact: true });
  }
}
