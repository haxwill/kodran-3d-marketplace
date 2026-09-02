import Redis from 'ioredis';

const SESSION_TTL_SEC = 24 * 60 * 60; // 24 hours
const LOCKOUT_SEC = 5 * 60; // 5 minutes
const MAX_FAILED_ATTEMPTS = 5;

class SessionManager {
  constructor() {
    this.redis = null;
    this.isRedisReady = false;
    this.localSessions = new Map();
    this.localRateLimits = new Map();

    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 2000,
          enableReadyCheck: true,
          lazyConnect: true,
          retryStrategy: (times) => {
            if (times > 3) return null;
            return Math.min(times * 500, 2000);
          }
        });

        this.redis.on('connect', () => {
          this.isRedisReady = true;
          console.log('[REDIS] Connected to distributed session store.');
        });

        this.redis.on('error', (err) => {
          this.isRedisReady = false;
          if (process.env.NODE_ENV === 'production') {
            console.error('[REDIS ERROR] Distributed store unreachable in production:', err.message);
          }
        });

        this.redis.connect().catch(() => {
          this.isRedisReady = false;
        });
      } catch (err) {
        this.isRedisReady = false;
      }
    }
  }

  async setSession(sessionId, sessionData) {
    if (this.isRedisReady && this.redis) {
      await this.redis.setex('sess:' + sessionId, SESSION_TTL_SEC, JSON.stringify(sessionData));
      return;
    }
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[FATAL SECURITY] Redis session store unavailable in production (Fail-Closed).');
    }
    this.localSessions.set(sessionId, {
      ...sessionData,
      expiresAt: Date.now() + SESSION_TTL_SEC * 1000
    });
  }

  async getSession(sessionId) {
    if (this.isRedisReady && this.redis) {
      const data = await this.redis.get('sess:' + sessionId);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    if (process.env.NODE_ENV === 'production') {
      // In production, NEVER fall back to in-memory sessions
      return null;
    }
    const session = this.localSessions.get(sessionId);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.localSessions.delete(sessionId);
      return null;
    }
    return session;
  }

  async deleteSession(sessionId) {
    if (this.isRedisReady && this.redis) {
      await this.redis.del('sess:' + sessionId);
    }
    this.localSessions.delete(sessionId);
  }

  async deleteAllSessions() {
    if (this.isRedisReady && this.redis) {
      const keys = await this.redis.keys('sess:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
    this.localSessions.clear();
  }

  async checkRateLimit(key) {
    const now = Date.now();
    if (this.isRedisReady && this.redis) {
      const lockedUntil = await this.redis.get('lock:' + key);
      if (lockedUntil && now < Number(lockedUntil)) {
        return { locked: true, remainingSec: Math.ceil((Number(lockedUntil) - now) / 1000) };
      }
      return { locked: false };
    }

    if (process.env.NODE_ENV === 'production') {
      // In production without ready Redis, lock out requests (Fail-Closed)
      return { locked: true, remainingSec: 60 };
    }

    const record = this.localRateLimits.get(key);
    if (record && record.lockedUntil && now < record.lockedUntil) {
      return { locked: true, remainingSec: Math.ceil((record.lockedUntil - now) / 1000) };
    }
    if (record && record.lockedUntil && now >= record.lockedUntil) {
      this.localRateLimits.delete(key);
    }
    return { locked: false };
  }

  async recordFailedAttempt(key) {
    const now = Date.now();
    if (this.isRedisReady && this.redis) {
      const attempts = await this.redis.incr('fail:' + key);
      if (attempts === 1) {
        await this.redis.expire('fail:' + key, LOCKOUT_SEC);
      }
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = now + LOCKOUT_SEC * 1000;
        await this.redis.setex('lock:' + key, LOCKOUT_SEC, lockedUntil.toString());
      }
      return;
    }

    const record = this.localRateLimits.get(key) || { attempts: 0, lockedUntil: 0 };
    record.attempts += 1;
    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_SEC * 1000;
    }
    this.localRateLimits.set(key, record);
  }

  async resetRateLimit(key) {
    if (this.isRedisReady && this.redis) {
      await this.redis.del('fail:' + key, 'lock:' + key);
    }
    this.localRateLimits.delete(key);
  }

  async clearAllRateLimits() {
    if (this.isRedisReady && this.redis) {
      const keys = await this.redis.keys('fail:*');
      const lockKeys = await this.redis.keys('lock:*');
      const all = [...keys, ...lockKeys];
      if (all.length > 0) await this.redis.del(...all);
    }
    this.localRateLimits.clear();
  }
}

export const sessionManager = new SessionManager();
