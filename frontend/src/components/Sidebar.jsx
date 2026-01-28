import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTool, FiClock, FiUser, FiLogOut } from 'react-icons/fi';

/**
 * Sidebar navigation component for dashboard pages.
 */
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/dashboard/tools', icon: FiTool, label: 'Tools' },
    { path: '/dashboard/history', icon: FiClock, label: 'History' },
    { path: '/dashboard/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/src/assets/nova-ai-logo-elegant.png" alt="Nova AI" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout} className="sidebar-link sidebar-logout">
          <FiLogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
