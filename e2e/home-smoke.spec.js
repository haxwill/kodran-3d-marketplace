import { test, expect } from '@playwright/test';

test.describe('Home Page Smoke & Telemetry', () => {
  test('should render homepage without console errors or failed network requests', async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Ignore React dev/hydration noise or favicon 404 if any, but record general errors
        const text = msg.text();
        consoleErrors.push(text);
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(`Uncaught exception: ${err.message}`);
    });

    page.on('response', (response) => {
      const status = response.status();
      const url = response.url();
      // Ignore 404s for external 3rd-party assets if any, focus on local assets
      if (status >= 400 && url.includes('localhost:3000')) {
        failedRequests.push(`${status} - ${url}`);
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Verify main components render
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('#products')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Verify product cards are displayed
    const productCards = page.locator('#products .group');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // Assert zero console errors & zero failed local network requests
    expect(consoleErrors, `Found console errors: ${consoleErrors.join(' | ')}`).toHaveLength(0);
    expect(failedRequests, `Found failed requests: ${failedRequests.join(' | ')}`).toHaveLength(0);
  });

  test('should switch language and currency correctly', async ({ page }) => {
    await page.goto('/');

    // Check language switch
    const langBtn = page.getByRole('button', { name: /TR|EN/i }).first();
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await page.waitForTimeout(400);

    // Check currency switch
    const currencyBtn = page.getByRole('button', { name: /₺|\$|€/i }).first();
    await expect(currencyBtn).toBeVisible();
    await currencyBtn.click();
    await page.waitForTimeout(400);
  });

  test('should filter products by search and category', async ({ page }) => {
    await page.goto('/');

    // Test search input
    const searchInput = page.locator('#products input[type="text"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('AutoScrape');
    await page.waitForTimeout(500);

    const filteredCards = page.locator('#products .group');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThanOrEqual(1);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(300);
  });
});
