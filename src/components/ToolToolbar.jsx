import { FiRefreshCw, FiSave } from 'react-icons/fi';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';

/**
 * Action toolbar rendered below every tool result panel.
 * Props:
 *   result      — the output text (enables/disables buttons)
 *   onRegenerate — callback to re-run the AI call
 *   onSave       — callback to save result to history
 *   toolName     — used as the download filename
 */
function ToolToolbar({ result, onRegenerate, onSave, toolName = 'nova-ai-result' }) {
  return (
    <div className="tool-toolbar">
      <CopyButton text={result} />
      <DownloadButton text={result} filename={toolName} />
      <ShareButton text={result} title={toolName} />

      <button
        onClick={onRegenerate}
        className="tool-action-btn"
        title="Regenerate result"
      >
        <FiRefreshCw />
        <span>Regenerate</span>
      </button>

      <button
        onClick={onSave}
        className="tool-action-btn"
        title="Save to history"
        disabled={!result}
      >
        <FiSave />
        <span>Save</span>
      </button>
    </div>
  );
}

export default ToolToolbar;
