import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'KodranAdmin2026!';
const SCREENSHOTS_DIR = path.resolve(process.cwd(), '.system_generated/qa_screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function captureModals() {
  console.log('Launching browser to capture UI modals & admin screens...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // If in admin view, return to store first
  const storeBtn = page.locator('header nav button:visible').filter({ hasText: /Mağaza|Store/i }).first();
  if (await storeBtn.isVisible()) {
    await storeBtn.click();
    await page.waitForTimeout(600);
  }

  // 1. Product Details Modal
  console.log('1. Capturing Product Details Modal...');
  const inspectBtn = page.locator('#products button:visible').filter({ hasText: /İncele|Inspect/i }).first();
  if (await inspectBtn.isVisible()) {
    await inspectBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'modal_product_details.png') });
    console.log('   ✓ modal_product_details.png saved');

    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 2. Cart Drawer with coupon
  console.log('2. Capturing Cart Drawer...');
  const buyBtn = page.locator('#products button:visible').filter({ hasText: /Hemen Al|Buy Now|Sepete Ekle/i }).first();
  if (await buyBtn.isVisible()) {
    await buyBtn.click();
    await page.waitForTimeout(400);
  }
  const cartBtn = page.locator('header button:has(svg.lucide-shopping-cart), header button:has(svg.lucide-shopping-bag)').first();
  if (await cartBtn.isVisible()) {
    await cartBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'drawer_cart.png') });
    console.log('   ✓ drawer_cart.png saved');

    // Close Cart Drawer
    const closeCartBtn = page.locator('button:has(svg.lucide-x):visible').first();
    if (await closeCartBtn.isVisible()) {
      await closeCartBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 3. Custom Order Modal
  console.log('3. Capturing Custom Order Modal...');
  const customOrderBtn = page.locator('button:visible').filter({ hasText: /Özel Proje/i }).first();
  if (await customOrderBtn.isVisible()) {
    await customOrderBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'modal_custom_order.png') });
    console.log('   ✓ modal_custom_order.png saved');

    const closeOrderBtn = page.locator('div.fixed.inset-0 button:has(svg.lucide-x)').first();
    if (await closeOrderBtn.isVisible()) {
      await closeOrderBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 4. Admin Dashboard
  console.log('4. Capturing Admin Dashboard...');
  const panelBtn = page.locator('header button:has-text("Panel")').first();
  if (await panelBtn.isVisible()) {
    await panelBtn.click();
    await page.waitForTimeout(800);
  } else {
    const loginBtn = page.locator('header button:visible').filter({ hasText: /Giriş|Sign In|Login/i }).first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(400);
      const modal = page.locator('div.fixed.inset-0:has(form)').first();
      await modal.locator('input[type="text"]').first().fill('admin@kodran.dev');
      const pwd = modal.locator('input[type="password"]').first();
      if (await pwd.isVisible()) await pwd.fill(ADMIN_PASSWORD);
      await modal.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(1000);
    }
  }

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'admin_dashboard_overview.png') });
  console.log('   ✓ admin_dashboard_overview.png saved');

  // Admin Security tab
  const securityTab = page.locator('button:visible').filter({ hasText: /Güvenlik|Firewall/i }).first();
  if (await securityTab.isVisible()) {
    await securityTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'admin_dashboard_security.png') });
    console.log('   ✓ admin_dashboard_security.png saved');
  }

  await browser.close();
  console.log('🎉 All modal & dashboard screenshots captured successfully!');
}

captureModals().catch(console.error);
