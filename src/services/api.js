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

// Response shape from backend: { success, tool, result, ...meta }
const callTool = (endpoint, body) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(body) }).then((r) => r.result);

// Formats an object result into a readable string for ToolOutput display
const formatObject = (obj) => JSON.stringify(obj, null, 2);

// AI generative tools — result is always a plain string
export const improveWriting       = (text, opts = {}) => callTool('/tools/enhance',         { text, ...opts });
export const paraphraseText       = (text, opts = {}) => callTool('/tools/paraphrase',      { text, ...opts });
export const humanizeText         = (text, opts = {}) => callTool('/tools/humanize',        { text, ...opts });
export const restructureSentences = (text, opts = {}) => callTool('/tools/restructure',     { text, ...opts });
// Tone Analyzer uses NLP sentiment endpoint — no AI
export const analyzeTone = (text) =>
  callTool('/tools/sentiment', { text }).then((r) => {
    if (typeof r === 'string') return r;
    const { tone, sentiment: s } = r;
    return [
      `Tone: ${tone.tone} (${tone.confidence} confidence)`,
      `Sentiment: ${s.label} (score: ${s.comparative})`,
      ``,
      `Positive words: ${s.positive.length ? s.positive.join(', ') : 'none'}`,
      `Negative words: ${s.negative.length ? s.negative.join(', ') : 'none'}`,
    ].join('\n');
  });
export const applyStyleGuide      = (text, opts = {}) => callTool('/tools/style',           { text, ...opts });
export const enhanceWordChoice    = (text, opts = {}) => callTool('/tools/enhance',         { text, ...opts });
export const buildVocabulary      = (text, opts = {}) => callTool('/tools/vocabulary',      { text, ...opts });

// Hybrid tools — NLP by default, AI only when explicitly opted in
export const summarizeText    = (text, opts = {}) => callTool('/tools/summarize',   { text, ...opts });
export const checkGrammar     = (text, opts = {}) => callTool('/tools/grammar',     { text, ...opts });
export const scoreReadability = (text, opts = {}) => callTool('/tools/readability', { text, ...opts });

// Plagiarism — full NLP pipeline, returns human-readable report
export const detectPlagiarism = (text) =>
  request('/tools/plagiarism', { method: 'POST', body: JSON.stringify({ text }) }).then((r) => r.result);

// Citation — strict rule-based, no AI
// Required: title, author, year, style
// Optional: publisher, url
export const generateCitation = ({ title, author, publisher, date, url, style }) =>
  request('/tools/citation', {
    method: 'POST',
    body: JSON.stringify({ style, title, author, year: date, publisher, url }),
  }).then((r) => r.result);

// NLP analytical tools — result is an object, formatted for display
export const getKeywordDensity = (text)           =>
  callTool('/tools/keyword-density', { text }).then(formatObject);
export const getSimilarity     = (text1, text2)   =>
  callTool('/tools/similarity',      { text1, text2 }).then(formatObject);
export const getSentiment      = (text)           =>
  callTool('/tools/sentiment',       { text }).then(formatObject);
