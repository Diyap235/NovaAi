import { FiBarChart2 } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { scoreReadability } from '../../services/api';
import readabilityIcon from '../../assets/generated/readability-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function ReadabilityScore() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Readability Score', scoreReadability);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={readabilityIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Readability Score</h1>
            <p className="tool-page-desc">Analyze your content's readability. Get Flesch reading score, grade level, and difficulty rating with improvement tips.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter text to analyze readability..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiBarChart2 /> {isLoading ? 'Analyzing...' : 'Analyze Readability'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="readability-score" />
      </div>
    </DashboardLayout>
  );
}

export default ReadabilityScore;
