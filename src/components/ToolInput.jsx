import { useCallback } from 'react';
import { FiClipboard, FiX } from 'react-icons/fi';
import CharacterCounter from './CharacterCounter';

/**
 * Reusable text input panel used by all 12 tool pages.
 * Includes paste-from-clipboard and clear-text actions.
 */
function ToolInput({ value, onChange, placeholder = 'Enter or paste your text here...', maxLength }) {
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // Clipboard read permission denied — silently ignore
    }
  }, [onChange]);

  const handleClear = useCallback(() => onChange(''), [onChange]);

  return (
    <div className="tool-input-wrapper">
      <div className="tool-input-header">
        <span className="tool-input-label">Input Text</span>
        <div className="tool-input-actions">
          <button onClick={handlePaste} className="tool-input-btn" title="Paste from clipboard">
            <FiClipboard /> Paste
          </button>
          <button onClick={handleClear} className="tool-input-btn" title="Clear text" disabled={!value}>
            <FiX /> Clear
          </button>
        </div>
      </div>
      <textarea
        className="tool-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={10}
      />
      <div className="tool-input-footer">
        <CharacterCounter text={value} />
        {maxLength && (
          <span className="tool-input-limit">{value.length}/{maxLength}</span>
        )}
      </div>
    </div>
  );
}

export default ToolInput;
