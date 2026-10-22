import { expect, test } from '@playwright/test';

test('homepage has no original owner résumé or contact action', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Resume' })).toHaveCount(0);
  await expect(page.locator('#resume-preview-dialog')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Email' })).toHaveCount(0);
  await expect(
    page
      .locator('#introduction .actions')
      .getByRole('link', { name: 'Projects' }),
  ).toHaveAttribute('href', '/projects');
  await expect(
    page
      .locator('#introduction .actions')
      .getByRole('link', { name: 'Journal' }),
  ).toHaveAttribute('href', '/blog');
});

test('approved portrait and caption represent the current identity', async ({
  page,
}) => {
  await page.goto('/');

  const introduction = page.locator('#introduction');
  await expect(introduction.getByRole('heading', { level: 1 })).toHaveText(
    'gamon ballz of fire🔥',
  );
  await expect(introduction.locator('.hero-portrait-image')).toHaveAttribute(
    'src',
    '/images/gamon-elio-portrait.jpeg',
  );
  await expect(introduction.locator('.hero-portrait-filename')).toHaveText(
    'Gamon/Elio Sawada',
  );
  await expect(introduction).not.toContainText('Angellie Marcos');
});

test('personal homepage remains within mobile viewports', async ({ page }) => {
  await page.goto('/');
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 740 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});
