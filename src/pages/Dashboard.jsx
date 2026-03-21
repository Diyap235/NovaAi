import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiZap } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { ALL_TOOLS } from '../constants/tools';
import { apiGetDrafts } from '../services/api';
import { getHistory } from '../utils/history';
import { getMemberDays } from '../utils/dateUtils';
import '../styles/dashboard.css';

// Icon map for recent activity — keyed by toolName
const TOOL_ICON = Object.fromEntries(ALL_TOOLS.map((t) => [t.title, t.icon]));

function Dashboard() {
  const { currentUser } = useAuth();
  const [recentDrafts, setRecentDrafts] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  // Fetch last 5 saved drafts for Recent Activity
  useEffect(() => {
    apiGetDrafts({ page: 1, limit: 5 })
      .then((res) => setRecentDrafts(res.data?.drafts ?? []))
      .catch(() => {
        // Fall back to localStorage history
        const local = getHistory().slice(0, 5).map((h) => ({
          _id: h.id,
          toolName: h.tool,
          createdAt: h.createdAt,
        }));
        setRecentDrafts(local);
      })
      .finally(() => setActivityLoading(false));
  }, []);

  const stats   = currentUser?.stats ?? { toolsUsed: 0, wordsProcessed: 0 };
  const name    = currentUser?.name ?? currentUser?.firstName ?? 'there';
  const days    = getMemberDays(currentUser?.createdAt);

  const performanceCards = useMemo(() => [
    { number: stats.toolsUsed?.toLocaleString() ?? '0',        label: 'Total Tools Used' },
    { number: stats.wordsProcessed?.toLocaleString() ?? '0',   label: 'Words Processed' },
    { number: days,                                             label: 'Days as Member' },
  ], [stats, days]);

  if (!currentUser) return <LoadingSpinner />;

  return (
    <DashboardLayout
      title={`Welcome back, ${name}`}
      subtitle="Your AI-powered academic writing toolkit"
    >
      {/* All 12 Tools */}
      <section>
        <div className="section-header">
          <h2 className="section-title"><FiZap className="section-icon" /> All Tools</h2>
          <p className="section-description">Click any tool to get started</p>
        </div>
        <div className="tools-grid">
          {ALL_TOOLS.map((tool) => (
            <Link key={tool.id} to={tool.path} className="tool-card" style={{ '--card-color': tool.color, textDecoration: 'none' }}>
              <div className="tool-icon">
                <img src={tool.icon} alt={tool.title} />
              </div>
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
              <span className="tool-button">Open Tool</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Activity + Performance row */}
      <div className="dashboard-row">

        {/* Recent Activity — real data */}
        <section className="activity-section">
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            <FiClock className="section-icon" /> Recent Activity
          </h2>
          {activityLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <LoadingSpinner />
            </div>
          ) : recentDrafts.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No activity yet. Use a tool and save your result to see it here.
            </p>
          ) : (
            <div className="activity-list">
              {recentDrafts.map((draft) => (
                <div key={draft._id ?? draft.id} className="activity-item">
                  <div className="activity-icon">
                    {TOOL_ICON[draft.toolName] && (
                      <img src={TOOL_ICON[draft.toolName]} alt={draft.toolName} />
                    )}
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-tool">{draft.toolName}</h4>
                    <p className="activity-time">
                      {new Date(draft.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="activity-status">Saved</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Performance — real stats */}
        <section className="stats-section">
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            <FiTrendingUp className="section-icon" /> Your Stats
          </h2>
          <div className="stats-grid">
            {performanceCards.map((card) => (
              <div key={card.label} className="stat-item">
                <span className="profile-stat-value">{card.number}</span>
                <span className="profile-stat-label">{card.label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
