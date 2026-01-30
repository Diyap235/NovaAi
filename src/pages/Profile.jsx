import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FiEdit2, FiSave, FiX, FiShield, FiBell } from 'react-icons/fi';
import '../styles/dashboard.css';

/**
 * Professional profile page with editable info, dynamic stats, and account settings.
 */
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (!parsed.stats) {
        parsed.stats = {
          toolsUsed: 0,
          wordsProcessed: 0,
          lastActive: parsed.createdAt ?? new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(parsed));
      }
      setUser(parsed);
      setEditForm({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email
      });
    }
  }, []);

  const ensureUserStats = (u) => {
    if (!u.stats) {
      return {
        ...u,
        stats: { toolsUsed: 0, wordsProcessed: 0, lastActive: u.createdAt || new Date().toISOString() }
      };
    }
    return u;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx >= 0) {
      users[idx] = { ...users[idx], ...editForm };
      localStorage.setItem('users', JSON.stringify(users));
    }

    const updatedUser = ensureUserStats({ ...user, ...editForm });
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditing(false);
    setSaveMessage('Profile updated successfully');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getMemberDays = () => {
    if (!user?.createdAt) return 0;
    const join = new Date(user.createdAt);
    const now = new Date();
    return Math.floor((now - join) / (1000 * 60 * 60 * 24));
  };

  const formatLastActive = () => {
    const last = user?.stats?.lastActive || user?.createdAt;
    if (!last) return 'Today';
    const d = new Date(last);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </main>
      </div>
    );
  }

  const stats = user.stats || { toolsUsed: 0, wordsProcessed: 0, lastActive: user.createdAt };
  const initial = user.firstName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Account Settings</h1>
          <p className="dashboard-subtitle">Manage your profile and preferences</p>
        </div>

        <div className="dashboard-content">
          {/* Profile Overview Card */}
          <div className="profile-overview-card">
            <div className="profile-overview-left">
              <div className="profile-avatar-large">
                <span className="avatar-initial">{initial}</span>
              </div>
              <div className="profile-overview-info">
                <h2 className="profile-display-name">{user.firstName} {user.lastName}</h2>
                <p className="profile-email-text">{user.email}</p>
                <p className="profile-meta">
                  Member for {getMemberDays()} days · Last active {formatLastActive()}
                </p>
                <span className="profile-plan-badge">Free Plan</span>
              </div>
            </div>
            <div className="profile-overview-actions">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="profile-btn profile-btn-primary"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                  <button onClick={handleLogout} className="profile-btn profile-btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSaveProfile} className="profile-btn profile-btn-primary">
                    <FiSave /> Save Changes
                  </button>
                  <button onClick={handleCancelEdit} className="profile-btn profile-btn-outline">
                    <FiX /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {saveMessage && (
            <div className="profile-save-success">{saveMessage}</div>
          )}

          {/* Personal Information Form (when editing) */}
          {isEditing && (
            <div className="profile-section-card">
              <h3 className="profile-section-title">Personal Information</h3>
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-form-label">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="profile-form-input"
                      required
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-form-label">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="profile-form-input"
                      required
                    />
                  </div>
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="profile-form-input"
                    required
                  />
                </div>
              </form>
            </div>
          )}

          {/* Usage Statistics */}
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
                <span className="profile-stat-value">{getMemberDays()}</span>
                <span className="profile-stat-label">Days Active</span>
              </div>
            </div>
          </div>

          {/* Account Security & Preferences */}
          <div className="profile-sections-row">
            <div className="profile-section-card profile-section-half">
              <h3 className="profile-section-title">
                <FiShield className="profile-section-icon" /> Security
              </h3>
              <div className="profile-setting-item">
                <span className="profile-setting-label">Password</span>
                <span className="profile-setting-value">••••••••</span>
                <button className="profile-setting-action" disabled>Change (Coming Soon)</button>
              </div>
              <div className="profile-setting-item">
                <span className="profile-setting-label">Two-Factor Auth</span>
                <span className="profile-setting-value">Not enabled</span>
                <button className="profile-setting-action" disabled>Enable (Coming Soon)</button>
              </div>
            </div>

            <div className="profile-section-card profile-section-half">
              <h3 className="profile-section-title">
                <FiBell className="profile-section-icon" /> Notifications
              </h3>
              <div className="profile-setting-item">
                <span className="profile-setting-label">Email alerts</span>
                <label className="profile-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="profile-toggle-slider"></span>
                </label>
              </div>
              <div className="profile-setting-item">
                <span className="profile-setting-label">Product updates</span>
                <label className="profile-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="profile-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
