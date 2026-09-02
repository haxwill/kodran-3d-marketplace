/**
 * KODRAN.DEV — OWASP Dynamic Application Security Testing (DAST) Scanner
 * 
 * Performs passive and active dynamic security testing on live http://localhost:3000
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';
const results = {
  testedAt: new Date().toISOString(),
  target: BASE_URL,
  findings: []
};

function addFinding(ruleId, title, severity, category, description, evidence, isFalsePositive = false) {
  results.findings.push({
    ruleId,
    title,
    severity, // CRITICAL, HIGH, MEDIUM, LOW, INFO
    category,
    description,
    evidence,
    isFalsePositive
  });
}

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runDAST() {
  console.log(`🛡️ [OWASP DAST ENGINE] Initiating Dynamic Security Assessment on ${BASE_URL}...`);

  // ========================================================
  // 1. PASSIVE DAST: Security Headers & Server Information
  // ========================================================
  console.log('\n[PASSIVE DAST] Inspecting HTTP Response Headers...');
  try {
    const rootRes = await request('/');
    const headers = rootRes.headers;

    // Check X-Content-Type-Options
    if (!headers['x-content-type-options']) {
      addFinding(
        'DAST-001',
        'Missing X-Content-Type-Options Header',
        'LOW',
        'Security Misconfiguration',
        'X-Content-Type-Options: nosniff header prevents MIME type sniffing by browsers.',
        `Current: undefined`
      );
    }

    // Check X-Frame-Options / CSP frame-ancestors
    if (!headers['x-frame-options'] && !headers['content-security-policy']?.includes('frame-ancestors')) {
      addFinding(
        'DAST-002',
        'Missing Clickjacking Protection (X-Frame-Options / CSP)',
        'MEDIUM',
        'Clickjacking',
        'Site can potentially be embedded in an iframe if X-Frame-Options or frame-ancestors is missing.',
        `Current: undefined`
      );
    }

    // Check Content-Security-Policy
    if (!headers['content-security-policy']) {
      addFinding(
        'DAST-003',
        'Missing Content-Security-Policy (CSP)',
        'MEDIUM',
        'Injection',
        'Content-Security-Policy mitigates XSS, data injection, and unauthorized script loading.',
        `Current: undefined`
      );
    }

    // Check X-Powered-By leakage
    if (headers['x-powered-by']) {
      addFinding(
        'DAST-004',
        'Information Disclosure via X-Powered-By',
        'LOW',
        'Information Disclosure',
        'X-Powered-By reveals backend server technology to potential attackers.',
        `X-Powered-By: ${headers['x-powered-by']}`
      );
    }

    // Check Referrer-Policy
    if (!headers['referrer-policy']) {
      addFinding(
        'DAST-005',
        'Missing Referrer-Policy Header',
        'LOW',
        'Information Disclosure',
        'Referrer-Policy header controls how much referrer information is sent with requests.',
        `Current: undefined`
      );
    }

  } catch (err) {
    console.error('Failed to probe root headers:', err.message);
  }

  // ========================================================
  // 2. ACTIVE DAST: Broken Authentication & Access Control
  // ========================================================
  console.log('\n[ACTIVE DAST] Testing Broken Authentication & Access Control Boundaries...');
  
  // Test A: Accessing protected endpoints unauthenticated
  const sensitiveEndpoints = [
    '/api/admin/metrics',
    '/api/admin/leads',
    '/api/admin/licenses',
    '/api/admin/security'
  ];

  for (const ep of sensitiveEndpoints) {
    const res = await request(ep);
    if (res.statusCode !== 401 && res.statusCode !== 403) {
      addFinding(
        'DAST-010',
        `Unauthorized Access to Sensitive Endpoint ${ep}`,
        'CRITICAL',
        'Broken Access Control',
        `Endpoint ${ep} returned HTTP ${res.statusCode} without authentication cookie.`,
        res.body.slice(0, 150)
      );
    }
  }

  // Test B: Tampered session token
  const tamperedRes = await request('/api/admin/metrics', {
    headers: { 'Cookie': 'kodran_admin_session=malicious_fake_token_000000000000000000000' }
  });
  if (tamperedRes.statusCode !== 401) {
    addFinding(
      'DAST-011',
      'Tampered Session Token Accepted',
      'CRITICAL',
      'Broken Authentication',
      'Server did not reject invalid forged session cookie with 401.',
      `HTTP ${tamperedRes.statusCode}`
    );
  }

  // Test C: Generic error message on invalid login (Credential Enumeration)
  const invalidLoginRes = await request('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { identifier: 'admin@kodran.dev', password: 'WrongPassword123!' }
  });
  const bodyText = invalidLoginRes.body;
  if (bodyText.includes('password incorrect') || bodyText.includes('user not found') || bodyText.includes('PIN')) {
    addFinding(
      'DAST-012',
      'Credential Enumeration in Login Response',
      'MEDIUM',
      'Information Disclosure',
      'Login response reveals specific credential details instead of a generic message.',
      bodyText
    );
  }

  // Test D: Rate limiting on login endpoint
  console.log('\n[ACTIVE DAST] Testing Brute-Force Rate Limiting on Login...');
  let hitRateLimit = false;
  for (let i = 0; i < 7; i++) {
    const r = await request('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { identifier: `attacker_${i}@exploit.com`, password: `bruteforce_${i}` }
    });
    if (r.statusCode === 429) {
      hitRateLimit = true;
      break;
    }
  }
  if (!hitRateLimit) {
    addFinding(
      'DAST-013',
      'Missing or Ineffective Rate Limiting on Admin Login',
      'HIGH',
      'Broken Authentication',
      'Multiple consecutive failed login attempts did not trigger HTTP 429 rate limit lockout.',
      'No 429 returned after 7 attempts'
    );
  }

  // Test E: Malformed JSON injection
  console.log('\n[ACTIVE DAST] Testing Malformed JSON & Error Handling...');
  const malformedRes = await request('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"broken_json": true,'
  });
  if (malformedRes.body.includes('at ') && malformedRes.body.includes('node_modules')) {
    addFinding(
      'DAST-014',
      'Stack Trace Disclosure on Malformed JSON',
      'MEDIUM',
      'Information Disclosure',
      'Server returned internal stack trace on malformed JSON body.',
      malformedRes.body.slice(0, 150)
    );
  }

  // Test F: Method Tampering on protected endpoints
  console.log('\n[ACTIVE DAST] Testing HTTP Method Tampering...');
  const traceRes = await request('/api/admin/metrics', { method: 'TRACE' });
  if (traceRes.statusCode === 200) {
    addFinding(
      'DAST-015',
      'HTTP TRACE Method Enabled',
      'MEDIUM',
      'Cross-Site Tracing (XST)',
      'HTTP TRACE method is enabled on server which can expose credentials via XST.',
      `HTTP ${traceRes.statusCode}`
    );
  }

  // Test G: CORS Misconfiguration
  console.log('\n[ACTIVE DAST] Testing CORS Policy...');
  const corsRes = await request('/api/admin/metrics', {
    headers: { 'Origin': 'https://attacker-domain.evil' }
  });
  const acao = corsRes.headers['access-control-allow-origin'];
  const acac = corsRes.headers['access-control-allow-credentials'];
  if (acao === '*' && acac === 'true') {
    addFinding(
      'DAST-016',
      'Insecure CORS Wildcard with Credentials',
      'CRITICAL',
      'Security Misconfiguration',
      'Server allows wildcard origin with credentials allowed, leading to cross-origin data theft.',
      `Access-Control-Allow-Origin: ${acao}`
    );
  }

  // ========================================================
  // DAST SUMMARY
  // ========================================================
  console.log('\n==========================================');
  console.log('🏁 OWASP DAST SCAN FINISHED');
  console.log(`Total Findings: ${results.findings.length}`);
  console.log(JSON.stringify(results.findings, null, 2));
  console.log('==========================================\n');

  return results;
}

runDAST().catch(console.error);
