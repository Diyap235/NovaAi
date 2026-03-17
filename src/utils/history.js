/**
 * Persists a tool result entry to localStorage history.
 */
export function saveToHistory({ tool, input, result }) {
  try {
    const raw     = localStorage.getItem('novaHistory');
    const history = raw ? JSON.parse(raw) : [];
    history.unshift({
      id:        Date.now(),
      tool,
      input:     input.slice(0, 200),   // store a preview only
      result:    result.slice(0, 500),
      createdAt: new Date().toISOString(),
    });
    // Keep last 100 entries
    localStorage.setItem('novaHistory', JSON.stringify(history.slice(0, 100)));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

export function getHistory() {
  try {
    const raw = localStorage.getItem('novaHistory');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id) {
  try {
    const history = getHistory().filter((item) => item.id !== id);
    localStorage.setItem('novaHistory', JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function clearHistory() {
  localStorage.removeItem('novaHistory');
}
