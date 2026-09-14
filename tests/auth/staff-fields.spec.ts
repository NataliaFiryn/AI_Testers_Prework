import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { PAGE_URLS } from '../../src/constants/page-urls';
import {
  StaffFieldsPage,
  type ResourceKind
} from '../../src/pages/staff-fields.page';

const scenarios: { kind: ResourceKind; tag: string; readyText: RegExp }[] = [
  { kind: 'Staff', tag: '@staff', readyText: /age:|No staff found\./ },
  { kind: 'Field', tag: '@fields', readyText: /ha|No fields found\./ }
];

for (const { kind, tag, readyText } of scenarios) {
  test.describe(`Add ${kind.toLowerCase()} as DEMO_USER`, () => {
    let recordName: string;
    let searchTerm: string;

    test.beforeEach(async ({ page }) => {
      searchTerm = `Test${randomUUID().replaceAll('-', '').slice(0, 20)}`;
      recordName = kind === 'Staff' ? `${searchTerm} Tester` : searchTerm;
      const management = new StaffFieldsPage(page);
      await management.openFromProfile();
      await expect(page).toHaveURL(PAGE_URLS.staffFields);
      await expect(page).toHaveTitle('Staff & Fields - Main');
      await expect(management.heading).toBeVisible();
      await expect(management.list(kind)).toContainText(readyText);
    });

    test.afterEach(async ({ page }) => {
      const management = new StaffFieldsPage(page);
      await expect(management.list(kind)).toContainText(readyText);
      await management.search(kind, searchTerm);
      const record = management.record(kind, recordName);

      // Creation may have failed before a record was saved.
      if ((await record.count()) === 0) {
        await expect
          .soft(management.list(kind))
          .toHaveText(
            kind === 'Staff' ? 'No staff found.' : 'No fields found.'
          );
        return;
      }

      await expect.soft(record).toHaveCount(1);
      await expect
        .soft(record)
        .toHaveAttribute(
          kind === 'Staff' ? 'data-staff-id' : 'data-field-id',
          /\S+/
        );
      await management.requestDeletion(kind, recordName);
      await expect.soft(management.confirmation).toBeVisible();
      await expect
        .soft(management.confirmation)
        .toContainText(
          `Are you sure you want to delete this ${kind.toLowerCase()}?`
        );
      const recordId = await record.getAttribute(
        kind === 'Staff' ? 'data-staff-id' : 'data-field-id'
      );
      const deletionPath = `/api/v1/${kind === 'Staff' ? 'staff' : 'fields'}/${recordId}`;
      const [deletionResponse] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === 'DELETE' &&
            new URL(response.url()).pathname === deletionPath
        ),
        management.confirmDeletion()
      ]);
      expect(
        deletionResponse.ok(),
        `DELETE ${deletionPath} returned HTTP ${deletionResponse.status()}`
      ).toBe(true);
      await expect(management.confirmation).toBeHidden();
      await expect(record).toHaveCount(0);

      await page.reload();
      await expect(management.list(kind)).toContainText(readyText);
      await management.search(kind, searchTerm);
      await expect(management.list(kind)).toHaveText(
        kind === 'Staff' ? 'No staff found.' : 'No fields found.'
      );
      await expect.soft(record).toHaveCount(0);
    });

    if (kind === 'Staff') {
      test(
        'should persist a new staff member',
        { tag: [tag, '@crud', '@positive'] },
        async ({ page }) => {
          const management = new StaffFieldsPage(page);
          const name = searchTerm;

          await management.openAddModal('Staff');
          await expect(management.modal('Staff')).toBeVisible();
          await management.nameInput('Staff').fill(name);
          await management.surnameInput().fill('Tester');
          await management.numericInput('Staff').fill('30');
          await expect(management.nameInput('Staff')).toHaveValue(name);
          await expect(management.surnameInput()).toHaveValue('Tester');
          await expect(management.numericInput('Staff')).toHaveValue('30');
          await management.submit('Staff');

          await expect(management.modal('Staff')).toBeHidden();
          await management.search('Staff', searchTerm);
          const record = management.record('Staff', recordName);
          await expect(record).toHaveCount(1);
          await expect(record).toContainText('age: 30');
          await expect(record).toContainText('Unassigned');

          await page.reload();
          await expect(management.list('Staff')).toContainText(readyText);
          await management.search('Staff', searchTerm);
          await expect(record).toHaveCount(1);
          await expect(record).toContainText('age: 30');
          await expect(record).toContainText('Unassigned');
        }
      );
    } else {
      test(
        'should persist a new field',
        { tag: [tag, '@crud', '@positive'] },
        async ({ page }) => {
          const management = new StaffFieldsPage(page);

          await management.openAddModal('Field');
          await expect(management.modal('Field')).toBeVisible();
          await management.nameInput('Field').fill(recordName);
          await management.numericInput('Field').fill('12.5');
          await expect(management.nameInput('Field')).toHaveValue(recordName);
          await expect(management.numericInput('Field')).toHaveValue('12.5');
          await expect(management.districtInput()).toHaveValue('');
          await management.submit('Field');

          await expect(management.modal('Field')).toBeHidden();
          await management.search('Field', recordName);
          const record = management.record('Field', recordName);
          await expect(record).toHaveCount(1);
          await expect(record).toContainText(/(?<![\d.,-])\b12\.5\s+ha\b/);

          await page.reload();
          await expect(management.list('Field')).toContainText(readyText);
          await management.search('Field', recordName);
          await expect(record).toHaveCount(1);
          await expect(record).toContainText(/(?<![\d.,-])\b12\.5\s+ha\b/);
        }
      );
    }
  });
}
