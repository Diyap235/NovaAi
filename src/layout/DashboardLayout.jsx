import { useState, useCallback } from 'react';
import Sidebar, { HamburgerButton } from '../components/Sidebar';

function DashboardLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="dashboard-main">
        {/* Top bar with hamburger — visible on mobile, hidden on desktop */}
        <div className="dashboard-topbar">
          <HamburgerButton isOpen={sidebarOpen} onClick={openSidebar} />
          {title && <span className="dashboard-topbar-title">{title}</span>}
        </div>

        {(title || subtitle) && (
          <div className="dashboard-header">
            {title    && <h1 className="dashboard-title">{title}</h1>}
            {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
