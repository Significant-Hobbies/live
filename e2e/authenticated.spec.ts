import { expect, test } from './fixtures/auth';
import { waitForHydrated } from './fixtures/hydration';

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
  '/journal',
  '/habits',
  '/trajectory',
  '/commitments',
  '/bucket-list',
  '/live-more',
  '/history',
  '/settings',
] as const;

test.describe('authenticated surfaces', () => {
  // Serial, not parallel. These tests mutate one shared dev.db as the same user —
  // several add bucket items — so running them concurrently makes them read each
  // other's rows: "Start step 1" could land on another test's item, and any
  // count-based assertion drifts. Playwright defaults to fullyParallel, which is
  // right for read-only specs and wrong for this one.
  test.describe.configure({ mode: 'serial' });

  test('a new owner can create and reload a bucket list without onboarding DOB', async ({
    page,
    request,
  }) => {
    const password = 'e2e-test-password-not-a-secret';
    const email = `e2e-bucket-owner-${crypto.randomUUID()}@significanthobbies.test`;
    const signUp = await request.post('/api/auth/sign-up/email', {
      data: { email, password, name: 'Bucket Owner' },
      failOnStatusCode: false,
    });
    if (signUp.status() === 404) {
      test.skip(true, 'Test auth disabled — run the dev server with ENABLE_TEST_AUTH=1');
    }
    expect(signUp.ok(), `fresh test owner sign-up failed (${signUp.status()})`).toBeTruthy();

    const signIn = await page.request.post('/api/auth/sign-in/email', {
      data: { email, password },
      failOnStatusCode: false,
    });
    expect(signIn.ok(), `fresh test owner sign-in failed (${signIn.status()})`).toBeTruthy();

    await page.goto('/bucket-list');
    await expect(page).toHaveURL(/\/bucket-list$/);
    await expect(page.getByRole('heading', { name: 'My list' })).toBeVisible();

    await page.goto('/experiences');
    await page.getByLabel('Search everything').fill('Make pasta from scratch');
    const add = page.getByRole('button', {
      name: 'Add Make pasta from scratch to my bucket list',
      exact: true,
    });
    await waitForHydrated(add);
    await add.click();
    await expect(page.getByText('Added to your bucket list')).toBeVisible();
    await page.goto('/bucket-list');
    await page.getByRole('button', { name: 'Mark Make pasta from scratch as lived' }).click();
    await expect(
      page.getByRole('button', { name: 'Reopen Make pasta from scratch to To do' })
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Reopen Make pasta from scratch to To do' })
    ).toBeVisible();

    await page.goto('/journal');
    await page.locator('#weekly-entry').fill('Made pasta and took a long walk last week.');
    await page.getByRole('button', { name: 'Save this week', exact: true }).click();
    await expect(page.getByText('Saved.')).toBeVisible();
    await page.reload();
    await expect(page.locator('#weekly-entry')).toHaveValue(
      'Made pasta and took a long walk last week.'
    );

    await page.goto('/bucket-list/new');
    await page.getByRole('button', { name: /This month/i }).click();
    await page.getByRole('button', { name: /Keep it cozy/i }).click();
    await page.getByRole('button', { name: 'Make my Life Bingo' }).click();
    await page.getByRole('button', { name: 'Save list' }).click();

    await expect(page).toHaveURL(/\/bucket-list\/[^/]+$/);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(page.getByText('Bucket List', { exact: true }).first()).toBeVisible();
  });

  for (const route of LOGGED_IN_ROUTES) {
    test(`${route} renders for a signed-in user`, async ({ authedPage }) => {
      // Warm the route first. Under `next dev` the first request to a route pays
      // its compile, which made the suite's first authenticated hit flaky in CI.
      // The assertion should measure the response, not the bundler.
      await authedPage.goto(route).catch(() => undefined);
      const res = await authedPage.goto(route);
      expect(res?.status(), `${route} should not error`).toBeLessThan(400);
      // The redirect guard must not fire.
      expect(authedPage.url()).not.toContain('/login');
    });
  }

  test('retired routes redirect for a signed-in user', async ({ authedPage }) => {
    await authedPage.goto('/daily');
    await expect(authedPage).toHaveURL(/\/journal$/);
    await authedPage.goto('/habits');
    await expect(authedPage).toHaveURL(/\/bucket-list$/);
    await expect(authedPage.getByRole('link', { name: 'Habits', exact: true })).toHaveCount(0);
  });

  test('Live and the weekly log persist independently after the split', async ({ authedPage }) => {
    await authedPage.goto('/live-more');
    const chosenIdea = `Zorblax Quivanta walk ${crypto.randomUUID().slice(0, 8)}`;
    await authedPage.getByLabel('What do you still want to live?').fill(chosenIdea);
    const keepDream = authedPage.getByRole('button', { name: 'Keep this exact dream' });
    await waitForHydrated(keepDream);
    await keepDream.click();
    await expect(authedPage.getByText('1 dream is now in your atlas.')).toBeVisible();

    const journal = 'I noticed something new today.';
    await authedPage.goto('/journal');
    await authedPage.locator('#weekly-entry').fill(journal);
    await authedPage.getByRole('button', { name: /Save this week|Update this week/ }).click();
    await authedPage.goto('/live-more');
    await authedPage.getByLabel('What do you still want to live?').fill(chosenIdea);
    await expect(authedPage.getByRole('button', { name: 'Calling now' })).toBeVisible();

    await authedPage.goto('/journal');
    await expect(authedPage.locator('#weekly-entry')).toHaveValue(journal);
    await authedPage.goto('/live-more');
    await expect(authedPage.getByRole('heading', { name: chosenIdea, level: 1 })).toBeVisible();
  });

  test('the account menu exposes the surfaces it claims to', async ({ authedPage }) => {
    await authedPage.goto('/journal');
    // Nav renders the signed-in dropdown rather than a Sign in button.
    await expect(authedPage.getByRole('link', { name: 'Sign in' })).toHaveCount(0);
  });

  test('the weekly journal offers one entry about last week', async ({ authedPage }) => {
    await authedPage.goto('/journal');
    await expect(authedPage.locator('#weekly-entry')).toBeVisible();
    await expect(authedPage.getByRole('button', { name: 'Previous week' })).toBeVisible();
    await expect(
      authedPage.getByRole('heading', { name: /What did (this|last|that) week hold\?/ })
    ).toBeVisible();
    await expect(authedPage.getByRole('button', { name: 'Next question' })).toHaveCount(0);
    await expect(
      authedPage.getByRole('button', { name: /Save this week|Update this week/ })
    ).toBeVisible();
  });

  test('the signed-out preview never leaks into a real session', async ({ authedPage }) => {
    // Journal, Habits, and /trajectory render private data for anonymous visitors. If
    // that branch ever fired for a signed-in user they would be looking at a
    // stranger's month believing it was their own — the worst failure this
    // feature can have, so it gets its own assertion on both surfaces.
    for (const route of ['/journal', '/habits', '/trajectory']) {
      await authedPage.goto(route);
      await expect(authedPage.getByLabel('Preview notice')).toHaveCount(0);
      await expect(authedPage.getByText('Read 20 pages')).toHaveCount(0);
      await expect(authedPage.getByText(/Twelve months of runway/)).toHaveCount(0);
    }
  });

  test('manual steps persist independently of lived status', async ({ authedPage }) => {
    const title = `Sail with a friend ${crypto.randomUUID().slice(0, 8)}`;
    await authedPage.goto('/bucket-list');
    await waitForHydrated(authedPage.getByLabel('Add something you want to do'));
    await authedPage.getByLabel('Add something you want to do').fill(title);
    await authedPage.getByRole('button', { name: 'Add', exact: true }).click();
    await authedPage.getByRole('button', { name: `Open ${title}` }).click();
    const panel = authedPage
      .getByRole('complementary', { name: `Item: ${title}` })
      .filter({ visible: true });
    await panel.getByLabel('Add a step').fill('Ask a friend');
    await panel.getByRole('button', { name: 'Add', exact: true }).click();
    await panel.getByRole('checkbox', { name: 'Ask a friend' }).check();
    await expect(panel.getByRole('radio', { name: 'To do', exact: true })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await authedPage.reload();
    await authedPage.getByRole('button', { name: `Open ${title}` }).click();
    await expect(panel.getByRole('checkbox', { name: 'Ask a friend' })).toBeChecked();
    await panel.getByRole('radio', { name: 'Lived', exact: true }).click();
    await expect(
      authedPage.getByRole('button', { name: `Reopen ${title} to To do` })
    ).toBeVisible();
  });

  test('the creed can be written and remains durable', async ({ authedPage }) => {
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

    // Wait for React to actually own the textarea before typing into it.
    //
    // It is a controlled component, so a fill that lands before hydration
    // updates the DOM but never the component state; hydration then reverts it,
    // the form compares the creed against an unchanged initial prop, skips the
    // write, and still reports "Profile updated!". `toBeVisible()` only proves
    // the server HTML arrived.
    //
    // See waitForHydrated: a retry-until-it-sticks loop worked locally but timed
    // out in CI, where /settings cold-compiles under two workers.
    await waitForHydrated(field);

    await field.fill(creed);
    await expect(field).toHaveValue(creed);
    await authedPage.getByRole('button', { name: 'Save changes' }).click();

    // Wait for the form's own success signal before navigating: navigating early
    // cancels the in-flight server action and the write is silently lost.
    //
    // The toast, not the redirect. The form only pushes to /u/<username> when the
    // user has a username, which a freshly seeded database's test user does not —
    // so keying on the URL made this pass locally and hang in CI. setToast fires
    // after both updateProfile and updateCreed resolve, which is exactly the
    // condition being waited on.
    await expect(authedPage.getByText('Profile updated!')).toBeVisible();

    // Persisted, not just echoed back by local state.
    await authedPage.goto('/settings');
    await expect(authedPage.getByLabel('Your creed')).toHaveValue(creed);
  });

  test('a bucket item can be advanced, published, and deleted', async ({ authedPage }) => {
    const title = `Make a bowl ${crypto.randomUUID().slice(0, 8)}`;
    await authedPage.goto('/bucket-list');
    await waitForHydrated(authedPage.getByLabel('Add something you want to do'));
    await authedPage.getByLabel('Add something you want to do').fill(title);
    await authedPage.getByRole('button', { name: 'Add', exact: true }).click();
    await authedPage.getByRole('button', { name: `Open ${title}` }).click();
    const panel = authedPage
      .getByRole('complementary', { name: `Item: ${title}` })
      .filter({ visible: true });
    await panel.getByRole('radio', { name: 'Doing', exact: true }).click();
    await expect(panel.getByRole('radio', { name: 'Doing', exact: true })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await panel.getByLabel('Visibility').selectOption('public');
    await expect(panel.getByLabel('Visibility')).toHaveValue('public');
    await panel.getByRole('button', { name: 'Remove from list', exact: true }).click();
    await panel.getByRole('button', { name: 'Remove', exact: true }).click();
    await expect(authedPage.getByRole('button', { name: `Mark ${title} as lived` })).toHaveCount(0);
    await authedPage.reload();
    await expect(authedPage.getByRole('button', { name: `Mark ${title} as lived` })).toHaveCount(0);
  });

  test('a logged stamp shows its proof back, and never as a javascript: link', async ({
    authedPage,
  }) => {
    // Stamp.proofUrl / proofType / note were written on every stamp and rendered
    // nowhere, while the form asked outright for "Proof link" and the completion
    // copy claimed "the stamps live on your profile". The feature whose premise
    // is evidence collected it and never showed it back.
    // Unique per run, and deliberately so. dev.db persists between runs, and a
    // commitment can only be stamped once a day — reusing a fixed hobby name
    // meant the second run of any given day hit "You already have an active
    // commitment for Piano", left the create form sitting on that error, and
    // then had nothing new to stamp. A fresh commitment each run keeps the
    // write path genuinely exercised instead of asserting over yesterday's row.
    const stamp = Date.now();
    const hobby = `Piano ${stamp}`;
    const proofUrl = `https://youtube.com/watch?v=e2e${stamp}`;

    await authedPage.goto('/commitments');

    // No `if (count())` guards around the subject. They let a test skip what it
    // exists to check and still report green, which is how an earlier version
    // "passed" while stamping nothing. Each step waits for the effect of the one
    // before it — clicking a button is not the same as the action completing.
    // The creation form is collapsed behind a trigger, so the name field does
    // not exist until it is opened. The trigger's onClick only exists once
    // React has hydrated — clicking sooner is silent, the form never opens, and
    // the failure surfaces one line later as "name field not found". Retrying
    // the click is not an option: it toggles, so a second one would close it.
    const openCreate = authedPage.getByRole('button', { name: 'Start a commitment' });
    await waitForHydrated(openCreate);
    await openCreate.click();

    const nameField = authedPage.getByPlaceholder('e.g. Guitar, Running, Spanish');
    await expect(nameField).toBeVisible();
    await nameField.fill(hobby);
    await authedPage.getByRole('button', { name: 'Begin commitment' }).click();

    // Scope to this run's card: every active commitment renders its own
    // "Stamp today" button, so an unscoped locator would race the others.
    const card = authedPage.getByRole('group', { name: `${hobby} commitment` });
    await expect(card, 'the new commitment should appear').toBeVisible();

    await card.getByRole('button', { name: 'Stamp today' }).click();

    const proof = card.getByPlaceholder(/or any URL/);
    await expect(proof).toBeVisible();
    await proof.fill(proofUrl);
    await card.getByRole('button', { name: 'Stamp today' }).last().click();

    await expect(card.getByText('The evidence')).toBeVisible();

    // The proof is a real, opener-safe link — and nothing on the page is ever a
    // javascript: href, because normalizeProofUrl stores non-URL input verbatim.
    const proofLink = card.locator(`a[href="${proofUrl}"]`);
    await expect(proofLink).toBeVisible();
    await expect(proofLink).toHaveAttribute('rel', /noopener/);
    await expect(authedPage.locator('a[href^="javascript:"]')).toHaveCount(0);
  });

  test('a dream saved in Live becomes a real bucket item with a calling path', async ({
    authedPage,
  }) => {
    const dream = `Virelune Quivanta journey ${crypto.randomUUID().slice(0, 8)}`;
    await authedPage.goto('/live-more');
    await authedPage.getByLabel('What do you still want to live?').fill(dream);
    await authedPage.getByRole('button', { name: 'Keep this exact dream' }).click();
    await expect(authedPage.getByText('1 dream is now in your atlas.')).toBeVisible();

    await authedPage.goto('/bucket-list');
    await expect(authedPage.getByRole('button', { name: `Mark ${dream} as lived` })).toHaveCount(1);

    await authedPage.goto('/live-more');
    await authedPage.getByLabel('What do you still want to live?').fill(dream);
    const callForward = authedPage.getByRole('button', { name: 'Call this forward' });
    if (await callForward.isVisible()) await callForward.click();
    await expect(authedPage.getByRole('button', { name: 'Calling now' })).toBeVisible();
    await authedPage.getByRole('button', { name: 'Clear dream search' }).click();
    await expect(authedPage.getByRole('heading', { name: dream, level: 1 })).toBeVisible();
  });

  test('trajectory offers one focused contract or the existing active one', async ({
    authedPage,
  }) => {
    await authedPage.goto('/trajectory');
    const create = authedPage.getByRole('button', { name: 'Set this trajectory' });
    if (await create.count()) {
      await expect(
        authedPage.getByRole('heading', { name: 'Map the direction, not the destination.' })
      ).toBeVisible();
      await expect(authedPage.getByLabel('Trajectory map')).toBeVisible();
      await expect(authedPage.locator('textarea')).toHaveCount(1);
      await expect(authedPage.getByRole('combobox', { name: /Review rhythm/ })).toBeVisible();
    } else {
      await expect(authedPage.getByText('Current trajectory')).toBeVisible();
      await expect(
        authedPage.getByRole('button', { name: 'Review this trajectory' })
      ).toBeVisible();
    }
  });

  test('trajectory adjusts a contract atomically on D1', async ({ authedPage }) => {
    await authedPage.goto('/trajectory');
    const initialIntent = `Publish one useful artifact each week ${Date.now()}`;
    const create = authedPage.getByRole('button', { name: 'Set this trajectory' });
    if (await create.count()) {
      await authedPage
        .getByRole('textbox', { name: 'Constraints', exact: true })
        .fill('Limited weekday energy');
      await authedPage.getByRole('button', { name: 'Frame intent' }).click();
      await authedPage.getByRole('textbox', { name: 'Intent', exact: true }).fill(initialIntent);
      await authedPage.getByRole('button', { name: 'Frame decision policy' }).click();
      await authedPage
        .getByRole('textbox', { name: 'Decision policy', exact: true })
        .fill('Prefer small finished work');
      await authedPage.getByRole('button', { name: 'Frame feedback loop' }).click();
      await authedPage
        .getByRole('textbox', { name: 'Feedback loop', exact: true })
        .fill('Review friction every Sunday');
      await create.click();
      await expect(authedPage.getByText(initialIntent)).toBeVisible();
    }

    await authedPage.getByRole('button', { name: 'Review this trajectory' }).click();
    const review = authedPage
      .getByRole('heading', { name: 'What did reality tell you?' })
      .locator('xpath=ancestor::section');
    await review.getByLabel('Observed signal').fill('The weekly scope was still too large.');
    await review.getByRole('button', { name: 'Adjust' }).click();

    const revisedIntent = `Publish one useful artifact every two weeks ${Date.now()}`;
    await review.getByRole('button', { name: 'Edit intent' }).click();
    await review.getByRole('textbox', { name: 'Intent', exact: true }).fill(revisedIntent);
    await review.getByRole('button', { name: 'Save and adjust' }).click();

    await expect(authedPage.getByText(revisedIntent).first()).toBeVisible();
    await expect(authedPage.getByRole('heading', { name: 'What changed' })).toBeVisible();
  });
});
