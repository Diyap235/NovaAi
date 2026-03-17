import { useState, useCallback } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';

/**
 * Shares result via Web Share API if available, otherwise copies the current URL.
 */
function ShareButton({ text, title = 'Nova AI Result', className = '' }) {
  const [shared, setShared] = useState(false);

  const handleShare = useCallback(async () => {
    if (!text) return;
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // User cancelled or API unavailable — silently ignore
    }
  }, [text, title]);

  return (
    <button
      onClick={handleShare}
      className={`tool-action-btn ${shared ? 'tool-action-btn--success' : ''} ${className}`}
      title="Share result"
      disabled={!text}
    >
      {shared ? <FiCheck /> : <FiShare2 />}
      <span>{shared ? 'Shared!' : 'Share'}</span>
    </button>
  );
}

export default ShareButton;
