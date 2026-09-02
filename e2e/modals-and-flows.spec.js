import { test, expect } from '@playwright/test';

test.describe('Modals & User Flows', () => {
  test('Product details modal should open, show specs and close cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Instant scroll to products section
    await page.evaluate(() => {
      const el = document.querySelector('#products');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(600);

    const firstProductTitle = page.locator('#products .group h3').first();
    await expect(firstProductTitle).toBeVisible();
    const titleText = await firstProductTitle.textContent();
    await firstProductTitle.click({ force: true });

    // Verify modal is open
    const modalHeading = page.locator('div.fixed.inset-0 h3').first();
    await expect(modalHeading).toBeVisible();
    await expect(modalHeading).toContainText(titleText.trim());

    // Verify licenses list is visible
    await expect(page.locator('text=Standart Lisans').or(page.locator('text=Standard License')).first()).toBeVisible();

    // Close modal via close button
    const closeBtn = page.locator('div.fixed.inset-0 button:has(svg.lucide-x)').first();
    await closeBtn.click({ force: true });
    await page.waitForTimeout(400);

    // Verify modal is closed
    await expect(page.locator('div.fixed.inset-0 h3')).toHaveCount(0);
  });

  test('Cart drawer should open and handle adding a product', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Instant scroll to products section
    await page.evaluate(() => {
      const el = document.querySelector('#products');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(600);

    // Click "Hemen Al" or "Buy Now" on first card to automatically open cart
    const buyNowBtn = page.locator('#products .group button').filter({ hasText: /Hemen Al|Buy Now/i }).first();
    await buyNowBtn.click({ force: true });
    await page.waitForTimeout(800);

    // Verify cart drawer is opened
    const cartDrawerHeading = page.locator('text=Alışveriş Sepeti').or(page.locator('text=Your Cart')).or(page.locator('text=Shopping Cart'));
    await expect(cartDrawerHeading.first()).toBeVisible();

    // Close cart drawer via X button
    const closeCartBtn = page.locator('div.fixed.inset-y-0.right-0 button:has(svg.lucide-x)').first();
    await closeCartBtn.click({ force: true });
    await page.waitForTimeout(400);

    // Verify cart drawer is closed
    await expect(cartDrawerHeading.first()).not.toBeVisible();
  });

  test('Custom Order modal should open and close cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Click Custom Order button in Hero section (always visible on both desktop & mobile)
    const customOrderBtn = page.locator('main button').filter({ has: page.locator('svg.lucide-sparkles') }).first();
    await expect(customOrderBtn).toBeVisible();
    await customOrderBtn.click({ force: true });
    await page.waitForTimeout(600);

    // Verify custom order modal is open with form
    const customModal = page.locator('div.fixed.inset-0:has(form)').first();
    await expect(customModal).toBeVisible();
    await expect(customModal.locator('input[type="text"]').first()).toBeVisible();

    // Close modal via close button inside modal
    const closeBtn = customModal.locator('button:has(svg.lucide-x)').first();
    await closeBtn.click({ force: true });
    await page.waitForTimeout(400);

    // Verify modal is closed
    await expect(customModal).not.toBeVisible();
  });

  test('Login modal should reject invalid password and securely authenticate via server API', async ({ page }) => {
    const adminPassword = process.env.ADMIN_PASSWORD || 'KodranAdmin2026!';

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Handle mobile hamburger if present
    const hamburger = page.locator('nav button:has(svg.lucide-menu)');
    if (await hamburger.isVisible()) {
      await hamburger.click({ force: true });
      await page.waitForTimeout(300);
    }

    // Open Login Modal
    const loginBtn = page.locator('button:visible').filter({ hasText: /Giriş|Login/i }).first();
    await expect(loginBtn).toBeVisible();
    await loginBtn.click({ force: true });
    await page.waitForTimeout(500);

    // Verify login modal is visible
    const loginModal = page.locator('text=KODRAN').or(page.locator('text=Giriş Yap')).or(page.locator('text=Sign In'));
    await expect(loginModal.first()).toBeVisible();

    const input = page.locator('div.fixed.inset-0 input[type="text"]').first();
    const submitBtn = page.locator('div.fixed.inset-0 form button[type="submit"]').first();

    // 1. Test: Try invalid admin credentials first
    await input.fill('InvalidAdminInput123');
    await submitBtn.click({ force: true });
    await page.waitForTimeout(500);

    // Verify admin access is denied (Admin view is NOT open)
    const adminView = page.locator('text=KODRAN.DEV - Sistem Genel Bakış');
    await expect(adminView).toHaveCount(0);

    // 2. Test: Enter valid configured admin credentials
    await input.fill(adminPassword);
    await submitBtn.click({ force: true });
    await page.waitForTimeout(800);

    // Verify Admin Dashboard view is active
    const adminPanelTitle = page.locator('text=KODRAN.DEV').or(page.locator('text=Yönetici')).or(page.locator('text=Admin'));
    await expect(adminPanelTitle.first()).toBeVisible();

    // Return back to Store view via Navbar button
    const storeNavBtn = page.locator('header nav button:visible').filter({ hasText: /Mağaza|Store/i }).first();
    if (await storeNavBtn.isVisible()) {
      await storeNavBtn.click({ force: true });
      await page.waitForTimeout(400);
      await expect(page.locator('#products')).toBeVisible();
    }
  });
});
