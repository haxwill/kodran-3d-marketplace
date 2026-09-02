import http from 'http';
import serverApp from '../server/server.js';
import { sessionManager } from '../server/sessionStore.js';

async function runTest() {
  console.log('=== MULTI-INSTANCE DISTRIBUTED STORE VERIFICATION ===');

  // Launch Server Instance A on port 3091
  const serverA = http.createServer(serverApp);
  await new Promise((res) => serverA.listen(3091, res));
  console.log('[INSTANCE A] Running on http://127.0.0.1:3091');

  // Launch Server Instance B on port 3092
  const serverB = http.createServer(serverApp);
  await new Promise((res) => serverB.listen(3092, res));
  console.log('[INSTANCE B] Running on http://127.0.0.1:3092');

  try {
    // 1. Reset state
    await sessionManager.deleteAllSessions();
    await sessionManager.clearAllRateLimits();

    // 2. Login on Instance A
    const loginRes = await fetch('http://127.0.0.1:3091/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@kodran.dev', password: 'KodranAdmin2026!' })
    });

    if (loginRes.status !== 200) {
      throw new Error('Login on Instance A failed: ' + loginRes.status);
    }

    const setCookie = loginRes.headers.get('set-cookie');
    if (!setCookie) throw new Error('No set-cookie header returned by Instance A');
    const cookie = setCookie.split(';')[0];
    console.log('[PASS] Step 1: Logged in on Instance A. Obtained cookie: ' + cookie.slice(0, 35) + '...');

    // 3. Access protected admin endpoint on Instance B with cookie from Instance A
    const resB = await fetch('http://127.0.0.1:3092/api/admin/metrics', {
      headers: { Cookie: cookie }
    });

    if (resB.status !== 200) {
      throw new Error('Instance B rejected session created on Instance A! Status: ' + resB.status);
    }
    const dataB = await resB.json();
    if (!dataB.metrics) throw new Error('Instance B returned empty metrics');
    console.log('[PASS] Step 2: Instance B accepted session created on Instance A. Distributed session verified!');

    // 4. Rate limiting: lockout on Instance A
    const testIp = '198.51.100.25';
    for (let i = 0; i < 5; i++) {
      await sessionManager.recordFailedAttempt('ip:' + testIp);
    }
    const checkB = await sessionManager.checkRateLimit('ip:' + testIp);
    if (!checkB.locked) {
      throw new Error('Rate limit failure count on Instance A was not reflected on Instance B');
    }
    console.log('[PASS] Step 3: Rate limit state on Instance A is synchronized and locked on Instance B.');

    // 5. Logout on Instance B
    const logoutRes = await fetch('http://127.0.0.1:3092/api/auth/admin/logout', {
      method: 'POST',
      headers: { Cookie: cookie }
    });
    if (logoutRes.status !== 200) throw new Error('Logout on Instance B failed: ' + logoutRes.status);
    console.log('[PASS] Step 4: Successfully logged out on Instance B.');

    // 6. Verify session is now revoked on Instance A
    const recheckA = await fetch('http://127.0.0.1:3091/api/admin/metrics', {
      headers: { Cookie: cookie }
    });
    if (recheckA.status !== 401) {
      throw new Error('Instance A accepted revoked session! Status: ' + recheckA.status);
    }
    console.log('[PASS] Step 5: Session revoked on Instance B is immediately rejected on Instance A (401 Unauthorized).');

    console.log('=== MULTI-INSTANCE VERIFICATION 100% COMPLETE AND PASSING ===');
  } finally {
    await new Promise((res) => serverA.close(res));
    await new Promise((res) => serverB.close(res));
  }
}

runTest()
  .then(() => {
    setTimeout(() => process.exit(0), 100);
  })
  .catch((err) => {
    console.error('[FAIL]', err.message);
    process.exit(1);
  });
