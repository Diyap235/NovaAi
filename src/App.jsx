import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
const Home   = lazy(() => import('./pages/Home'));
const Login  = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

// Dashboard pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tools     = lazy(() => import('./pages/Tools'));
const History   = lazy(() => import('./pages/History'));
const Profile   = lazy(() => import('./pages/Profile'));

// Tool pages
const AIWritingAssistant  = lazy(() => import('./pages/tools/AIWritingAssistant'));
const GrammarChecker      = lazy(() => import('./pages/tools/GrammarChecker'));
const ParaphrasingTool    = lazy(() => import('./pages/tools/ParaphrasingTool'));
const TextSummarizer      = lazy(() => import('./pages/tools/TextSummarizer'));
const ToneAnalyzer        = lazy(() => import('./pages/tools/ToneAnalyzer'));
const PlagiarismDetector  = lazy(() => import('./pages/tools/PlagiarismDetector'));
const CitationGenerator   = lazy(() => import('./pages/tools/CitationGenerator'));
const WordChoiceEnhancer  = lazy(() => import('./pages/tools/WordChoiceEnhancer'));
const SentenceRestructure = lazy(() => import('./pages/tools/SentenceRestructure'));
const ReadabilityScore    = lazy(() => import('./pages/tools/ReadabilityScore'));
const VocabularyBuilder   = lazy(() => import('./pages/tools/VocabularyBuilder'));
const StyleGuide          = lazy(() => import('./pages/tools/StyleGuide'));

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner withSidebar={false} />}>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard */}
          <Route path="/dashboard"         element={<P><Dashboard /></P>} />
          <Route path="/dashboard/tools"   element={<P><Tools /></P>} />
          <Route path="/dashboard/history" element={<P><History /></P>} />
          <Route path="/dashboard/profile" element={<P><Profile /></P>} />

          {/* Tool pages */}
          <Route path="/dashboard/tools/writing-assistant"    element={<P><AIWritingAssistant /></P>} />
          <Route path="/dashboard/tools/grammar-checker"      element={<P><GrammarChecker /></P>} />
          <Route path="/dashboard/tools/paraphrasing-tool"    element={<P><ParaphrasingTool /></P>} />
          <Route path="/dashboard/tools/text-summarizer"      element={<P><TextSummarizer /></P>} />
          <Route path="/dashboard/tools/tone-analyzer"        element={<P><ToneAnalyzer /></P>} />
          <Route path="/dashboard/tools/plagiarism-detector"  element={<P><PlagiarismDetector /></P>} />
          <Route path="/dashboard/tools/citation-generator"   element={<P><CitationGenerator /></P>} />
          <Route path="/dashboard/tools/word-choice-enhancer" element={<P><WordChoiceEnhancer /></P>} />
          <Route path="/dashboard/tools/sentence-restructure" element={<P><SentenceRestructure /></P>} />
          <Route path="/dashboard/tools/readability-score"    element={<P><ReadabilityScore /></P>} />
          <Route path="/dashboard/tools/vocabulary-builder"   element={<P><VocabularyBuilder /></P>} />
          <Route path="/dashboard/tools/style-guide"          element={<P><StyleGuide /></P>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
