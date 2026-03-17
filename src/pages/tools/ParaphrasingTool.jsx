import { useState, useCallback } from 'react';
import { FiRepeat } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { paraphraseText } from '../../services/api';
import paraphraseIcon from '../../assets/generated/paraphrase-icon.dim_64x64.png';
import '../../styles/dashboard.css';

const MODES = ['Standard', 'Fluent', 'Formal', 'Creative', 'Shorten', 'Expand'];

function ParaphrasingTool() {
  const [mode, setMode] = useState('Standard');

  const apiFn = useCallback((text) => paraphraseText(text, { mode }), [mode]);

  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Paraphrasing Tool', apiFn);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={paraphraseIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Paraphrasing Tool</h1>
            <p className="tool-page-desc">Rewrite sentences and paragraphs while preserving the original meaning. Choose from multiple paraphrase modes.</p>
          </div>
        </div>

        <div className="tool-settings">
          <p className="tool-settings-title">Paraphrase Mode</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`tool-input-btn ${mode === m ? 'active' : ''}`}
                style={mode === m ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter text to paraphrase..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiRepeat /> {isLoading ? 'Paraphrasing...' : 'Paraphrase'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="paraphrasing-tool" />
      </div>
    </DashboardLayout>
  );
}

export default ParaphrasingTool;
