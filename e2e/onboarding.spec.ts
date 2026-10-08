import { expect, test } from '@playwright/test';

// The old biography flow is now a compatibility doorway to the real list.
test('the former onboarding URL opens the list without a questionnaire', async ({ page }) => {
  await page.goto('/onboarding');
  await expect(page).toHaveURL(/\/bucket-list$/);
  await expect(page.getByLabel('I want to…')).toBeVisible();
  await expect(page.getByText('When were you born?')).toHaveCount(0);
});
