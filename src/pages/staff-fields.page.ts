import type { Locator, Page } from '@playwright/test';
import { PAGE_URLS } from '../constants/page-urls';
import { BasePage } from './base.page';

export type ResourceKind = 'Staff' | 'Field';

export class StaffFieldsPage extends BasePage {
  readonly heading: Locator;
  readonly confirmation: Locator;

  constructor(page: Page) {
    super(page, PAGE_URLS.staffFields);
    this.heading = page.getByRole('heading', {
      name: 'Staff & Fields Management',
      exact: true
    });
    this.confirmation = page.locator('#confirmModal');
  }

  async openFromProfile(): Promise<void> {
    await this.page.goto(PAGE_URLS.profile);
    await this.page.getByTestId('nav-staff-fields').click();
  }

  modal(kind: ResourceKind): Locator {
    return this.page.locator(`#add${kind}Modal`);
  }

  list(kind: ResourceKind): Locator {
    return this.page.locator(kind === 'Staff' ? '#staffList' : '#fieldsList');
  }

  record(kind: ResourceKind, name: string): Locator {
    return this.list(kind)
      .getByRole('listitem')
      .filter({
        has: this.page.getByText(name, { exact: true })
      });
  }

  async openAddModal(kind: ResourceKind): Promise<void> {
    await this.page
      .getByRole('button', { name: new RegExp(`^(?:\\+ )?Add ${kind}$`) })
      .click();
  }

  nameInput(kind: ResourceKind): Locator {
    return this.modal(kind).getByPlaceholder(
      kind === 'Staff' ? 'Enter name' : 'Enter field name',
      { exact: true }
    );
  }

  surnameInput(): Locator {
    return this.modal('Staff').getByPlaceholder('Enter surname', {
      exact: true
    });
  }

  numericInput(kind: ResourceKind): Locator {
    return this.modal(kind).getByRole('spinbutton');
  }

  districtInput(): Locator {
    return this.modal('Field').getByRole('combobox');
  }

  async submit(kind: ResourceKind): Promise<void> {
    await this.modal(kind)
      .getByRole('button', { name: new RegExp(`^(?:\\+ )?Add ${kind}$`) })
      .click();
  }

  async search(kind: ResourceKind, name: string): Promise<void> {
    await this.page
      .getByPlaceholder(
        kind === 'Staff' ? 'Search staff...' : 'Search fields...',
        { exact: true }
      )
      .fill(name);
  }

  async requestDeletion(kind: ResourceKind, name: string): Promise<void> {
    await this.record(kind, name)
      .getByTitle(`Delete ${kind}`, { exact: true })
      .click();
  }

  async confirmDeletion(): Promise<void> {
    await this.confirmation.locator('#confirmConfirmModal').click();
  }
}
