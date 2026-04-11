import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import CharacterCounter from './CharacterCounter';

/**
 * Reusable result output panel used by all 12 tool pages.
 * Supports side-by-side comparison when `originalInput` prop is provided.
 */
function ToolOutput({ result, isLoading, error, originalInput = '' }) {
  const [compareMode, setCompareMode] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="tool-output-loading">
          <LoadingSpinner withSidebar={false} />
          <p className="tool-output-loading-text">AI is processing your text...</p>
        </div>
      );
    }
    if (error) {
      return <div className="tool-output-error" role="alert">{error}</div>;
    }
    if (result) {
      if (compareMode && originalInput) {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>ORIGINAL</p>
              <div className="tool-output-text" style={{ background: 'rgba(239,68,68,0.05)', borderRadius: '8px', padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {originalInput}
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>RESULT</p>
              <div className="tool-output-text" style={{ background: 'rgba(168,85,247,0.05)', borderRadius: '8px', padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {result}
              </div>
            </div>
          </div>
        );
      }
      return (
        <>
          <div className="tool-output-text" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</div>
          <div className="tool-output-footer">
            <CharacterCounter text={result} />
          </div>
        </>
      );
    }
    return (
      <div className="tool-output-placeholder">
        <p>Your result will appear here after processing.</p>
      </div>
    );
  };

  return (
    <div className="tool-output-wrapper">
      <div className="tool-output-header">
        <span className="tool-output-label">Result</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {result && originalInput && (
            <button
              onClick={() => setCompareMode((p) => !p)}
              className="tool-input-btn"
              style={compareMode ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
            >
              {compareMode ? 'Result Only' : 'Compare'}
            </button>
          )}
          {isLoading && <span className="tool-output-indicator">Processing...</span>}
        </div>
      </div>
      <div className="tool-output-body">{renderContent()}</div>
    </div>
  );
}

export default ToolOutput;
