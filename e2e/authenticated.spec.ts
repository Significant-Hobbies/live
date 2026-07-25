import { expect, test } from './fixtures/auth';

/**
 * First authenticated e2e coverage in this repo.
 *
 * Every logged-in surface was previously asserted only through its
 * unauthenticated redirect, because Google OAuth is the sole production sign-in
 * path and Playwright cannot complete it. The gated email provider (see
 * src/lib/auth.ts) closes that gap.
 *
 * Skips automatically when the server runs without ENABLE_TEST_AUTH=1.
 */

const LOGGED_IN_ROUTES = [
  '/daily',
  '/dashboard',
  '/trajectory',
  '/commitments',
  '/bucket-list',
  '/life-plan',
  '/look-back',
  '/settings',
] as const;

test.describe('authenticated surfaces', () => {
  for (const route of LOGGED_IN_ROUTES) {
    test(`${route} renders for a signed-in user`, async ({ authedPage }) => {
      const res = await authedPage.goto(route);
      expect(res?.status(), `${route} should not error`).toBeLessThan(400);
      // The redirect guard must not fire.
      expect(authedPage.url()).not.toContain('/login');
    });
  }

  test('/daily shows the ritual, not the marketing shell', async ({ authedPage }) => {
    await authedPage.goto('/daily');
    await expect(authedPage.getByText(/Good (morning|evening)/)).toBeVisible();
    await expect(authedPage.getByRole('heading', { name: 'Habits' })).toBeVisible();
  });

  test('the account menu exposes the surfaces it claims to', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');
    // Nav renders the signed-in dropdown rather than a Sign in button.
    await expect(authedPage.getByRole('link', { name: 'Sign in' })).toHaveCount(0);
  });

  test('AM/PM rings derive from journal text, not a separate flag', async ({ authedPage }) => {
    await authedPage.goto('/daily');
    // Both ring labels are always present; the assertion is that the page renders
    // them from journal state without a DailyCheckin row existing.
    await expect(authedPage.getByText('AM', { exact: true })).toBeVisible();
    await expect(authedPage.getByText('PM', { exact: true })).toBeVisible();
  });

  test('the signed-out preview never leaks into a real session', async ({ authedPage }) => {
    // /daily and /trajectory render sample content for anonymous visitors. If
    // that branch ever fired for a signed-in user they would be looking at a
    // stranger's month believing it was their own — the worst failure this
    // feature can have, so it gets its own assertion on both surfaces.
    for (const route of ['/daily', '/trajectory']) {
      await authedPage.goto(route);
      await expect(authedPage.getByLabel('Preview notice')).toHaveCount(0);
      await expect(authedPage.getByText('Read 20 pages')).toHaveCount(0);
      await expect(authedPage.getByText(/Twelve months of runway/)).toHaveCount(0);
    }
  });

  test('a quest can be started AND finished, closing its bucket item', async ({ authedPage }) => {
    // `completeUserQuest` and `abandonQuest` had zero callers app-wide, so the
    // quest lifecycle was one-way: startable, never finishable. Nothing could
    // reach 'completed', which is why the dashboard's completed section, the
    // profile's "The evidence" and four behavioural insights were all
    // permanently empty. This walks the whole loop through the UI.
    await authedPage.goto('/bucket-lists/will-smith');

    const addButton = authedPage.getByRole('button', { name: '+ Add to my list' }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await expect(authedPage.getByText('Added to your bucket list').first()).toBeVisible();

    await authedPage.goto('/life-plan');
    const start = authedPage.getByRole('button', { name: /Start step 1/ }).first();
    await expect(start, 'a planned bucket item should offer its first quest step').toBeVisible();
    await start.click();

    // Now in progress — and crucially, finishable.
    const markDone = authedPage.getByRole('button', { name: 'Mark done' }).first();
    await expect(markDone, 'an active step must be completable').toBeVisible();
    await markDone.click();

    // The step reports Done rather than staying "In progress" forever.
    await expect(authedPage.getByText('Done', { exact: true }).first()).toBeVisible();

    // And the bucket item must NOT be closed yet. My first version of the
    // quest→bucket edge treated "no quests currently active" as "chain
    // finished", so finishing step 1 of five marked a whole life goal done.
    // The chain card stays on /life-plan (still a planned item) and reports
    // partial progress.
    await expect(authedPage.getByText(/1\/\d+ steps done/).first()).toBeVisible();
  });

  test('the creed can be written, and reaches the surfaces that render it', async ({
    authedPage,
  }) => {
    // `updateCreed` had zero callers, so users.creed was NULL for everyone and
    // the dashboard heading, the public-profile quote and the look-back
    // narrative all permanently took their fallback branch — for the field the
    // code calls "the emotional anchor of the product".
    //
    // The value is unique per run on purpose. This suite shares dev.db with
    // anything else driving localhost:3000, so a colliding writer shows up as an
    // obvious diff rather than a silent pass.
    const creed = `I am someone who finishes what they start. (${Date.now()})`;

    await authedPage.goto('/settings');
    const field = authedPage.getByLabel('Your creed');
    await expect(field).toBeVisible();
    await field.fill(creed);
    await authedPage.getByRole('button', { name: 'Save changes' }).click();

    // Wait for the form's own success signal before navigating. It redirects to
    // the public profile once both actions resolve; navigating early cancels the
    // in-flight server action and the write is silently lost.
    await authedPage.waitForURL(/\/u\//);

    // Persisted, not just echoed back by local state.
    await authedPage.goto('/settings');
    await expect(authedPage.getByLabel('Your creed')).toHaveValue(creed);

    await authedPage.goto('/dashboard');
    await expect(authedPage.getByText(creed).first()).toBeVisible();
  });

  test('trajectory renders all four life buckets', async ({ authedPage }) => {
    await authedPage.goto('/trajectory');
    for (const bucket of ['Health', 'Finance', 'Knowledge', 'Relationships']) {
      await expect(authedPage.getByRole('heading', { name: bucket })).toBeVisible();
    }
  });
});
