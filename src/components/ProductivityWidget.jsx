import { FiTrendingUp, FiTarget, FiAward } from 'react-icons/fi';

/**
 * Productivity stats widget displaying user progress.
 */
function ProductivityWidget() {
  const stats = [
    { label: 'Daily Goal', value: 75, max: 100, icon: FiTarget, color: '#a855f7' },
    { label: 'Weekly Progress', value: 420, max: 500, icon: FiTrendingUp, color: '#ec4899' },
    { label: 'Achievement Score', value: 85, max: 100, icon: FiAward, color: '#8b5cf6' }
  ];

  return (
    <div className="productivity-widget">
      <h3 className="widget-title">Productivity Stats</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const percentage = (stat.value / stat.max) * 100;
          
          return (
            <div key={index} className="stat-item">
              <div className="stat-header">
                <Icon className="stat-icon" style={{ color: stat.color }} />
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      background: stat.color
                    }}
                  />
                </div>
                <span className="stat-value">{stat.value}/{stat.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductivityWidget;
