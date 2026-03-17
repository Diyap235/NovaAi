import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiSave, FiX, FiShield, FiBell } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { getMemberDays, formatLastActive } from '../utils/dateUtils';
import '../styles/dashboard.css';

function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName:  currentUser?.lastName  ?? '',
    email:     currentUser?.email     ?? '',
  });
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback((e) => {
    e.preventDefault();
    const result = updateProfile(editForm);
    if (result.success) {
      setIsEditing(false);
      setSaveMessage('Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  }, [editForm, updateProfile]);

  const handleCancel = useCallback(() => {
    setEditForm({
      firstName: currentUser?.firstName ?? '',
      lastName:  currentUser?.lastName  ?? '',
      email:     currentUser?.email     ?? '',
    });
    setIsEditing(false);
  }, [currentUser]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  if (!currentUser) return <LoadingSpinner />;

  const stats    = currentUser.stats ?? { toolsUsed: 0, wordsProcessed: 0 };
  const initial  = currentUser.firstName?.charAt(0)?.toUpperCase() ?? 'U';
  const memberDays = getMemberDays(currentUser.createdAt);
  const lastActive = formatLastActive(currentUser.stats?.lastActive, currentUser.createdAt);

  return (
    <DashboardLayout title="Account Settings" subtitle="Manage your profile and preferences">
      {/* Profile Overview */}
      <div className="profile-overview-card">
        <div className="profile-overview-left">
          <div className="profile-avatar-large">
            <span className="avatar-initial">{initial}</span>
          </div>
          <div className="profile-overview-info">
            <h2 className="profile-display-name">{currentUser.firstName} {currentUser.lastName}</h2>
            <p className="profile-email-text">{currentUser.email}</p>
            <p className="profile-meta">Member for {memberDays} days · Last active {lastActive}</p>
            <span className="profile-plan-badge">Free Plan</span>
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
              <button onClick={handleSave} className="profile-btn profile-btn-primary">
                <FiSave /> Save Changes
              </button>
              <button onClick={handleCancel} className="profile-btn profile-btn-outline">
                <FiX /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {saveMessage && <div className="profile-save-success" role="status">{saveMessage}</div>}

      {/* Edit Form */}
      {isEditing && (
        <div className="profile-section-card">
          <h3 className="profile-section-title">Personal Information</h3>
          <form onSubmit={handleSave} className="profile-edit-form">
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="firstName" className="profile-form-label">First Name</label>
                <input id="firstName" name="firstName" type="text" value={editForm.firstName}
                  onChange={handleChange} className="profile-form-input" required />
              </div>
              <div className="profile-form-group">
                <label htmlFor="lastName" className="profile-form-label">Last Name</label>
                <input id="lastName" name="lastName" type="text" value={editForm.lastName}
                  onChange={handleChange} className="profile-form-input" required />
              </div>
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

      {/* Security + Notifications */}
      <div className="profile-sections-row">
        <div className="profile-section-card profile-section-half">
          <h3 className="profile-section-title"><FiShield className="profile-section-icon" /> Security</h3>
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
          <h3 className="profile-section-title"><FiBell className="profile-section-icon" /> Notifications</h3>
          <div className="profile-setting-item">
            <span className="profile-setting-label">Email alerts</span>
            <label className="profile-toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle email alerts" />
              <span className="profile-toggle-slider" />
            </label>
          </div>
          <div className="profile-setting-item">
            <span className="profile-setting-label">Product updates</span>
            <label className="profile-toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle product updates" />
              <span className="profile-toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
