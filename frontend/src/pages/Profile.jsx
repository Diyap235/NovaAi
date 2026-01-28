import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

/**
 * Profile page displaying user information.
 */
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const initial = user.firstName.charAt(0).toUpperCase();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Profile Settings</h1>
          <p className="dashboard-subtitle">Manage your account information</p>
        </div>

        <div className="dashboard-content">
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {initial}
                </div>
              </div>
              
              <div className="profile-info">
                <h2 className="profile-name">{user.firstName} {user.lastName}</h2>
                <p className="profile-email">{user.email}</p>
                <p className="profile-joined">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <div className="profile-actions">
                <button className="profile-button profile-button-secondary">
                  Edit Profile
                </button>
                <button onClick={handleLogout} className="profile-button profile-button-danger">
                  Logout
                </button>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <h3 className="stat-number">24</h3>
                <p className="stat-label">Tools Used</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">15,420</h3>
                <p className="stat-label">Words Processed</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-number">8</h3>
                <p className="stat-label">Days Active</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
