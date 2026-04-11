import { useState, useRef, useCallback } from 'react';
import { apiSaveDraft } from '../services/api';
import { saveToHistory } from '../utils/history';
import { useAuth } from './useAuth';

export function useToolState(toolName, apiFn) {
  const [input,     setInput]     = useState('');
  const [result,    setResult]    = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');
  const runningRef = useRef(false);
  const { refreshStats } = useAuth();

  const run = useCallback(async (settings = {}) => {
    if (runningRef.current) return;
    if (!input.trim()) {
      setError('Please enter some text first.');
      return;
    }
    runningRef.current = true;
    setIsLoading(true);
    setError('');
    try {
      const output = await apiFn(input, settings);
      setResult(output);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      runningRef.current = false;
    }
  }, [input, apiFn]);

  const regenerate = useCallback((settings = {}) => run(settings), [run]);

  const handleSave = useCallback(async () => {
    if (!result) return;
    const resultStr = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    saveToHistory({ tool: toolName, input, result: resultStr });
    try {
      await apiSaveDraft(toolName, input.slice(0, 10000), resultStr.slice(0, 20000));
      await refreshStats(); // update dashboard stats immediately
    } catch {
      // localStorage fallback already saved above
    }
  }, [toolName, input, result, refreshStats]);

  const clearAll = useCallback(() => {
    setInput('');
    setResult('');
    setError('');
  }, []);

  return { input, setInput, result, isLoading, error, run, regenerate, handleSave, clearAll };
}
