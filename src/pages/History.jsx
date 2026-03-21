import { useState, useEffect, useMemo, useCallback } from 'react';
import { FiSearch, FiTrash2, FiFilter, FiRefreshCw } from 'react-icons/fi';
import DashboardLayout from '../layout/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { getHistory, deleteHistoryItem, clearHistory } from '../utils/history';
import { apiGetDrafts, apiDeleteDraft, apiDeleteAllDrafts } from '../services/api';
import { ALL_TOOLS } from '../constants/tools';
import '../styles/dashboard.css';

const TOOL_NAMES = ['All', ...ALL_TOOLS.map((t) => t.title)];

/**
 * Normalise a backend draft or a localStorage history item into one shape.
 */
const normalise = (item) => ({
  id:        item._id  ?? item.id,
  tool:      item.toolName ?? item.tool,
  result:    item.processedText ?? item.result ?? '',
  input:     item.originalText  ?? item.input  ?? '',
  createdAt: item.createdAt,
  source:    item._id ? 'backend' : 'local',
});

function History() {
  const [items,      setItems]      = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterTool, setFilterTool] = useState('All');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [useBackend, setUseBackend] = useState(true);

  const load = useCallback(async (p = 1) => {
    setIsLoading(true);
    try {
      const res = await apiGetDrafts({ page: p, limit: 20, ...(filterTool !== 'All' && { tool: filterTool }) });
      const drafts = (res.data?.drafts ?? []).map(normalise);
      setItems(drafts);
      setTotalPages(res.data?.pagination?.pages ?? 1);
      setPage(p);
      setUseBackend(true);
    } catch {
      // Backend unavailable — fall back to localStorage
      setUseBackend(false);
      setItems(getHistory().map(normalise));
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [filterTool]);

  useEffect(() => { load(1); }, [load]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        (item.tool ?? '').toLowerCase().includes(q) ||
        (item.result ?? '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleDelete = useCallback(async (item) => {
    if (item.source === 'backend') {
      try { await apiDeleteDraft(item.id); } catch { /* ignore */ }
    } else {
      deleteHistoryItem(item.id);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }, []);

  const handleClearAll = useCallback(async () => {
    if (useBackend) {
      try { await apiDeleteAllDrafts(); } catch { /* ignore */ }
    }
    clearHistory();
    setItems([]);
  }, [useBackend]);

  return (
    <DashboardLayout title="Usage History" subtitle="Track your Nova AI tool usage and saved drafts">

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
            onChange={(e) => { setFilterTool(e.target.value); setPage(1); }}
            className="tool-setting-select"
            style={{ minWidth: '180px' }}
          >
            {TOOL_NAMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <button onClick={() => load(page)} className="tool-action-btn" title="Refresh">
          <FiRefreshCw /> Refresh
        </button>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="tool-action-btn"
            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
          >
            <FiTrash2 /> Clear All
          </button>
        )}
      </div>

      {!useBackend && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '0.75rem 1.25rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
          Showing local history — backend unavailable or not logged in.
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="history-container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              {items.length === 0 ? 'No history yet. Use a tool and click Save to get started.' : 'No results match your search.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-header">
                  <h3 className="history-tool">{item.tool}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span className="history-status">Saved</span>
                    <button
                      onClick={() => handleDelete(item)}
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
                  {item.input && (
                    <div className="history-info" style={{ gridColumn: '1 / -1' }}>
                      <span className="history-label">Input</span>
                      <span className="history-value" style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {item.input.slice(0, 100)}{item.input.length > 100 ? '...' : ''}
                      </span>
                    </div>
                  )}
                  <div className="history-info" style={{ gridColumn: '1 / -1' }}>
                    <span className="history-label">Result Preview</span>
                    <span className="history-value" style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      {item.result.slice(0, 160)}{item.result.length > 160 ? '...' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination — backend only */}
      {useBackend && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            className="tool-action-btn"
            disabled={page <= 1}
            onClick={() => load(page - 1)}
          >
            ← Prev
          </button>
          <span style={{ padding: '0.6rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="tool-action-btn"
            disabled={page >= totalPages}
            onClick={() => load(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

    </DashboardLayout>
  );
}

export default History;
