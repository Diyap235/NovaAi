import { useState } from 'react';
import { FiRefreshCw, FiSave, FiCheck } from 'react-icons/fi';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';

function ToolToolbar({ result, onRegenerate, onSave, toolName = 'nova-ai-result', input = '' }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="tool-toolbar">
      <CopyButton text={result} />
      <DownloadButton text={result} filename={toolName} />
      <ShareButton text={result} title={toolName} />

      <button
        onClick={() => onRegenerate()}
        className="tool-action-btn"
        title="Regenerate result"
        disabled={!result}
      >
        <FiRefreshCw />
        <span>Regenerate</span>
      </button>

      <button
        onClick={handleSave}
        className="tool-action-btn"
        title="Save to history"
        disabled={!result}
      >
        {saved ? <FiCheck style={{ color: 'var(--color-success, #22c55e)' }} /> : <FiSave />}
        <span>{saved ? 'Saved!' : 'Save'}</span>
      </button>
    </div>
  );
}

export default ToolToolbar;
