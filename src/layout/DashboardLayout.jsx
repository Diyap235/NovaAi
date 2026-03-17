import Sidebar from '../components/Sidebar';

/**
 * Shared layout wrapper for all dashboard pages.
 * Eliminates the repeated dashboard-layout + Sidebar + dashboard-main boilerplate.
 */
function DashboardLayout({ title, subtitle, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {(title || subtitle) && (
          <div className="dashboard-header">
            {title && <h1 className="dashboard-title">{title}</h1>}
            {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
