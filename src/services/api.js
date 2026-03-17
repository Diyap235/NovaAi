/**
 * Nova AI — Frontend API service
 *
 * Calls the real Node.js backend when VITE_API_URL is set.
 * Falls back to mock responses if the backend is unreachable.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── HTTP helper ──────────────────────────────────────────────────────────────

const getToken = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).token : null;
  } catch {
    return null;
  }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const apiSignup = (name, email, password) =>
  request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const apiLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiGetProfile = () => request('/auth/profile');

export const apiUpdateProfile = (updates) =>
  request('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) });

export const apiChangePassword = (currentPassword, newPassword) =>
  request('/auth/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });

// ─── Drafts ───────────────────────────────────────────────────────────────────

export const apiSaveDraft = (toolName, originalText, processedText, metadata = {}) =>
  request('/drafts', { method: 'POST', body: JSON.stringify({ toolName, originalText, processedText, metadata }) });

export const apiGetDrafts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/drafts${qs ? `?${qs}` : ''}`);
};

export const apiDeleteDraft = (id) => request(`/drafts/${id}`, { method: 'DELETE' });

export const apiDeleteAllDrafts = () => request('/drafts', { method: 'DELETE' });

// ─── AI Tools ─────────────────────────────────────────────────────────────────

const callTool = (endpoint, body) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.data.processedText);

export const improveWriting     = (text, opts = {}) => callTool('/tools/writing-assistant', { text, ...opts });
export const checkGrammar       = (text)             => callTool('/tools/grammar-check',    { text });
export const paraphraseText     = (text, opts = {})  => callTool('/tools/paraphrase',       { text, ...opts });
export const summarizeText      = (text, opts = {})  => callTool('/tools/summarize',        { text, ...opts });
export const analyzeTone        = (text)             => callTool('/tools/tone-analyze',     { text });
export const detectPlagiarism   = (text)             => callTool('/tools/plagiarism',       { text });
export const generateCitation   = (fields)           => callTool('/tools/citation',         fields);
export const enhanceWordChoice  = (text)             => callTool('/tools/word-enhance',     { text });
export const restructureSentences = (text)           => callTool('/tools/restructure',      { text });
export const scoreReadability   = (text)             => callTool('/tools/readability',      { text });
export const buildVocabulary    = (text)             => callTool('/tools/vocabulary',       { text });
export const applyStyleGuide    = (text, opts = {})  => callTool('/tools/style-guide',      { text, ...opts });
