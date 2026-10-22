import { expect, test } from '@playwright/test';

test('homepage shows personal interests without professional technology claims', async ({
  page,
}) => {
  await page.goto('/');

  const chips = page.locator('.stack-group .stack-tag');
  const interests = [
    'Tokusatsu',
    'Anime',
    'Video games',
    'Collectibles',
    'Internet finds',
    'Creative projects',
    'Small experiments',
  ];
  await expect(chips).toHaveCount(interests.length);
  for (const interest of interests) {
    await expect(chips.filter({ hasText: interest })).toHaveCount(1);
  }
  await expect(chips.filter({ hasText: 'Laravel' })).toHaveCount(0);
  await expect(page.locator('.credential-spotlight')).toHaveCount(0);
});

test('credential archive has an honest empty state', async ({ page }) => {
  await page.goto('/credentials');
  await expect(
    page.getByRole('heading', { name: 'Credentials' }),
  ).toBeVisible();
  await expect(page.locator('.credential-row')).toHaveCount(0);
  await expect(page.locator('.empty-state')).toHaveText(
    'No public credentials yet.',
  );
});

test('interests and empty credential archive fit mobile viewports', async ({
  page,
}) => {
  for (const route of ['/', '/credentials']) {
    await page.goto(route);
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});

test('theme switching continues to apply all appearance modes', async ({
  page,
}) => {
  await page.goto('/');
  const toggle = page
    .locator('button[aria-label^="Current theme:"]:visible')
    .first();
  await page.waitForFunction(() => {
    const button = document.querySelector(
      'button[aria-label^="Current theme:"]',
    );
    return button && !button.closest('astro-island')?.hasAttribute('ssr');
  });
  for (const theme of ['dark', 'light', 'dim']) {
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await toggle.click();
  }
});
