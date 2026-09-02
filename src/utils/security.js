/**
 * KODRAN.DEV — Client Security & Cryptographic Protection Utilities
 * 
 * Note: Authentication is strictly server-side (server/server.js).
 * This module contains client-safe utilities for XSS sanitization,
 * license key generation/verification, and UI token masking.
 */

// 1. Strict Input Sanitizer (XSS Mitigation)
export const sanitizeInput = (val) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/[<>]/g, '') // strip tag brackets
    .replace(/javascript:/gi, '') // strip js pseudo-protocol
    .replace(/onload|onerror|onclick|eval\(|alert\(/gi, '') // strip event triggers
    .trim();
};

// 2. Cryptographically Secure License Key Generator with Checksum
export const generateCryptoLicenseKey = (prefix = 'KDR') => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Base32 unambiguous
  const getRandomChunk = (len) => {
    const array = new Uint8Array(len);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < len; i++) array[i] = Math.floor(Math.random() * 256);
    }
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars[array[i] % chars.length];
    }
    return res;
  };

  const chunk1 = getRandomChunk(4);
  const chunk2 = getRandomChunk(4);
  const chunk3 = getRandomChunk(4);
  
  // Compute check digit (checksum)
  const combined = `${chunk1}${chunk2}${chunk3}`;
  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum = (sum * 31 + combined.charCodeAt(i)) % 9999;
  }
  const checkDigit = chars[sum % chars.length] + chars[(sum >> 3) % chars.length] + chars[(sum >> 5) % chars.length] + chars[(sum >> 7) % chars.length];

  return `${prefix}-${chunk1}-${chunk2}-${chunk3}-${checkDigit}`;
};

// 3. License Key Validator
export const verifyLicenseIntegrity = (licenseKey) => {
  if (!licenseKey || typeof licenseKey !== 'string') return false;
  const parts = licenseKey.trim().split('-');
  if (parts.length !== 5 || parts[0] !== 'KDR') return false;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const combined = `${parts[1]}${parts[2]}${parts[3]}`;
  let sum = 0;
  for (let i = 0; i < combined.length; i++) {
    sum = (sum * 31 + combined.charCodeAt(i)) % 9999;
  }
  const expectedCheck = chars[sum % chars.length] + chars[(sum >> 3) % chars.length] + chars[(sum >> 5) % chars.length] + chars[(sum >> 7) % chars.length];
  return parts[4] === expectedCheck;
};

// 4. Sensitive API Key Masker (UI Presentation)
export const maskApiKey = (key) => {
  if (!key || typeof key !== 'string') return '••••••••••••••••';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 7)}••••••••••••${key.slice(-4)}`;
};
