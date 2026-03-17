import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiClock, FiUser, FiLogOut,
  FiEdit, FiCheckSquare, FiRepeat, FiAlignLeft,
  FiMic, FiShield, FiBookOpen, FiType,
  FiList, FiBarChart2, FiBook, FiFeather,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import logoImg from '../assets/generated/nova-ai-logo-elegant.dim_200x100.png';

const MAIN_ITEMS = [
  { path: '/dashboard',         icon: FiHome,  label: 'Dashboard' },
  { path: '/dashboard/history', icon: FiClock, label: 'History' },
  { path: '/dashboard/profile', icon: FiUser,  label: 'Profile' },
];

const TOOL_ITEMS = [
  { path: '/dashboard/tools/writing-assistant',   icon: FiEdit,       label: 'AI Writing Assistant' },
  { path: '/dashboard/tools/grammar-checker',     icon: FiCheckSquare,label: 'Grammar Checker' },
  { path: '/dashboard/tools/paraphrasing-tool',   icon: FiRepeat,     label: 'Paraphrasing Tool' },
  { path: '/dashboard/tools/text-summarizer',     icon: FiAlignLeft,  label: 'Text Summarizer' },
  { path: '/dashboard/tools/tone-analyzer',       icon: FiMic,        label: 'Tone Analyzer' },
  { path: '/dashboard/tools/plagiarism-detector', icon: FiShield,     label: 'Plagiarism Detector' },
  { path: '/dashboard/tools/citation-generator',  icon: FiBookOpen,   label: 'Citation Generator' },
  { path: '/dashboard/tools/word-choice-enhancer',icon: FiType,       label: 'Word Choice Enhancer' },
  { path: '/dashboard/tools/sentence-restructure',icon: FiList,       label: 'Sentence Restructure' },
  { path: '/dashboard/tools/readability-score',   icon: FiBarChart2,  label: 'Readability Score' },
  { path: '/dashboard/tools/vocabulary-builder',  icon: FiBook,       label: 'Vocabulary Builder' },
  { path: '/dashboard/tools/style-guide',         icon: FiFeather,    label: 'Style Guide' },
];

function NavItem({ path, icon: Icon, label, currentPath }) {
  return (
    <Link
      to={path}
      className={`sidebar-link ${currentPath === path ? 'active' : ''}`}
    >
      <Icon className="sidebar-icon" />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logoImg} alt="Nova AI" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {MAIN_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} currentPath={currentPath} />
        ))}

        <div className="sidebar-nav-section">AI Tools</div>

        {TOOL_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} currentPath={currentPath} />
        ))}

        <button onClick={handleLogout} className="sidebar-link sidebar-logout">
          <FiLogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
