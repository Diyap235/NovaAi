import { useMemo } from 'react';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import FeatureCard from '../components/FeatureCard';
import ProductivityWidget from '../components/ProductivityWidget';
import { useAuth } from '../hooks/useAuth';
import { QUICK_TOOLS, grammarIcon, paraphraseIcon, summaryIcon, toneIcon } from '../constants/tools';
import '../styles/dashboard.css';

// Static data — defined outside component to avoid recreation on every render
const RECENT_ACTIVITY = [
  { tool: 'Grammar Checker',   time: '2 hours ago', status: 'Completed', icon: grammarIcon },
  { tool: 'Paraphrasing Tool', time: '5 hours ago', status: 'Completed', icon: paraphraseIcon },
  { tool: 'Text Summarizer',   time: 'Yesterday',   status: 'Completed', icon: summaryIcon },
  { tool: 'Tone Analyzer',     time: '2 days ago',  status: 'Completed', icon: toneIcon },
];

const PERFORMANCE_STATS = [
  { number: '24',   label: 'Tools Used This Week', trend: '+12% from last week', type: 'positive' },
  { number: '15.4K', label: 'Words Processed',     trend: '+28% from last week', type: 'positive' },
  { number: '8',    label: 'Days Active',           trend: 'Same as last week',  type: 'neutral' },
];

function Dashboard() {
  const { currentUser } = useAuth();
  const userName = useMemo(() => currentUser?.firstName ?? '', [currentUser]);

  return (
    <DashboardLayout
      title={`Welcome back, ${userName}! 👋`}
      subtitle="Ready to create amazing content with Nova AI?"
    >
      {/* Quick Tools */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Quick AI Tools</h2>
          <p className="section-description">Your most frequently used tools</p>
        </div>
        <div className="dashboard-grid">
          {QUICK_TOOLS.map((tool) => (
            <FeatureCard key={tool.id} icon={tool.icon} title={tool.title} description={tool.description} color={tool.color} />
          ))}
        </div>
      </section>

      {/* Activity + Stats row */}
      <div className="dashboard-row">
        <section className="dashboard-section activity-section">
          <div className="section-header">
            <h2 className="section-title"><FiClock className="section-icon" /> Recent Activity</h2>
          </div>
          <div className="activity-list">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.tool} className="activity-item">
                <div className="activity-icon">
                  <img src={activity.icon} alt={activity.tool} />
                </div>
                <div className="activity-details">
                  <h4 className="activity-tool">{activity.tool}</h4>
                  <p className="activity-time">{activity.time}</p>
                </div>
                <span className="activity-status">{activity.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section stats-section">
          <ProductivityWidget />
        </section>
      </div>

      {/* Performance Overview */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title"><FiTrendingUp className="section-icon" /> Performance Overview</h2>
        </div>
        <div className="performance-grid">
          {PERFORMANCE_STATS.map((stat) => (
            <div key={stat.label} className="performance-card">
              <h3 className="performance-number">{stat.number}</h3>
              <p className="performance-label">{stat.label}</p>
              <div className={`performance-trend ${stat.type}`}>{stat.trend}</div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Dashboard;
