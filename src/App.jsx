import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Fallback for public pages (no sidebar)
const PublicFallback = () => <LoadingSpinner withSidebar={false} />;

// Fallback for dashboard pages (with sidebar to prevent layout flash)
const DashboardFallback = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-main">
      <LoadingSpinner withSidebar={true} />
    </main>
  </div>
);

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
      <Routes>
        {/* Public — no sidebar fallback */}
        <Route path="/" element={<Suspense fallback={<PublicFallback />}><Home /></Suspense>} />
        <Route path="/login"  element={<Suspense fallback={<PublicFallback />}><Login /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<PublicFallback />}><Signup /></Suspense>} />

        {/* Dashboard — sidebar fallback */}
        <Route path="/dashboard"         element={<P><Suspense fallback={<DashboardFallback />}><Dashboard /></Suspense></P>} />
        <Route path="/dashboard/tools"   element={<P><Suspense fallback={<DashboardFallback />}><Tools /></Suspense></P>} />
        <Route path="/dashboard/history" element={<P><Suspense fallback={<DashboardFallback />}><History /></Suspense></P>} />
        <Route path="/dashboard/profile" element={<P><Suspense fallback={<DashboardFallback />}><Profile /></Suspense></P>} />

        {/* Tool pages — sidebar fallback */}
        <Route path="/dashboard/tools/writing-assistant"    element={<P><Suspense fallback={<DashboardFallback />}><AIWritingAssistant /></Suspense></P>} />
        <Route path="/dashboard/tools/grammar-checker"      element={<P><Suspense fallback={<DashboardFallback />}><GrammarChecker /></Suspense></P>} />
        <Route path="/dashboard/tools/paraphrasing-tool"    element={<P><Suspense fallback={<DashboardFallback />}><ParaphrasingTool /></Suspense></P>} />
        <Route path="/dashboard/tools/text-summarizer"      element={<P><Suspense fallback={<DashboardFallback />}><TextSummarizer /></Suspense></P>} />
        <Route path="/dashboard/tools/tone-analyzer"        element={<P><Suspense fallback={<DashboardFallback />}><ToneAnalyzer /></Suspense></P>} />
        <Route path="/dashboard/tools/plagiarism-detector"  element={<P><Suspense fallback={<DashboardFallback />}><PlagiarismDetector /></Suspense></P>} />
        <Route path="/dashboard/tools/citation-generator"   element={<P><Suspense fallback={<DashboardFallback />}><CitationGenerator /></Suspense></P>} />
        <Route path="/dashboard/tools/word-choice-enhancer" element={<P><Suspense fallback={<DashboardFallback />}><WordChoiceEnhancer /></Suspense></P>} />
        <Route path="/dashboard/tools/sentence-restructure" element={<P><Suspense fallback={<DashboardFallback />}><SentenceRestructure /></Suspense></P>} />
        <Route path="/dashboard/tools/readability-score"    element={<P><Suspense fallback={<DashboardFallback />}><ReadabilityScore /></Suspense></P>} />
        <Route path="/dashboard/tools/vocabulary-builder"   element={<P><Suspense fallback={<DashboardFallback />}><VocabularyBuilder /></Suspense></P>} />
        <Route path="/dashboard/tools/style-guide"          element={<P><Suspense fallback={<DashboardFallback />}><StyleGuide /></Suspense></P>} />
      </Routes>
    </Router>
  );
}

export default App;
