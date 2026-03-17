import { FiType } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { enhanceWordChoice } from '../../services/api';
import wordChoiceIcon from '../../assets/generated/word-choice-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function WordChoiceEnhancer() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Word Choice Enhancer', enhanceWordChoice);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={wordChoiceIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Word Choice Enhancer</h1>
            <p className="tool-page-desc">Detect weak or overused words and get stronger, more impactful alternatives to elevate your writing.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter text to enhance word choices..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiType /> {isLoading ? 'Enhancing...' : 'Enhance Words'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="word-choice-enhancer" />
      </div>
    </DashboardLayout>
  );
}

export default WordChoiceEnhancer;
