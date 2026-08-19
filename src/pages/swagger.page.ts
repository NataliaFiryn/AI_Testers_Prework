import type { Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class SwaggerPage extends BasePage {
  readonly swaggerTitle: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.swagger);
    this.swaggerTitle = page.frameLocator('iframe').locator('.title');
  }
}
