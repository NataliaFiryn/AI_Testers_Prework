import { expect, test } from '@playwright/test';
import { PAGE_URLS } from '../src/constants/page-urls';
import { createUser } from '../src/models/user';
import { LoginPage } from '../src/pages/login.page';
import { ProfilePage } from '../src/pages/profile.page';

interface ProfileData {
  id: number;
  username: string;
  displayedName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface ProfileResponse {
  success: boolean;
  data: ProfileData;
}

test(
  'should display the authenticated user profile and support profile controls',
  { tag: ['@profile', '@positive'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const user = createUser();

    await loginPage.goto();
    const profileResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/users/profile') &&
        response.request().method() === 'GET'
    );
    await loginPage.login(user.email, user.password);
    const profileResponse = await profileResponsePromise;
    const profileBody = (await profileResponse.json()) as ProfileResponse;

    expect(profileResponse.ok()).toBe(true);
    expect(profileBody.success).toBe(true);
    expect(profileBody.data.email).toBe(user.email);
    expect(profileBody.data.isActive).toBe(true);
    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(page).toHaveTitle('Profile - Rolnopol');
    await expect(profilePage.profileContent).toBeVisible();
    await expect(profilePage.profileInformationHeading).toBeVisible();
    await expect(profilePage.updateProfileHeading).toBeVisible();
    await expect(profilePage.dangerZoneHeading).toBeVisible();
    await expect(profilePage.userId).toHaveText(String(profileBody.data.id));
    await expect(profilePage.displayedName).toHaveText(
      profileBody.data.displayedName
    );
    await expect(profilePage.email).toHaveText(profileBody.data.email);
    await expect(profilePage.createdAt).toHaveText(/.+/);
    await expect(profilePage.lastLogin).toHaveText(/.+/);
    await expect(profilePage.avatarButton).toBeVisible();
    await expect(profilePage.avatarButton).toBeDisabled();
    await expect(profilePage.avatarButton).toHaveAttribute(
      'title',
      'Avatar upload unavailable'
    );
    await expect(profilePage.newDisplayedNameInput).toBeVisible();
    await expect(profilePage.newPasswordInput).toBeVisible();
    await expect(profilePage.confirmPasswordInput).toBeVisible();
    await expect(profilePage.updateProfileButton).toBeVisible();
    await expect(profilePage.updateProfileButton).toBeEnabled();
    await expect(profilePage.deleteAccountButton).toBeVisible();
    await expect(profilePage.deleteAccountButton).toBeEnabled();

    await profilePage.openProfileInformationEditor();

    await expect(profilePage.inlineDisplayedNameInput).toBeVisible();
    await expect(profilePage.inlineDisplayedNameInput).toHaveValue(
      profileBody.data.displayedName
    );
    await expect(profilePage.inlineEmailInput).toBeVisible();
    await expect(profilePage.inlineEmailInput).toHaveValue(
      profileBody.data.email
    );

    await profilePage.cancelProfileInformationEditing();

    await expect(profilePage.inlineDisplayedNameInput).toBeHidden();
    await expect(profilePage.inlineEmailInput).toBeHidden();

    const updatedDisplayedName = `PW${Date.now().toString().slice(-8)}`;

    try {
      const updateResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/users/profile') &&
          response.request().method() === 'PUT'
      );
      await profilePage.updateDisplayedName(updatedDisplayedName);
      const updateResponse = await updateResponsePromise;
      const updateBody = (await updateResponse.json()) as ProfileResponse;

      expect(updateResponse.ok()).toBe(true);
      expect(updateBody.success).toBe(true);
      expect(updateBody.data.displayedName).toBe(updatedDisplayedName);
      await expect(profilePage.displayedName).toHaveText(updatedDisplayedName);

      await page.reload();

      await expect(profilePage.profileContent).toBeVisible();
      await expect(profilePage.displayedName).toHaveText(updatedDisplayedName);
    } finally {
      const restoreResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/users/profile') &&
          response.request().method() === 'PUT'
      );
      await profilePage.updateDisplayedName(profileBody.data.displayedName);
      const restoreResponse = await restoreResponsePromise;

      expect(restoreResponse.ok()).toBe(true);
      await expect(profilePage.displayedName).toHaveText(
        profileBody.data.displayedName
      );
    }
  }
);
