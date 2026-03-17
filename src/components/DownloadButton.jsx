import { useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';

/**
 * Downloads result as a .txt file.
 * Pass format="pdf" to trigger a basic PDF-like download via Blob.
 */
function DownloadButton({ text, filename = 'nova-ai-result', format = 'txt', className = '' }) {
  const handleDownload = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [text, filename, format]);

  return (
    <button
      onClick={handleDownload}
      className={`tool-action-btn ${className}`}
      title="Download result"
      disabled={!text}
    >
      <FiDownload />
      <span>Download</span>
    </button>
  );
}

export default DownloadButton;
