import { useState, useCallback } from 'react';
import { FiZap } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { improveWriting } from '../../services/api';
import writingToolIcon from '../../assets/generated/writing-tool-icon.dim_64x64.png';
import '../../styles/dashboard.css';

const TONES   = ['Professional', 'Casual', 'Formal', 'Friendly', 'Persuasive'];
const STYLES  = ['Formal', 'Creative', 'Academic', 'Business', 'Blog'];
const LENGTHS = ['Shorter', 'Same', 'Longer'];

function AIWritingAssistant() {
  const [tone,   setTone]   = useState('Professional');
  const [style,  setStyle]  = useState('Formal');
  const [length, setLength] = useState('Same');

  const apiFn = useCallback(
    (text) => improveWriting(text, { tone, style, length }),
    [tone, style, length]
  );

  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('AI Writing Assistant', apiFn);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={writingToolIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">AI Writing Assistant</h1>
            <p className="tool-page-desc">Enhance your writing with intelligent suggestions for tone, style, and clarity.</p>
          </div>
        </div>

        {/* Settings */}
        <div className="tool-settings">
          <p className="tool-settings-title">Writing Settings</p>
          <div className="tool-settings-grid">
            <div className="tool-setting-group">
              <label className="tool-setting-label">Tone</label>
              <select className="tool-setting-select" value={tone} onChange={(e) => setTone(e.target.value)}>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="tool-setting-group">
              <label className="tool-setting-label">Writing Style</label>
              <select className="tool-setting-select" value={style} onChange={(e) => setStyle(e.target.value)}>
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="tool-setting-group">
              <label className="tool-setting-label">Length</label>
              <select className="tool-setting-select" value={length} onChange={(e) => setLength(e.target.value)}>
                {LENGTHS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Input / Output */}
        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter your text to enhance..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} originalInput={input} />
        </div>

        {/* Generate */}
        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiZap /> {isLoading ? 'Processing...' : 'Enhance Writing'}
          </button>
        </div>

        {/* Toolbar */}
        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="ai-writing-assistant" />
      </div>
    </DashboardLayout>
  );
}

export default AIWritingAssistant;
