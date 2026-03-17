import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { ALL_TOOLS } from '../constants/tools';
import '../styles/dashboard.css';

function Tools() {
  const navigate = useNavigate();

  return (
    <DashboardLayout
      title="AI Writing Tools"
      subtitle="Explore our comprehensive suite of AI-powered writing tools"
    >
      <div className="tools-grid">
        {ALL_TOOLS.map((tool) => (
          <div key={tool.id} className="tool-card" style={{ '--card-color': tool.color }}>
            <div className="tool-icon">
              <img src={tool.icon} alt={tool.title} />
            </div>
            <div className="tool-content">
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-description">{tool.description}</p>
              <button className="tool-button" onClick={() => navigate(tool.path)}>
                Launch Tool
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default Tools;
