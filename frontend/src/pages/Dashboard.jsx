import Sidebar from '../components/Sidebar';
import FeatureCard from '../components/FeatureCard';
import ProductivityWidget from '../components/ProductivityWidget';
import { useEffect, useState } from 'react';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import '../styles/dashboard.css';

/**
 * Main dashboard page with Quick AI Tools, Recent Activity, and Productivity Stats.
 */
function Dashboard() {
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    setTimeout(() => {
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserName(user.firstName);
      }
      setIsLoading(false);
    }, 300);
  }, []);

  const quickTools = [
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/writing-tool-icon.dim_64x64.png',
      title: 'AI Writing Assistant',
      description: 'Enhance your writing with intelligent suggestions.',
      color: '#a855f7'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/grammar-icon.dim_64x64.png',
      title: 'Grammar Checker',
      description: 'Detect and fix grammar mistakes instantly.',
      color: '#ec4899'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/paraphrase-icon.dim_64x64.png',
      title: 'Paraphrasing Tool',
      description: 'Rewrite content while maintaining meaning.',
      color: '#8b5cf6'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/summary-icon.dim_64x64.png',
      title: 'Text Summarizer',
      description: 'Generate concise summaries instantly.',
      color: '#d946ef'
    }
  ];

  const recentActivity = [
    {
      tool: 'Grammar Checker',
      time: '2 hours ago',
      status: 'Completed',
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/grammar-icon.dim_64x64.png'
    },
    {
      tool: 'Paraphrasing Tool',
      time: '5 hours ago',
      status: 'Completed',
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/paraphrase-icon.dim_64x64.png'
    },
    {
      tool: 'Text Summarizer',
      time: 'Yesterday',
      status: 'Completed',
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/summary-icon.dim_64x64.png'
    },
    {
      tool: 'Tone Analyzer',
      time: '2 days ago',
      status: 'Completed',
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/tone-icon.dim_64x64.png'
    }
  ];

  if (isLoading) {
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

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {userName}! 👋</h1>
          <p className="dashboard-subtitle">Ready to create amazing content with Nova AI?</p>
        </div>

        <div className="dashboard-content">
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Quick AI Tools</h2>
              <p className="section-description">Your most frequently used tools</p>
            </div>
            <div className="dashboard-grid">
              {quickTools.map((tool, index) => (
                <FeatureCard
                  key={index}
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  color={tool.color}
                />
              ))}
            </div>
          </section>

          <div className="dashboard-row">
            <section className="dashboard-section activity-section">
              <div className="section-header">
                <h2 className="section-title">
                  <FiClock className="section-icon" />
                  Recent Activity
                </h2>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
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

          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <FiTrendingUp className="section-icon" />
                Performance Overview
              </h2>
            </div>
            <div className="performance-grid">
              <div className="performance-card">
                <h3 className="performance-number">24</h3>
                <p className="performance-label">Tools Used This Week</p>
                <div className="performance-trend positive">+12% from last week</div>
              </div>
              <div className="performance-card">
                <h3 className="performance-number">15.4K</h3>
                <p className="performance-label">Words Processed</p>
                <div className="performance-trend positive">+28% from last week</div>
              </div>
              <div className="performance-card">
                <h3 className="performance-number">8</h3>
                <p className="performance-label">Days Active</p>
                <div className="performance-trend neutral">Same as last week</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
