import { useState, useEffect, useCallback } from 'react';
import { apiLogin, apiSignup, apiGetProfile, apiUpdateProfile, apiChangePassword } from '../services/api';

/**
 * Central auth hook — syncs with backend on mount, persists token in localStorage.
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

  // Re-fetch fresh profile from backend whenever a token exists
  useEffect(() => {
    if (!currentUser?.token) return;
    apiGetProfile()
      .then((res) => {
        const fresh = { ...res.data.user, token: currentUser.token };
        localStorage.setItem('currentUser', JSON.stringify(fresh));
        setCurrentUser(fresh);
      })
      .catch(() => {
        // Token expired or invalid — log out silently
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin(email, password);
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

  // ── Update profile — hits backend, syncs localStorage ─────────────────────
  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await apiUpdateProfile(updates);
      const updated = { ...currentUser, ...res.data.user };
      persist(updated);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update profile.' };
    }
  }, [currentUser, persist]);

  // ── Change password — hits backend ────────────────────────────────────────
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await apiChangePassword(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to change password.' };
    }
  }, []);

  // ── Refresh stats from backend (call after saving a draft) ──────────────
  const refreshStats = useCallback(async () => {
    if (!currentUser?.token) return;
    try {
      const res = await apiGetProfile();
      const fresh = { ...currentUser, ...res.data.user, token: currentUser.token };
      localStorage.setItem('currentUser', JSON.stringify(fresh));
      setCurrentUser(fresh);
    } catch {
      // silently ignore
    }
  }, [currentUser]);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }, []);

  return { currentUser, login, signup, updateProfile, changePassword, logout, refreshStats };
}
