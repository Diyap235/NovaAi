import { useState, useCallback } from 'react';
import { FiAlignLeft } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { summarizeText } from '../../services/api';
import summaryIcon from '../../assets/generated/summary-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function TextSummarizer() {
  const [format, setFormat] = useState('paragraph');
  const [length, setLength] = useState('medium');

  const apiFn = useCallback((text) => summarizeText(text, { format, length }), [format, length]);

  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Text Summarizer', apiFn);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={summaryIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Text Summarizer</h1>
            <p className="tool-page-desc">Create concise summaries from lengthy documents. Choose between paragraph or bullet-point format.</p>
          </div>
        </div>

        <div className="tool-settings">
          <p className="tool-settings-title">Summary Settings</p>
          <div className="tool-settings-grid">
            <div className="tool-setting-group">
              <label className="tool-setting-label">Format</label>
              <select className="tool-setting-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="paragraph">Paragraph</option>
                <option value="bullets">Bullet Points</option>
              </select>
            </div>
            <div className="tool-setting-group">
              <label className="tool-setting-label">Length</label>
              <select className="tool-setting-select" value={length} onChange={(e) => setLength(e.target.value)}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Paste your long text to summarize..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} originalInput={input} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiAlignLeft /> {isLoading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="text-summarizer" />
      </div>
    </DashboardLayout>
  );
}

export default TextSummarizer;
