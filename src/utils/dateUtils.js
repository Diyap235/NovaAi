/**
 * Shared date utility functions used across Profile and other pages.
 */

export function getMemberDays(createdAt) {
  if (!createdAt) return 0;
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatLastActive(lastActive, createdAt) {
  const raw = lastActive || createdAt;
  if (!raw) return 'Today';
  const diff = Math.floor((Date.now() - new Date(raw).getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return new Date(raw).toLocaleDateString();
}
