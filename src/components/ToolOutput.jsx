import LoadingSpinner from './LoadingSpinner';
import CharacterCounter from './CharacterCounter';

/**
 * Reusable result output panel used by all 12 tool pages.
 * Shows loading state, error state, or the AI result.
 */
function ToolOutput({ result, isLoading, error }) {
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
      return (
        <>
          <div className="tool-output-text">{result}</div>
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
        {isLoading && <span className="tool-output-indicator">Processing...</span>}
      </div>
      <div className="tool-output-body">{renderContent()}</div>
    </div>
  );
}

export default ToolOutput;
