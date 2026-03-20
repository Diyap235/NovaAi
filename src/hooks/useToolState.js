import { useState, useCallback } from 'react';
import { saveToHistory } from '../utils/history';

/**
 * Shared state and action logic for all 12 AI tool pages.
 *
 * @param {string} toolName  — display name used for history and download filename
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

  const handleSave = useCallback(() => {
    if (!result) return;
    const resultStr = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    saveToHistory({ tool: toolName, input, result: resultStr });
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
