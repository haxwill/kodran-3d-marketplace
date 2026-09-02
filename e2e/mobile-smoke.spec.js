import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive Smoke Suite', () => {
  test('should render properly on mobile viewport without horizontal scrolling', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Verify navbar is visible
    await expect(page.locator('nav')).toBeVisible();

    // Verify hamburger button exists and opens menu
    const hamburgerBtn = page.locator('nav button:has(svg.lucide-menu)');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();
    await page.waitForTimeout(400);

    // Verify mobile drawer items are visible
    const mobileDrawer = page.locator('div.lg\\:hidden');
    await expect(mobileDrawer.first()).toBeVisible();

    // Close menu by clicking X
    const closeMenuBtn = page.locator('nav button:has(svg.lucide-x)');
    await closeMenuBtn.click();
    await page.waitForTimeout(300);

    // Check no horizontal scrollbar on body
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin for subpixel precision
  });
});
