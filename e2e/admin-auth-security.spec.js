import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'KodranAdmin2026!';

async function openLoginModal(page) {
  // If previously logged in, log out first to return to unauthenticated state
  const logoutBtn = page.locator('header button:visible').filter({ hasText: /Çıkış|Logout/i }).first();
  if (await logoutBtn.isVisible()) {
    await logoutBtn.click({ force: true });
    await page.waitForTimeout(400);
  }

  let loginBtn = page.locator('button:visible').filter({ hasText: /Giriş|Sign In|Login/i }).first();
  if (!await loginBtn.isVisible()) {
    const hamburger = page.locator('button:has(svg.lucide-menu), button.lg\\:hidden').first();
    if (await hamburger.isVisible()) {
      await hamburger.click({ force: true });
      await page.waitForTimeout(400);
    }
    loginBtn = page.locator('button:visible').filter({ hasText: /Giriş|Sign In|Login/i }).first();
  }
  await expect(loginBtn).toBeVisible({ timeout: 10000 });
  await loginBtn.click({ force: true });
  await page.waitForTimeout(500);

  const modal = page.locator('div.fixed.inset-0:has(form)').first();
  await expect(modal).toBeVisible({ timeout: 8000 });
  const emailInput = modal.locator('input[type="text"]').first();
  const passwordInput = modal.locator('input[type="password"]').first();
  const submitBtn = modal.locator('button[type="submit"]').first();

  return { modal, emailInput, passwordInput, submitBtn };
}

