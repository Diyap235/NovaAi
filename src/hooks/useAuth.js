import { useState, useEffect, useCallback } from 'react';
import { apiLogin, apiSignup } from '../services/api';

/**
 * Central auth hook — works with both the real backend and localStorage fallback.
 * Stores { token, ...user } in localStorage under 'currentUser'.
 */
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sync across browser tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'currentUser') {
        try { setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null); }
        catch { setCurrentUser(null); }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      // Backend returns { data: { user, token } }
      const userData = { ...res.data.user, token: res.data.token };
      persist(userData);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  }, [persist]);

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(async (firstName, lastName, email, password) => {
    try {
      const name = `${firstName} ${lastName}`.trim();
      await apiSignup(name, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Signup failed.' };
    }
  }, []);

  // ── Update profile (local only — call apiUpdateProfile separately) ─────────
  const updateProfile = useCallback((updates) => {
    try {
      const updated = { ...currentUser, ...updates };
      persist(updated);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update profile.' };
    }
  }, [currentUser, persist]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }, []);

  return { currentUser, login, signup, updateProfile, logout };
}
