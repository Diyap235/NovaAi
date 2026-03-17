import { useState, useCallback } from 'react';
import { FiFeather } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { applyStyleGuide } from '../../services/api';
import styleGuideIcon from '../../assets/generated/style-guide-icon.dim_64x64.png';
import '../../styles/dashboard.css';

const STYLES = ['Academic', 'Business', 'Blog', 'Creative', 'Technical', 'Professional'];

function StyleGuide() {
  const [style, setStyle] = useState('Professional');

  const apiFn = useCallback((text) => applyStyleGuide(text, { style }), [style]);

  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Style Guide', apiFn);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={styleGuideIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Style Guide</h1>
            <p className="tool-page-desc">Maintain consistency with customizable style guidelines. Apply Academic, Business, Blog, Creative, or Technical writing standards.</p>
          </div>
        </div>

        <div className="tool-settings">
          <p className="tool-settings-title">Writing Style</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter text to apply style guide..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiFeather /> {isLoading ? 'Applying...' : 'Apply Style Guide'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="style-guide" />
      </div>
    </DashboardLayout>
  );
}

export default StyleGuide;
