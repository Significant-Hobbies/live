import { expect, test } from '@playwright/test';
import { waitForHydrated } from './fixtures/hydration';

for (const mode of ['guest', 'account']) {
  test(`${mode} can choose, change, and leave open a bucket-list life scale`, async ({
    page,
  }, testInfo) => {
    if (mode === 'account') {
      const signup = await page.request.post('/api/auth/sign-up/email', {
        data: {
          email: `life-scale-${crypto.randomUUID()}@significanthobbies.test`,
          password: 'e2e-test-password-not-a-secret',
          name: 'Life scale owner',
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
    const panel = page.getByRole('complementary', { name: `Item: ${title}`, exact: true });
    await open.click();
    const choices = panel.getByRole('group', { name: 'How do you picture this?', exact: true });
    await expect(choices.locator('input:checked')).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Leave open', exact: true })).toHaveCount(0);
    for (const [value, label] of [
      ['moment', 'Moment'],
      ['adventure', 'Adventure'],
      ['chapter', 'Chapter'],
    ]) {
      await choices.locator(`input[value="${value}"]`).check();
      await expect(open).toContainText(label!);
      await page.reload();
      await waitForHydrated(open);
      await open.click();
      await expect(choices.locator(`input[value="${value}"]`)).toBeChecked();
      await expect(panel.getByRole('radio', { name: 'To do', exact: true })).toBeChecked();
    }
    await choices.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('bucket-life-scale.png') });
    await panel.getByRole('button', { name: 'Leave open', exact: true }).click();
    await expect(open).not.toContainText('Chapter');
    await page.reload();
    await waitForHydrated(open);
    await open.click();
    await expect(choices.locator('input:checked')).toHaveCount(0);
  });
}
