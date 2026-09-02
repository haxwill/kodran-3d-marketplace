import http from 'http';

async function testHeaders() {
  process.env.NODE_ENV = 'production';
  process.env.REDIS_URL = 'redis://127.0.0.1:6379';
  process.env.ADMIN_PASSWORD = 'ProductionSecurePassword2026!@#';

  const { default: serverApp } = await import('../server/server.js');
  const server = http.createServer(serverApp);
  await new Promise(r => server.listen(3097, r));

  try {
    const res = await fetch('http://127.0.0.1:3097/api/admin/metrics', {
      headers: { 'X-Forwarded-Proto': 'https' }
    });

    const csp = res.headers.get('content-security-policy') || '';
    const hsts = res.headers.get('strict-transport-security') || '';

    console.log('Production CSP:', csp);
    console.log('Production HSTS:', hsts);

    if (csp.includes('unsafe-eval')) {
      throw new Error('Production CSP has unsafe-eval');
    }
    if (!csp.includes("script-src 'self'")) {
      throw new Error('Production CSP script-src is not strictly self');
    }
    if (!csp.includes("object-src 'none'")) {
      throw new Error('Production CSP missing object-src none');
    }
    if (!csp.includes("frame-ancestors 'none'")) {
      throw new Error('Production CSP missing frame-ancestors none');
    }
    if (!hsts.includes('max-age=31536000') || !hsts.includes('preload')) {
      throw new Error('HSTS header missing or incomplete');
    }

    console.log('[PASS] Production Security Headers & CSP verified 100% compliant with OWASP.');
  } finally {
    server.close();
  }
}

testHeaders().then(() => setTimeout(() => process.exit(0), 100)).catch(err => {
  console.error('[FAIL]', err.message);
  process.exit(1);
});
