import Sidebar from './Sidebar';

/**
 * Full-page loading state used inside dashboard layout.
 * Pass `withSidebar={false}` for auth pages.
 */
function LoadingSpinner({ withSidebar = true }) {
  if (!withSidebar) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      </main>
    </div>
  );
}

export default LoadingSpinner;
