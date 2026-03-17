import { useState, useCallback } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

/**
 * Copies provided text to clipboard. Shows a brief checkmark confirmation.
 */
function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`tool-action-btn ${copied ? 'tool-action-btn--success' : ''} ${className}`}
      title="Copy to clipboard"
      disabled={!text}
    >
      {copied ? <FiCheck /> : <FiCopy />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

export default CopyButton;
