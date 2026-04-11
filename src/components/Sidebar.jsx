import { useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiClock, FiUser, FiLogOut, FiX, FiMenu,
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
  { path: '/dashboard/tools/writing-assistant',   icon: FiEdit,        label: 'AI Writing Assistant' },
  { path: '/dashboard/tools/grammar-checker',     icon: FiCheckSquare, label: 'Grammar Checker' },
  { path: '/dashboard/tools/paraphrasing-tool',   icon: FiRepeat,      label: 'Paraphrasing Tool' },
  { path: '/dashboard/tools/text-summarizer',     icon: FiAlignLeft,   label: 'Text Summarizer' },
  { path: '/dashboard/tools/tone-analyzer',       icon: FiMic,         label: 'Tone Analyzer' },
  { path: '/dashboard/tools/plagiarism-detector', icon: FiShield,      label: 'Plagiarism Detector' },
  { path: '/dashboard/tools/citation-generator',  icon: FiBookOpen,    label: 'Citation Generator' },
  { path: '/dashboard/tools/word-choice-enhancer',icon: FiType,        label: 'Word Choice Enhancer' },
  { path: '/dashboard/tools/sentence-restructure',icon: FiList,        label: 'Sentence Restructure' },
  { path: '/dashboard/tools/readability-score',   icon: FiBarChart2,   label: 'Readability Score' },
  { path: '/dashboard/tools/vocabulary-builder',  icon: FiBook,        label: 'Vocabulary Builder' },
  { path: '/dashboard/tools/style-guide',         icon: FiFeather,     label: 'Style Guide' },
];

function NavItem({ path, icon: Icon, label, currentPath, onClick }) {
  return (
    <Link
      to={path}
      className={`sidebar-link ${currentPath === path ? 'active' : ''}`}
      onClick={onClick}
    >
      <Icon className="sidebar-icon" />
      <span>{label}</span>
    </Link>
  );
}

function Sidebar({ isOpen, onClose }) {
  const location    = useLocation();
  const navigate    = useNavigate();
  const { logout }  = useAuth();
  const currentPath = location.pathname;
  const sidebarRef  = useRef(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent background scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap — keep focus inside sidebar when open
  useEffect(() => {
    if (!isOpen) return;
    const el = sidebarRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const trap  = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    first?.focus();
    return () => el.removeEventListener('keydown', trap);
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Navigation sidebar"
      >
        <div className="sidebar-header">
          <img src={logoImg} alt="Nova AI" className="sidebar-logo" />
          {/* Close button — visible on mobile */}
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {MAIN_ITEMS.map((item) => (
            <NavItem key={item.path} {...item} currentPath={currentPath} onClick={onClose} />
          ))}

          <div className="sidebar-nav-section">AI Tools</div>

          {TOOL_ITEMS.map((item) => (
            <NavItem key={item.path} {...item} currentPath={currentPath} onClick={onClose} />
          ))}

          <button onClick={handleLogout} className="sidebar-link sidebar-logout">
            <FiLogOut className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

// Hamburger toggle button — rendered in DashboardLayout
export function HamburgerButton({ isOpen, onClick }) {
  return (
    <button
      className="hamburger-btn"
      onClick={onClick}
      aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      aria-expanded={isOpen}
      aria-controls="sidebar"
    >
      {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
    </button>
  );
}

export default Sidebar;
