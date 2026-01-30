import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

/**
 * History page displaying user's past tool usage.
 */
function History() {
  const historyData = [
    {
      tool: 'Grammar Checker',
      date: '2025-01-28',
      time: '10:30 AM',
      status: 'Completed',
      wordsProcessed: 1250
    },
    {
      tool: 'Paraphrasing Tool',
      date: '2025-01-27',
      time: '3:45 PM',
      status: 'Completed',
      wordsProcessed: 890
    },
    {
      tool: 'Text Summarizer',
      date: '2025-01-27',
      time: '11:20 AM',
      status: 'Completed',
      wordsProcessed: 2340
    },
    {
      tool: 'Tone Analyzer',
      date: '2025-01-26',
      time: '4:15 PM',
      status: 'Completed',
      wordsProcessed: 1560
    },
    {
      tool: 'Plagiarism Detector',
      date: '2025-01-26',
      time: '9:00 AM',
      status: 'Completed',
      wordsProcessed: 3200
    },
    {
      tool: 'Citation Generator',
      date: '2025-01-25',
      time: '2:30 PM',
      status: 'Completed',
      wordsProcessed: 450
    },
    {
      tool: 'Word Choice Enhancer',
      date: '2025-01-25',
      time: '10:45 AM',
      status: 'Completed',
      wordsProcessed: 980
    },
    {
      tool: 'Readability Score',
      date: '2025-01-24',
      time: '5:20 PM',
      status: 'Completed',
      wordsProcessed: 1780
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Usage History</h1>
          <p className="dashboard-subtitle">Track your Nova AI tool usage and activity</p>
        </div>

        <div className="dashboard-content">
          <div className="history-container">
            {historyData.map((item, index) => (
              <div key={index} className="history-card">
                <div className="history-header">
                  <h3 className="history-tool">{item.tool}</h3>
                  <span className="history-status">{item.status}</span>
                </div>
                <div className="history-details">
                  <div className="history-info">
                    <span className="history-label">Date:</span>
                    <span className="history-value">{item.date}</span>
                  </div>
                  <div className="history-info">
                    <span className="history-label">Time:</span>
                    <span className="history-value">{item.time}</span>
                  </div>
                  <div className="history-info">
                    <span className="history-label">Words Processed:</span>
                    <span className="history-value">{item.wordsProcessed.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default History;
