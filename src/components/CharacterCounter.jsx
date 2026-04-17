import { useMemo } from 'react';


function CharacterCounter({ text = '' }) {
  const charCount = text.length;
  const wordCount = useMemo(
    () => (text.trim() === '' ? 0 : text.trim().split(/\s+/).length),
    [text]
  );

  return (
    <div className="char-counter">
      <span>{charCount} characters</span>
      <span className="char-counter-divider">·</span>
      <span>{wordCount} words</span>
    </div>
  );
}

export default CharacterCounter;
