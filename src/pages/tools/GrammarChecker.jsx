import { FiCheckSquare } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { checkGrammar } from '../../services/api';
import grammarIcon from '../../assets/generated/grammar-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function GrammarChecker() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Grammar Checker', checkGrammar);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={grammarIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Grammar Checker</h1>
            <p className="tool-page-desc">Detect and fix grammar, spelling, and punctuation errors with AI precision. Get correction suggestions and explanations.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Paste your text to check for grammar errors..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiCheckSquare /> {isLoading ? 'Checking...' : 'Check Grammar'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="grammar-checker" />
      </div>
    </DashboardLayout>
  );
}

export default GrammarChecker;
