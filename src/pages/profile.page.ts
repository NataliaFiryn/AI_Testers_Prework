import type { Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly profileInformationHeading: Locator;
  readonly updateProfileHeading: Locator;
  readonly dangerZoneHeading: Locator;

  private readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.profile);
    this.profileInformationHeading = page.getByRole('heading', {
      name: 'Profile Information'
    });
    this.updateProfileHeading = page.getByRole('heading', {
      name: 'Update Profile'
    });
    this.dangerZoneHeading = page.getByRole('heading', {
      name: 'Danger Zone'
    });
    this.logoutButton = page
      .getByTestId('header-component')
      .getByTestId('logout-btn');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
