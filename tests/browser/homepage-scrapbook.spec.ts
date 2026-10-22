import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const themes = ['light', 'dim', 'dark'] as const;
const widths = [320, 375, 768, 1024, 1366, 1920];

for (const theme of themes) {
  test(`${theme} scrapbook homepage keeps its bento layout and reading order`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme,
    );
    await page.goto('/');

    const introduction = page.locator('#introduction');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(introduction.locator('h1')).toHaveText(
      'gamon ballz of fire🔥',
    );
    await expect(introduction.locator('.hero-summary')).toBeVisible();
    await expect(introduction.locator('.hero-site-label')).toHaveCount(0);
    await expect(introduction.locator('.hero-greeting')).toHaveCount(0);
    await expect(
      introduction.getByRole('link', { name: 'About' }),
    ).toHaveAttribute('href', '#about');
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('.stack-group')).toHaveCount(4);
    const portrait = page.locator('.hero-portrait-image');
    await expect(portrait).toHaveAttribute(
      'src',
      '/images/gamon-elio-portrait.jpeg',
    );
    await expect(page.locator('.hero-portrait-filename')).toHaveText(
      'Gamon/Elio Sawada',
    );
    await expect
      .poll(() =>
        portrait.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);

    const typography = await page.evaluate(() => ({
      heading: getComputedStyle(document.querySelector('h1')!).fontFamily,
      summary: getComputedStyle(document.querySelector('.hero-summary')!)
        .fontFamily,
    }));
    expect(typography.heading).toContain('Space Mono');
    expect(typography.summary).toContain('Lora');

    await mkdir('test-results/phase05', { recursive: true });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expect(introduction.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${theme} homepage overflows at ${width}px`,
      ).toBeLessThanOrEqual(width);
      expect(
        await page
          .locator('.hero-portrait-filename')
          .evaluate((caption) => caption.scrollWidth <= caption.clientWidth),
        `${theme} portrait caption clips at ${width}px`,
      ).toBe(true);
      if (width === 375 || width === 1366) {
        await page.screenshot({
          path: `test-results/phase05/home-${theme}-${width}.png`,
          fullPage: true,
        });
      }
      if (width === 1366) {
        expect(
          await page
            .locator('.homepage-grid')
            .evaluate(
              (element) =>
                getComputedStyle(element).gridTemplateColumns.split(' ').length,
            ),
        ).toBe(12);
      }
    }
  });
}

test('homepage editor stays protected', async ({ page }) => {
  await page.goto('/user/homepage');
  await expect(page).toHaveURL(/\/user\/login/);
});
