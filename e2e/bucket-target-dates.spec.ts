import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';

for (const mode of ['guest', 'account']) {
  test(`${mode} can set, reschedule, and clear a tentative bucket-list date`, async ({
    page,
  }, testInfo) => {
    if (mode === 'account') {
      const signup = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: `target-${crypto.randomUUID()}@significanthobbies.test`,
          password: 'e2e-test-password-not-a-secret',
          name: 'Target date owner',
        },
      });
      expect(signup.ok()).toBeTruthy();
    }
    const title = 'Learn to sail';
    await page.goto('/bucket-list');
    const add = page.getByRole('textbox', { name: 'Add something you want to do', exact: true });
    await waitForHydrated(add);
    await add.fill(title);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    const open = page.getByRole('button', { name: `Open ${title}`, exact: true });
    await open.click();
    const panel = page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
    const date = panel.getByLabel('Tentative target date', { exact: true });
    const save = panel.getByRole('button', { name: 'Save date', exact: true });
    await date.fill('2031-06-12');
    await save.click();
    await expect(save).toBeDisabled();
    await expect(open).toContainText('12 Jun 2031');
    await page.reload();
    await waitForHydrated(open);
    await open.click();
    await expect(date).toHaveValue('2031-06-12');
    await expect(panel.getByLabel('Target year', { exact: true })).toHaveValue('2031');
    await expect(panel.getByRole('radio', { name: 'To do', exact: true })).toBeChecked();
    await date.fill('2032-07-14');
    await save.click();
    await expect(open).toContainText('14 Jul 2032');
    await date.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('tentative-target-date.png') });
    await panel.getByRole('button', { name: 'Clear date', exact: true }).click();
    await save.click();
    await expect(open).not.toContainText('14 Jul 2032');
    await page.reload();
    await waitForHydrated(open);
    await open.click();
    await expect(date).toHaveValue('');
    await expect(panel.getByLabel('Target year', { exact: true })).toHaveValue('2032');
    await date.fill('2032-07-14');
    await save.click();
    await expect(save).toBeDisabled();
    await panel.getByLabel('Target year', { exact: true }).selectOption('2035');
    await expect(date).toHaveValue('');
    await expect(open).toContainText('by 2035');
  });
}
