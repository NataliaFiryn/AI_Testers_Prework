import type { Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  readonly profileInformationHeading: Locator;
  readonly updateProfileHeading: Locator;
  readonly dangerZoneHeading: Locator;
  readonly profileContent: Locator;
  readonly avatarButton: Locator;
  readonly userId: Locator;
  readonly displayedName: Locator;
  readonly email: Locator;
  readonly createdAt: Locator;
  readonly lastLogin: Locator;
  readonly editProfileInformationButton: Locator;
  readonly inlineDisplayedNameInput: Locator;
  readonly inlineEmailInput: Locator;
  readonly editProfileCancelButton: Locator;
  readonly newDisplayedNameInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly updateProfileButton: Locator;
  readonly deleteAccountButton: Locator;

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
    this.profileContent = page.getByTestId('profile-content');
    this.avatarButton = page.getByTestId('profile-avatar-modern');
    this.userId = page.getByTestId('user-id');
    this.displayedName = page.getByTestId('displayed-name');
    this.email = page.getByTestId('email-value');
    this.createdAt = page.getByTestId('created-at');
    this.lastLogin = page.getByTestId('last-login');
    this.editProfileInformationButton = page.getByRole('button', {
      name: 'Edit profile information'
    });
    this.inlineDisplayedNameInput = page.getByRole('textbox', {
      name: 'Display name',
      exact: true
    });
    this.inlineEmailInput = page.getByRole('textbox', {
      name: 'Email address'
    });
    this.editProfileCancelButton = page.getByTestId('edit-profile-cancel');
    this.newDisplayedNameInput = page.getByTestId('new-displayed-name-input');
    this.newPasswordInput = page.getByTestId('new-password-input');
    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.updateProfileButton = page.getByTestId('update-profile-submit-btn');
    this.deleteAccountButton = page.getByTestId('delete-account-btn');
    this.logoutButton = page
      .getByTestId('header-component')
      .getByTestId('logout-btn');
  }

  async openProfileInformationEditor(): Promise<void> {
    await this.editProfileInformationButton.click();
  }

  async cancelProfileInformationEditing(): Promise<void> {
    await this.editProfileCancelButton.click();
  }

  async updateDisplayedName(displayedName: string): Promise<void> {
    await this.newDisplayedNameInput.fill(displayedName);
    await this.updateProfileButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
