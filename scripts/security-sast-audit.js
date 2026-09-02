/**
 * KODRAN.DEV — Static Application Security Testing (SAST) & Secret Scanner
 */

import fs from 'fs';
import path from 'path';

const REPO_ROOT = process.cwd();
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', '.system_generated', 'test-results']);

const SECRET_PATTERNS = [
  { id: 'SEC-001', name: 'Private Key Block', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/, severity: 'CRITICAL' },
  { id: 'SEC-002', name: 'AWS Access Key', regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/, severity: 'CRITICAL' },
  { id: 'SEC-003', name: 'Generic Hardcoded Secret/Token', regex: /(?:secret|token|apikey|api_key|password)\s*[:=]\s*['"`][A-Za-z0-9_\-.~!@#$%^&*]{16,}['"`]/i, severity: 'HIGH' },
  { id: 'SEC-004', name: 'Legacy Admin PIN Pattern', regex: /\b8888\b/, severity: 'HIGH' },
  { id: 'SEC-005', name: 'Client Exposed Admin Secret', regex: /VITE_ADMIN_PIN/, severity: 'CRITICAL' },
  { id: 'SEC-006', name: 'Frontend Verification Function', regex: /verifyAdminCredentials/, severity: 'HIGH' }
];

const CODE_VULN_PATTERNS = [
  { id: 'VULN-001', name: 'Use of eval()', regex: /\beval\s*\(/, severity: 'CRITICAL' },
  { id: 'VULN-002', name: 'Dynamic Function Constructor', regex: /new\s+Function\s*\(/, severity: 'HIGH' },
  { id: 'VULN-003', name: 'dangerouslySetInnerHTML', regex: /dangerouslySetInnerHTML/, severity: 'HIGH' },
  { id: 'VULN-004', name: 'Insecure Crypto Random for Security', regex: /Math\.random\(\).*?(?:token|session|key|secret)/i, severity: 'MEDIUM' },
  { id: 'VULN-005', name: 'DOM XSS via document.write', regex: /document\.write\s*\(/, severity: 'CRITICAL' },
  { id: 'VULN-006', name: 'Dangerous javascript: URI', regex: /href\s*=\s*['"`]javascript:/i, severity: 'MEDIUM' },
  { id: 'VULN-007', name: 'Prototype Pollution Vector', regex: /__proto__|constructor\s*\[\s*['"`]prototype['"`]\s*\]/, severity: 'HIGH' },
  { id: 'VULN-008', name: 'Auth Token in LocalStorage', regex: /localStorage\.setItem\s*\(\s*['"`](?:admin_token|auth_token|token|session|jwt)['"`]/i, severity: 'HIGH' }
];

const findings = [];

function scanFile(filePath) {
  const relPath = path.relative(REPO_ROOT, filePath);
  // Skip test files and audit scripts themselves from code vuln reporting
  const isTestOrScript = relPath.startsWith('e2e') || relPath.startsWith('scripts') || relPath.includes('.spec.') || relPath.includes('.test.');
  
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  const lines = content.split('\n');

  // 1. Secrets Scan (exclude .env.example)
  if (!relPath.endsWith('.env.example')) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const p of SECRET_PATTERNS) {
        if (p.regex.test(line)) {
          // If in a test asserting absence (e.g. not.toContain), skip
          if (isTestOrScript && (line.includes('not.toContain') || line.includes('Audit completed') || line.includes('targets') || line.includes('regex:'))) {
            continue;
          }
          // If in .env with placeholder or test env
          if (relPath === '.env' && p.id === 'SEC-003') {
            continue; // Normal local environment file
          }
          findings.push({
            ruleId: p.id,
            name: p.name,
            severity: p.severity,
            file: relPath,
            line: i + 1,
            snippet: line.trim().slice(0, 100),
            isFalsePositive: false
          });
        }
      }
    }
  }

  // 2. Code Vulnerability Patterns
  if (!isTestOrScript && (relPath.endsWith('.js') || relPath.endsWith('.jsx') || relPath.endsWith('.html'))) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const p of CODE_VULN_PATTERNS) {
        if (p.regex.test(line)) {
          findings.push({
            ruleId: p.id,
            name: p.name,
            severity: p.severity,
            file: relPath,
            line: i + 1,
            snippet: line.trim().slice(0, 100),
            isFalsePositive: false
          });
        }
      }
    }
  }
}

function traverse(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      traverse(fullPath);
    } else {
      scanFile(fullPath);
    }
  }
}

console.log('🔍 [SAST & SECRET SCAN] Scanning codebase...');
traverse(REPO_ROOT);

console.log(`\nScan Completed. Total Findings: ${findings.length}`);
console.log(JSON.stringify(findings, null, 2));

const summary = {
  total: findings.length,
  critical: findings.filter(f => f.severity === 'CRITICAL').length,
  high: findings.filter(f => f.severity === 'HIGH').length,
  medium: findings.filter(f => f.severity === 'MEDIUM').length,
  low: findings.filter(f => f.severity === 'LOW').length,
  findings
};

fs.writeFileSync(path.join(REPO_ROOT, '.system_generated/sast_report.json'), JSON.stringify(summary, null, 2));
