import { FiMic } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { analyzeTone } from '../../services/api';
import toneIcon from '../../assets/generated/tone-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function ToneAnalyzer() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Tone Analyzer', analyzeTone);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={toneIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Tone Analyzer</h1>
            <p className="tool-page-desc">Detect the tone of your writing — Formal, Friendly, Professional, Confident, Persuasive, or Neutral — with percentage breakdown.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter text to analyze its tone..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiMic /> {isLoading ? 'Analyzing...' : 'Analyze Tone'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="tone-analyzer" />
      </div>
    </DashboardLayout>
  );
}

export default ToneAnalyzer;
