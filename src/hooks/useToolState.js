import { useState, useCallback } from 'react';
import { apiSaveDraft } from '../services/api';
import { saveToHistory } from '../utils/history';

/**
 * Shared state and action logic for all tool pages.
 *
 * @param {string} toolName  — display name used for history and draft label
 * @param {Function} apiFn   — async function(input, settings) => string result
 */
export function useToolState(toolName, apiFn) {
  const [input,     setInput]     = useState('');
  const [result,    setResult]    = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');

  const run = useCallback(async (settings = {}) => {
    if (!input.trim()) {
      setError('Please enter some text first.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const output = await apiFn(input, settings);
      setResult(output);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [input, apiFn]);

  const regenerate = useCallback((settings = {}) => run(settings), [run]);

  /**
   * Save to backend drafts (primary) with localStorage fallback.
   * Backend requires: toolName, originalText, processedText.
   */
  const handleSave = useCallback(async () => {
    if (!result) return;
    const resultStr = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

    // Always save to localStorage as a fast local fallback
    saveToHistory({ tool: toolName, input, result: resultStr });

    // Attempt backend save — silently ignore if unauthenticated or offline
    try {
      await apiSaveDraft(toolName, input.slice(0, 10000), resultStr.slice(0, 20000));
    } catch {
      // Backend unavailable — localStorage copy is the fallback
    }
  }, [toolName, input, result]);

  const clearAll = useCallback(() => {
    setInput('');
    setResult('');
    setError('');
  }, []);

  return {
    input, setInput,
    result,
    isLoading,
    error,
    run,
    regenerate,
    handleSave,
    clearAll,
  };
}
