# KODRAN.DEV Security Policy & Architecture

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Vulnerability Reporting

If you discover a security vulnerability within KODRAN.DEV, please report it responsibly:
- **Security Contact**: security@kodran.dev
- **Response SLA**: Initial triage within 24–48 hours.
- Please do not submit public GitHub issues for unpatched vulnerabilities.

## Enterprise Security Architecture

1. **Authentication Boundary**:
   - Authentication is strictly authoritative on the server (`server/server.js`).
   - Passwords are hashed using `bcryptjs` with Cost 12 rounds (~375ms verification time).
   - Session tokens are generated with 256-bit cryptographically secure entropy (`crypto.randomBytes(32)`).
   - Session fixation defense: Session ID rotation is strictly enforced upon successful login.
   - All active sessions are invalidated immediately upon administrator credential changes.

2. **Distributed Session & Rate Limiting (Multi-Instance Ready)**:
   - Built on `server/sessionStore.js` with `ioredis` support.
   - Horizontal scaling: Session state and brute-force counters synchronize across server replicas via Redis.
   - Fail-Closed: In production, session verification fails closed if the centralized Redis store becomes unavailable.

3. **Cookie Security**:
   - `HttpOnly: true` (Prevents client JavaScript theft via XSS).
   - `Secure: true` in production (Transmitted exclusively over TLS/HTTPS).
   - `SameSite: Lax` (Mitigates cross-site request forgery).
   - `Path: /`.
   - `__Host-` prefix enforced in production environments.

4. **CSRF & Request Integrity**:
   - State-changing administrative endpoints enforce `verifySameOrigin` checking request `Origin` against `Host`.
   - Incoming JSON payload body size is capped at 50 KB to mitigate resource exhaustion / DoS attacks.
   - Malformed JSON errors are caught and sanitized without exposing framework stack traces.

5. **HTTP Security Headers & Modern CSP**:
   - `X-Frame-Options: DENY` & `frame-ancestors 'none'` (Clickjacking defense).
   - `X-Content-Type-Options: nosniff` (MIME confusion defense).
   - `X-XSS-Protection: 0` (Modern OWASP recommendation to eliminate legacy auditor bypass vulnerabilities).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Content-Security-Policy`: Dynamic environment-aware policy prohibiting `'unsafe-eval'` and `'unsafe-inline'` in production.
   - Conditional `Strict-Transport-Security` (HSTS) applied over HTTPS connections.
   - Server identification removed (`app.disable('x-powered-by')`).
