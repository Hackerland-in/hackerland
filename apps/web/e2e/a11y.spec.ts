import { expect, test } from '@playwright/test';

test.describe('a11y and shell', () => {
  test('first Tab on / focuses Skip to content link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const focusedText = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.textContent?.trim() : null;
    });

    expect(focusedText).toBe('Skip to content');
  });

  test('unknown project slug returns 404 and displays signal lost heading', async ({ page }) => {
    const response = await page.goto('/projects/does-not-exist');
    expect(response?.status()).toBe(404);

    const heading = page.locator('h1', { hasText: 'Signal lost: page not found' });
    await expect(heading).toBeVisible();
  });

  test('at 390px mobile viewport, bottom nav is visible and header main nav is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' });
    await expect(mobileNav).toBeVisible();

    const mainNav = page.getByRole('navigation', { name: 'Main Navigation' });
    await expect(mainNav).toBeHidden();
  });
});
