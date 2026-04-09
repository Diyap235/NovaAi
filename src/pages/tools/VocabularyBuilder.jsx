import { FiBook } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolOutput from '../../components/ToolOutput';
import ToolToolbar from '../../components/ToolToolbar';
import { useToolState } from '../../hooks/useToolState';
import { buildVocabulary } from '../../services/api';
import vocabularyIcon from '../../assets/generated/vocabulary-icon.dim_64x64.png';
import '../../styles/dashboard.css';

function VocabularyBuilder() {
  const { input, setInput, result, isLoading, error, run, regenerate, handleSave } =
    useToolState('Vocabulary Builder', buildVocabulary);

  return (
    <DashboardLayout>
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={vocabularyIcon} alt="" /></div>
          <div>
            <h1 className="tool-page-title">Vocabulary Builder</h1>
            <p className="tool-page-desc">Expand your vocabulary with contextual synonyms, word definitions, and example sentences for any word in your text.</p>
          </div>
        </div>

        <div className="tool-panels">
          <ToolInput value={input} onChange={setInput} placeholder="Enter a word or sentence to explore vocabulary..." />
          <ToolOutput result={result} isLoading={isLoading} error={error} originalInput={input} />
        </div>

        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={() => run()} disabled={isLoading || !input.trim()}>
            <FiBook /> {isLoading ? 'Building...' : 'Build Vocabulary'}
          </button>
        </div>

        <ToolToolbar result={result} onRegenerate={regenerate} onSave={handleSave} toolName="vocabulary-builder" />
      </div>
    </DashboardLayout>
  );
}

export default VocabularyBuilder;
