import { FiList } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { restructureSentences } from '../../services/api';
import sentenceIcon from '../../assets/generated/sentence-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function SentenceRestructure() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Sentence Restructure', restructureSentences);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={sentenceIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Sentence Restructure</h1>
            <p className="tool-page-desc">Improve sentence flow, clarity, and structure with AI-powered recommendations. Reduce passive voice and improve readability.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter sentences to restructure..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiList /> {isLoading ? 'Restructuring...' : 'Restructure Sentences'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="sentence-restructure" />
      </div>
    </DashboardLayout>
  );
}

export default SentenceRestructure;
