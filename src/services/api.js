/**
 * KODRAN.DEV — Enterprise API Service & Client Adapter
 * All administrative actions use server-side authentication with HttpOnly cookies.
 */

const API_BASE_URL = '/api';

export const ApiService = {
  // 1. ADMIN AUTHENTICATION (SERVER-SIDE WITH HTTPONLY SESSION COOKIES)

  /**
   * Performs server-side bcrypt authentication and establishes HttpOnly session cookie
   */
  async adminLogin(identifierOrEmail, password = '') {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: identifierOrEmail,
        password: password
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.error || 'Giriş bilgileri geçersiz.');
      error.status = res.status;
      error.remainingSec = data.remainingSec;
      throw error;
    }

    return data;
  },

  /**
   * Destroys server-side session and clears HttpOnly cookie
   */
  async adminLogout() {
    try {
      await fetch(`${API_BASE_URL}/auth/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    return { success: true };
  },

  /**
   * Verifies current session directly with the backend
   */
  async getAdminSession() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/session`, {
        credentials: 'include'
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return { authenticated: false };
  },

  /**
   * Updates administrator password server-side with bcrypt hashing
   */
  async updateAdminCredentials(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/credentials`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Şifre güncellenemedi.');
    }
    return data;
  },

  // 2. PROTECTED ADMIN DATA (SERVER-SIDE AUTHORIZED)

  async getAdminMetrics() {
    const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async getAdminLeads() {
    const res = await fetch(`${API_BASE_URL}/admin/leads`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async getAdminLicenses() {
    const res = await fetch(`${API_BASE_URL}/admin/licenses`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async generateAdminLicense(licenseData) {
    const res = await fetch(`${API_BASE_URL}/admin/licenses`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(licenseData)
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async getAdminSecurity() {
    const res = await fetch(`${API_BASE_URL}/admin/security`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async updateAdminSecurity(settings) {
    const res = await fetch(`${API_BASE_URL}/admin/security`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  // 3. PUBLIC INQUIRY
  async submitLead(leadData) {
    const res = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    return await res.json();
  }
};