test.describe('Enterprise Admin Server-Side Authentication & Security Boundary', () => {

  test.beforeEach(async ({ request }) => {
    try {
      await request.post('/api/test/reset-rate-limit');
    } catch {}
  });

  test('A. Invalid password should be rejected with generic error and deny admin UI access', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const { emailInput, passwordInput, submitBtn } = await openLoginModal(page);

    // Fill invalid credentials
    await emailInput.fill('admin@kodran.dev');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('IncorrectPassword999!');
    }
    await submitBtn.click({ force: true });
    await page.waitForTimeout(600);

    // Verify generic error toast is displayed (does not reveal what part was incorrect)
    const errorToast = page.locator('text=Giriş bilgileri geçersiz.').or(page.locator('text=Invalid credentials.'));
    await expect(errorToast.first()).toBeVisible({ timeout: 5000 });

    // Verify Admin Dashboard is NOT rendered
    const adminOverview = page.locator('text=KODRAN.DEV - Sistem Genel Bakış');
    await expect(adminOverview).toHaveCount(0);
  });

  test('B. Valid password should establish HttpOnly session and grant Admin Dashboard access', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const { emailInput, passwordInput, submitBtn } = await openLoginModal(page);

    // Fill valid admin credentials
    await emailInput.fill('admin@kodran.dev');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(ADMIN_PASSWORD);
    } else {
      await emailInput.fill(ADMIN_PASSWORD);
    }
    await submitBtn.click({ force: true });
    await page.waitForTimeout(1000);

    // Verify Admin Dashboard is rendered
    const adminBrand = page.locator('text=KODRAN.DEV').or(page.locator('text=Sistem Genel Bakış'));
    await expect(adminBrand.first()).toBeVisible({ timeout: 8000 });

    // Verify HttpOnly session cookie was set
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'kodran_admin_session');
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(['lax', 'none']).toContain(sessionCookie?.sameSite?.toLowerCase() || 'lax');
  });

  test('C. Direct unauthenticated request to sensitive admin API endpoints must return 401 Unauthorized', async ({ request }) => {
    // Financial metrics without session cookie
    const metricsRes = await request.get('/api/admin/metrics');
    expect(metricsRes.status()).toBe(401);
    const metricsBody = await metricsRes.json();
    expect(metricsBody.error).toContain('Unauthorized');

    // Customer leads without session cookie
    const leadsRes = await request.get('/api/admin/leads');
    expect(leadsRes.status()).toBe(401);

    // License generation without session cookie
    const licRes = await request.post('/api/admin/licenses', {
      data: { client: 'Hacker', product: 'Exploit', type: 'Tam' }
    });
    expect(licRes.status()).toBe(401);
  });

  test('D. Fake client localStorage (isAdmin=true) must NOT bypass server-side authorization', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Attacker injects fake admin flags into localStorage
    await page.evaluate(() => {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('user_role', 'admin');
      localStorage.setItem('kodran_auth_user', JSON.stringify({ role: 'admin', email: 'fake@admin.com' }));
    });

    // Attacker tries to access protected backend API
    const directApiRes = await request.get('/api/admin/metrics');
    expect(directApiRes.status()).toBe(401);
  });

  test('E. Logout must destroy server session and invalidate subsequent admin API requests', async ({ request }) => {
    // 1. Perform login via API to get session cookie
    const loginRes = await request.post('/api/auth/admin/login', {
      data: { identifier: 'admin@kodran.dev', password: ADMIN_PASSWORD }
    });
    expect(loginRes.status()).toBe(200);

    // 2. Perform logout
    const logoutRes = await request.post('/api/auth/admin/logout');
    expect(logoutRes.status()).toBe(200);

    // 3. Subsequent request to protected API must fail with 401
    const postLogoutRes = await request.get('/api/admin/metrics');
    expect(postLogoutRes.status()).toBe(401);
  });

  test('F. Browser refresh preserves authenticated admin session via HttpOnly cookie', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const { emailInput, passwordInput, submitBtn } = await openLoginModal(page);

    await emailInput.fill('admin@kodran.dev');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(ADMIN_PASSWORD);
    } else {
      await emailInput.fill(ADMIN_PASSWORD);
    }
    await submitBtn.click({ force: true });
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Verify session endpoint confirms active session via HttpOnly cookie
    const sessionRes = await page.evaluate(async () => {
      const r = await fetch('/api/auth/admin/session', { credentials: 'include' });
      return await r.json();
    });

    expect(sessionRes.authenticated).toBe(true);
    expect(sessionRes.user.role).toBe('admin');
  });

  test('Security Regression: Admin secrets and VITE_ADMIN_PIN absent from client bundle', async () => {
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      const checkDir = (dir) => {
        for (const file of fs.readdirSync(dir)) {
          const full = path.join(dir, file);
          if (fs.statSync(full).isDirectory()) {
            checkDir(full);
          } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(full, 'utf8');
            expect(content).not.toContain('VITE_ADMIN_PIN');
            expect(content).not.toContain('KodranAdmin2026!');
            expect(content).not.toContain('verifyAdminCredentials');
          }
        }
      };
      checkDir(distDir);
    }
  });

  test('G. Negative CSRF Protection: Cross-origin state mutation with mismatched Origin is rejected with 403 Forbidden', async ({ request }) => {
    // 1. Perform legitimate login to obtain session cookie
    const loginRes = await request.post('/api/auth/admin/login', {
      data: { identifier: 'admin@kodran.dev', password: ADMIN_PASSWORD }
    });
    expect(loginRes.status()).toBe(200);

    // 2. Attempt cross-origin mutation with hostile Origin header
    const crossOriginRes = await request.post('/api/admin/licenses', {
      headers: {
        'Origin': 'https://evil-hacker-site.com'
      },
      data: { client: 'Cross-Site Exploit', product: 'Exploit', type: 'Tam' }
    });
    expect(crossOriginRes.status()).toBe(403);
    const body = await crossOriginRes.json();
    expect(body.error).toContain('Cross-origin');
  });

  test('H. Server-side Input Validation: Incomplete lead submissions rejected with 400 Bad Request', async ({ request }) => {
    // Missing contact and name
    const invalidLeadRes = await request.post('/api/leads', {
      data: { details: 'Only details, missing name and contact' }
    });
    expect(invalidLeadRes.status()).toBe(400);
    const body = await invalidLeadRes.json();
    expect(body.error).toContain('zorunludur');

    // Valid lead succeeds
    const validLeadRes = await request.post('/api/leads', {
      data: { name: 'Test Kurumsal', contact: 'test@kurumsal.com', details: 'Valid request' }
    });
    expect(validLeadRes.status()).toBe(201);
  });

  test('I. Modern HTTP Security Headers Verification', async ({ request }) => {
    const res = await request.get('/');
    const headers = res.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-xss-protection']).toBe('0');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-powered-by']).toBeUndefined();
  });

});
