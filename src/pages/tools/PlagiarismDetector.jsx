import { FiShield } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { detectPlagiarism } from '../../services/api';
import plagiarismIcon from '../../assets/generated/plagiarism-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function PlagiarismDetector() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Plagiarism Detector', detectPlagiarism);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={plagiarismIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Plagiarism Detector</h1>
            <p className="tool-page-desc">Check your content for originality. Get a plagiarism percentage score, highlighted copied text, and matched source list.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Paste your text to check for plagiarism..." maxLength={5000} />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiShield /> {isLoading ? 'Scanning...' : 'Check Plagiarism'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="plagiarism-detector" />
      </div>
    </DashboardLayout>
  );
}

export default PlagiarismDetector;
