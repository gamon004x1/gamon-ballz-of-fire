import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const themes = ['light', 'dim', 'dark'] as const;
const themeColors = {
  light: { rgb: [226, 232, 206], hex: '#e2e8ce' },
  dim: { rgb: [65, 69, 63], hex: '#41453f' },
  dark: { rgb: [38, 38, 38], hex: '#262626' },
};

function channels(value: string): number[] {
  const match = value.match(
    /(?:rgba?|color\(srgb)\(?\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/,
  );
  if (!match) throw new Error(`Unsupported computed color: ${value}`);
  const values = match.slice(1).map(Number);
  return value.startsWith('color(') ? values.map((part) => part * 255) : values;
}

function luminance(value: string): number {
  const linear = channels(value).map((part) => {
    const channel = part / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const theme of themes) {
  test(`${theme} theme uses the approved fonts and readable surface colors`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem('theme', value),
      theme,
    );
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const appearance = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const card = getComputedStyle(document.querySelector('.hero')!);
      const aboutParagraph = getComputedStyle(
        document.querySelector('.about p')!,
      );
      const eyebrow = getComputedStyle(
        document.querySelector('.about .eyebrow')!,
      );
      const heading = getComputedStyle(document.querySelector('h1')!);
      const primary = getComputedStyle(
        document.querySelector('.variant-primary')!,
      );
      const portraitElement = document.querySelector(
        '.hero-portrait-filename',
      )!;
      const portrait = getComputedStyle(portraitElement);
      const portraitFrame = getComputedStyle(
        document.querySelector('.hero-portrait')!,
      );
      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      return {
        background: body.backgroundColor,
        foreground: body.color,
        bodyFont: body.fontFamily,
        headingFont: heading.fontFamily,
        cardBackground: card.backgroundColor,
        cardForeground: card.color,
        cardBorder: card.borderColor,
        paragraphForeground: aboutParagraph.color,
        eyebrowForeground: eyebrow.color,
        primaryBackground: primary.backgroundColor,
        primaryForeground: primary.color,
        portraitBackground: portraitFrame.backgroundColor,
        portraitForeground: portrait.color,
        meta: meta?.content,
        spaceLoaded: document.fonts.check('700 16px "Space Mono"'),
        loraLoaded: document.fonts.check('400 16px "Lora"'),
      };
    });
    expect(channels(appearance.background).map(Math.round)).toEqual(
      themeColors[theme].rgb,
    );
    expect(appearance.meta).toBe(themeColors[theme].hex);
    expect(appearance.bodyFont).toContain('Lora');
    expect(appearance.headingFont).toContain('Space Mono');
    expect(appearance.spaceLoaded).toBe(true);
    expect(appearance.loraLoaded).toBe(true);
    expect(
      contrast(appearance.foreground, appearance.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(appearance.cardForeground, appearance.cardBackground),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(appearance.paragraphForeground, appearance.cardBackground),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(appearance.eyebrowForeground, appearance.cardBackground),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(appearance.cardBorder, appearance.background),
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(appearance.primaryForeground, appearance.primaryBackground),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(appearance.portraitForeground, appearance.portraitBackground),
    ).toBeGreaterThanOrEqual(4.5);

    await mkdir('test-results/phase04', { recursive: true });
    await page.screenshot({
      path: `test-results/phase04/home-${theme}.png`,
      fullPage: true,
    });

    await page.goto('/user/login');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const login = page.locator('form');
    await expect(login).toBeVisible();
    const input = login.locator('input[name="email"]');
    await input.focus();
    const focus = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.outlineColor,
        width: style.outlineWidth,
        font: style.fontFamily,
      };
    });
    expect(focus.font).toContain('Lora');
    expect(focus.width).not.toBe('0px');
    await page.screenshot({
      path: `test-results/phase04/cms-login-${theme}.png`,
      fullPage: true,
    });
  });
}

test('theme preference persists and wide headings fit supported viewports', async ({
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
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  for (const route of ['/', '/user/login']) {
    await page.goto(route);
    for (const width of [320, 375, 768, 1024, 1366, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(
        dimensions.page,
        `${route} overflows at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport);
      if (width === 375) {
        await mkdir('test-results/phase04', { recursive: true });
        await page.screenshot({
          path: `test-results/phase04/${route === '/' ? 'home' : 'cms-login'}-mobile-light.png`,
          fullPage: true,
        });
      }
    }
  }
});
