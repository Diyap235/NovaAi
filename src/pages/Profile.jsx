import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiSave, FiX, FiShield, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { getMemberDays, formatLastActive } from '../utils/dateUtils';
import '../styles/dashboard.css';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, changePassword, logout } = useAuth();

  // ── Edit profile state ─────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name:  currentUser?.name  ?? '',
    email: currentUser?.email ?? '',
  });
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Change password state ──────────────────────────────────────────────────
  const [showPwSection, setShowPwSection] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const flash = (setter, text, type, ms = 4000) => {
    setter({ text, type });
    setTimeout(() => setter({ text: '', type: '' }), ms);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const res = await updateProfile(editForm);
    setProfileLoading(false);
    if (res.success) {
      setIsEditing(false);
      flash(setProfileMsg, 'Profile updated successfully.', 'success');
    } else {
      flash(setProfileMsg, res.error || 'Update failed.', 'error');
    }
  }, [editForm, updateProfile]);

  const handleCancel = useCallback(() => {
    setEditForm({ name: currentUser?.name ?? '', email: currentUser?.email ?? '' });
    setIsEditing(false);
  }, [currentUser]);

  const handlePwChange = useCallback((e) => {
    const { name, value } = e.target;
    setPwForm((p) => ({ ...p, [name]: value }));
  }, []);

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      flash(setPwMsg, 'New passwords do not match.', 'error');
      return;
    }
    if (pwForm.next.length < 6) {
      flash(setPwMsg, 'New password must be at least 6 characters.', 'error');
      return;
    }
    setPwLoading(true);
    const res = await changePassword(pwForm.current, pwForm.next);
    setPwLoading(false);
    if (res.success) {
      setPwForm({ current: '', next: '', confirm: '' });
      setShowPwSection(false);
      flash(setPwMsg, 'Password changed successfully.', 'success');
    } else {
      flash(setPwMsg, res.error || 'Failed to change password.', 'error');
    }
  }, [pwForm, changePassword]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  if (!currentUser) return <LoadingSpinner />;

  const stats      = currentUser.stats ?? { toolsUsed: 0, wordsProcessed: 0 };
  const initial    = (currentUser.name ?? currentUser.firstName ?? 'U').charAt(0).toUpperCase();
  const memberDays = getMemberDays(currentUser.createdAt);
  const lastActive = formatLastActive(currentUser.stats?.lastActive, currentUser.createdAt);
  const displayName = currentUser.name ?? `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim();

  const msgStyle = (type) => ({
    background: type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
    border: `1px solid var(--color-${type === 'success' ? 'success' : 'error'})`,
    color: `var(--color-${type === 'success' ? 'success' : 'error'})`,
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--border-radius-sm)',
    fontWeight: 500,
    fontSize: '0.9rem',
  });

  const pwInput = (label, name, placeholder) => (
    <div className="profile-form-group">
      <label className="profile-form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPw[name] ? 'text' : 'password'}
          name={name}
          value={pwForm[name]}
          onChange={handlePwChange}
          placeholder={placeholder}
          className="profile-form-input"
          style={{ paddingRight: '2.75rem', width: '100%' }}
          required
        />
        <button
          type="button"
          onClick={() => setShowPw((p) => ({ ...p, [name]: !p[name] }))}
          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          aria-label={showPw[name] ? 'Hide password' : 'Show password'}
        >
          {showPw[name] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Account Settings" subtitle="Manage your profile and preferences">

      {/* Profile Overview */}
      <div className="profile-overview-card">
        <div className="profile-overview-left">
          <div className="profile-avatar-large">
            <span className="avatar-initial">{initial}</span>
          </div>
          <div className="profile-overview-info">
            <h2 className="profile-display-name">{displayName}</h2>
            <p className="profile-email-text">{currentUser.email}</p>
            <p className="profile-meta">Member for {memberDays} days · Last active {lastActive}</p>
            <span className="profile-plan-badge">{currentUser.role === 'admin' ? 'Admin' : 'Free Plan'}</span>
          </div>
        </div>
        <div className="profile-overview-actions">
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)} className="profile-btn profile-btn-primary">
                <FiEdit2 /> Edit Profile
              </button>
              <button onClick={handleLogout} className="profile-btn profile-btn-outline">Logout</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="profile-btn profile-btn-primary" disabled={profileLoading}>
                <FiSave /> {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={handleCancel} className="profile-btn profile-btn-outline">
                <FiX /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {profileMsg.text && <div style={msgStyle(profileMsg.type)} role="status">{profileMsg.text}</div>}

      {/* Edit Form */}
      {isEditing && (
        <div className="profile-section-card">
          <h3 className="profile-section-title">Personal Information</h3>
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="profile-form-group">
              <label htmlFor="name" className="profile-form-label">Full Name</label>
              <input id="name" name="name" type="text" value={editForm.name}
                onChange={handleChange} className="profile-form-input" required />
            </div>
            <div className="profile-form-group">
              <label htmlFor="email" className="profile-form-label">Email Address</label>
              <input id="email" name="email" type="email" value={editForm.email}
                onChange={handleChange} className="profile-form-input" required />
            </div>
          </form>
        </div>
      )}

      {/* Usage Stats */}
      <div className="profile-section-card">
        <h3 className="profile-section-title">Usage Statistics</h3>
        <p className="profile-section-desc">Your Nova AI activity overview</p>
        <div className="profile-stats-grid">
          <div className="profile-stat-item">
            <span className="profile-stat-value">{stats.toolsUsed?.toLocaleString() ?? '0'}</span>
            <span className="profile-stat-label">Tools Used</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-value">{stats.wordsProcessed?.toLocaleString() ?? '0'}</span>
            <span className="profile-stat-label">Words Processed</span>
          </div>
          <div className="profile-stat-item">
            <span className="profile-stat-value">{memberDays}</span>
            <span className="profile-stat-label">Days Active</span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="profile-section-card">
        <h3 className="profile-section-title"><FiShield className="profile-section-icon" /> Security</h3>

        {pwMsg.text && <div style={{ ...msgStyle(pwMsg.type), marginBottom: '1rem' }} role="status">{pwMsg.text}</div>}

        <div className="profile-setting-item">
          <span className="profile-setting-label">Password</span>
          <span className="profile-setting-value">••••••••</span>
          <button
            className="profile-setting-action"
            onClick={() => setShowPwSection((p) => !p)}
          >
            {showPwSection ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPwSection && (
          <form onSubmit={handleChangePassword} className="profile-edit-form" style={{ marginTop: '1.5rem' }}>
            {pwInput('Current Password', 'current', 'Enter current password')}
            {pwInput('New Password', 'next', 'At least 6 characters')}
            {pwInput('Confirm New Password', 'confirm', 'Repeat new password')}
            <div>
              <button
                type="submit"
                className="profile-btn profile-btn-primary"
                disabled={pwLoading}
                style={{ marginTop: '0.5rem' }}
              >
                <FiLock /> {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        <div className="profile-setting-item">
          <span className="profile-setting-label">Two-Factor Auth</span>
          <span className="profile-setting-value">Not enabled</span>
          <button className="profile-setting-action" disabled>Enable (Coming Soon)</button>
        </div>
      </div>

    </DashboardLayout>
  );
}

export default Profile;
