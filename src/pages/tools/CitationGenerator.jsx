import { useState, useCallback } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { generateCitation } from '../../services/api';
import citationIcon from '../../assets/generated/citation-icon.dim_64x64.png';
import '../../styles/dashboard.css';

const STYLES = ['APA', 'MLA', 'Chicago', 'Harvard'];

function CitationGenerator() {
  const [style,     setStyle]     = useState('APA');
  const [title,     setTitle]     = useState('');
  const [author,    setAuthor]    = useState('');
  const [publisher, setPublisher] = useState('');
  const [date,      setDate]      = useState('');
  const [url,       setUrl]       = useState('');

  const [result,    setResult]    = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const output = await generateCitation({ title, author, publisher, date, url, style });
      setResult(output);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [title, author, publisher, date, url, style]);

  const inputField = (label, value, setter, type = 'text', placeholder = '') => (
    <div className="tool-setting-group">
      <label className="tool-setting-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="tool-setting-select"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={citationIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Citation Generator</h1>
            <p className="tool-page-desc">Generate accurate citations in APA, MLA, Chicago, and Harvard formats. Fill in the source details below.</p>
          </div>
        </div>

        <div className="tool-settings">
          <p className="tool-settings-title">Citation Style</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className="tool-input-btn"
                style={style === s ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="tool-settings-grid">
            {inputField('Title *',     title,     setTitle,     'text', 'Article or book title')}
            {inputField('Author *',    author,    setAuthor,    'text', 'Last, First')}
            {inputField('Year *',      date,      setDate,      'text', 'YYYY')}
            {inputField('Publisher',   publisher, setPublisher, 'text', 'Publisher name')}
            {inputField('URL',         url,       setUrl,       'url',  'https://...')}
          </div>
        </div>

        <div className="tool-generate-row">
          <button
            className="tool-generate-btn"
            onClick={handleGenerate}
            disabled={isLoading || !title.trim() || !author.trim() || !date.trim()}
          >
            <FiBookOpen /> {isLoading ? 'Generating...' : 'Generate Citation'}
          </button>
        </div>

        <ToolOutput result={result} isLoading={isLoading} error={error} />
        <ToolToolbar result={result} onRegenerate={handleGenerate} toolName="citation-generator" />
      </div>
    </DashboardLayout>
  );
}

export default CitationGenerator;
