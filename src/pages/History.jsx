import { useState, useMemo, useCallback } from 'react';
import { FiSearch, FiTrash2, FiFilter } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import { getHistory, deleteHistoryItem, clearHistory } from '../utils/history';
import { ALL_TOOLS } from '../constants/tools';
import '../styles/dashboard.css';

const TOOL_NAMES = ['All', ...ALL_TOOLS.map((t) => t.title)];

function History() {
  const [history,    setHistory]    = useState(() => getHistory());
  const [search,     setSearch]     = useState('');
  const [filterTool, setFilterTool] = useState('All');

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchTool   = filterTool === 'All' || item.tool === filterTool;
      const matchSearch = search === '' ||
        item.tool.toLowerCase().includes(search.toLowerCase()) ||
        item.result.toLowerCase().includes(search.toLowerCase());
      return matchTool && matchSearch;
    });
  }, [history, search, filterTool]);

  const handleDelete = useCallback((id) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  }, []);

  const handleClearAll = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  return (
    <DashboardLayout title="Usage History" subtitle="Track your Nova AI tool usage and activity">
      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <FiSearch style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="profile-form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiFilter style={{ color: 'var(--color-text-muted)' }} />
          <select
            value={filterTool}
            onChange={(e) => setFilterTool(e.target.value)}
            className="tool-setting-select"
            style={{ minWidth: '180px' }}
          >
            {TOOL_NAMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="tool-action-btn" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
            <FiTrash2 /> Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="history-container">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            {history.length === 0 ? 'No history yet. Use a tool to get started.' : 'No results match your search.'}
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-header">
                <h3 className="history-tool">{item.tool}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className="history-status">Completed</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="tool-input-btn"
                    title="Delete entry"
                    style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="history-details">
                <div className="history-info">
                  <span className="history-label">Date</span>
                  <span className="history-value">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="history-info">
                  <span className="history-label">Time</span>
                  <span className="history-value">{new Date(item.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="history-info" style={{ gridColumn: '1 / -1' }}>
                  <span className="history-label">Result Preview</span>
                  <span className="history-value" style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {item.result.slice(0, 120)}{item.result.length > 120 ? '...' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default History;
