import { useCallback, useState } from 'react';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiInfo, FiFlag } from 'react-icons/fi';
import DashboardLayout from '../../layout/DashboardLayout';
import ToolInput from '../../components/ToolInput';
import ToolToolbar from '../../components/ToolToolbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { detectPlagiarism } from '../../services/api';
import { apiSaveDraft } from '../../services/api';
import { saveToHistory } from '../../utils/history';
import plagiarismIcon from '../../assets/generated/plagiarism-icon.dim_64x64.png';
import '../../styles/dashboard.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const RISK = {
  Low:    { bg: 'rgba(16,185,129,0.1)',  border: '#10b981', text: '#10b981' },
  Medium: { bg: 'rgba(245,158,11,0.1)',  border: '#f59e0b', text: '#f59e0b' },
  High:   { bg: 'rgba(239,68,68,0.1)',   border: '#ef4444', text: '#ef4444' },
};

function badge(level) {
  const c    = RISK[level] || RISK.Low;
  const Icon = level === 'Low' ? FiCheckCircle : FiAlertTriangle;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem',
      background: c.bg, border:`1px solid ${c.border}`, color: c.text,
      padding:'0.35rem 0.875rem', borderRadius:'20px', fontWeight:700, fontSize:'0.85rem' }}>
      <Icon size={13}/> {level} Risk
    </span>
  );
}

// Circular score ring
function ScoreRing({ score, risk }) {
  const c      = RISK[risk] || RISK.Low;
  const r      = 52;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position:'relative', width:130, height:130, flexShrink:0 }}>
      <svg width="130" height="130" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--color-border)" strokeWidth="10"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={c.text} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 0.9s ease' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'1.75rem', fontWeight:800, color:c.text, lineHeight:1 }}>{score}%</span>
        <span style={{ fontSize:'0.7rem', color:'var(--color-text-muted)', marginTop:'0.2rem' }}>plagiarism</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function PlagiarismDetector() {
  const [input,     setInput]     = useState('');
  const [result,    setResult]    = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState('');

  const handleCheck = useCallback(async () => {
    if (!input.trim()) { setError('Please enter some text first.'); return; }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await detectPlagiarism(input);
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const handleSave = useCallback(async () => {
    if (!result) return;
    const str = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    saveToHistory({ tool: 'Plagiarism Detector', input, result: str });
    try { await apiSaveDraft('Plagiarism Detector', input.slice(0,10000), str.slice(0,20000)); } catch {}
  }, [result, input]);

  const isStructured = result && typeof result === 'object' && 'plagiarism_score' in result;
  const plainText    = result && typeof result === 'string' ? result : null;

  return (
    <DashboardLayout>
      <div className="tool-page">

        {/* Header */}
        <div className="tool-page-header">
          <div className="tool-page-icon"><img src={plagiarismIcon} alt=""/></div>
          <div>
            <h1 className="tool-page-title">Plagiarism Detector</h1>
            <p className="tool-page-desc">
              AI-powered originality check. Detects generic phrasing, overused patterns,
              and estimates how likely your text exists elsewhere.
            </p>
          </div>
        </div>

        {/* Input */}
        <ToolInput value={input} onChange={setInput}
          placeholder="Paste your text here to check originality..."
          maxLength={5000}/>

        {/* Button */}
        <div className="tool-generate-row">
          <button className="tool-generate-btn" onClick={handleCheck}
            disabled={isLoading || !input.trim()}>
            <FiShield/> {isLoading ? 'Scanning...' : 'Check Plagiarism'}
          </button>
        </div>

        {/* Error */}
        {error && <div className="tool-output-error" role="alert">{error}</div>}

        {/* Loading */}
        {isLoading && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', padding:'3rem' }}>
            <LoadingSpinner withSidebar={false}/>
            <p style={{ color:'var(--color-text-muted)', fontSize:'0.9rem' }}>Analyzing originality...</p>
          </div>
        )}

        {/* ── Structured result ── */}
        {isStructured && (() => {
          const r  = result;
          const rc = RISK[r.risk_level] || RISK.Low;
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

              {/* Overview */}
              <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
                borderRadius:'var(--border-radius)', padding:'2rem', boxShadow:'var(--shadow-md)',
                display:'flex', gap:'2rem', flexWrap:'wrap', alignItems:'center' }}>
                <ScoreRing score={r.plagiarism_score} risk={r.risk_level}/>
                <div style={{ flex:1, minWidth:'200px', display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', flexWrap:'wrap' }}>
                    <h2 style={{ fontSize:'1.4rem', fontWeight:700, color:'var(--color-text)', margin:0 }}>
                      Originality Report
                    </h2>
                    {badge(r.risk_level)}
                    <span style={{ fontSize:'0.8rem', color:'var(--color-text-muted)',
                      background:'var(--color-surface-light)', border:'1px solid var(--color-border)',
                      padding:'0.2rem 0.6rem', borderRadius:'12px' }}>
                      Confidence: {r.confidence}
                    </span>
                  </div>
                  <p style={{ color:'var(--color-text-muted)', fontSize:'0.95rem', lineHeight:1.6, margin:0 }}>
                    {r.analysis}
                  </p>
                  {/* Score bar */}
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between',
                      fontSize:'0.75rem', color:'var(--color-text-muted)', marginBottom:'0.35rem' }}>
                      <span>Original (0%)</span><span>Plagiarised (100%)</span>
                    </div>
                    <div style={{ height:'8px', background:'var(--color-border)', borderRadius:'8px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${r.plagiarism_score}%`,
                        background: rc.text, borderRadius:'8px', transition:'width 0.9s ease' }}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flagged phrases */}
              {r.flags?.length > 0 && (
                <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
                  borderRadius:'var(--border-radius)', padding:'1.5rem', boxShadow:'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:'var(--color-text)',
                    marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <FiFlag style={{ color:'#f59e0b' }}/> Flagged Phrases
                  </h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                    {r.flags.map((f, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1rem',
                        background:'var(--color-surface-light)', border:'1px solid var(--color-border)',
                        borderRadius:'8px', padding:'0.875rem' }}>
                        <FiAlertTriangle style={{ color:'#f59e0b', flexShrink:0, marginTop:'2px' }}/>
                        <div>
                          <span style={{ fontWeight:600, color:'var(--color-text)',
                            background:'rgba(245,158,11,0.12)', padding:'0.15rem 0.5rem',
                            borderRadius:'4px', fontSize:'0.875rem' }}>
                            "{f.text}"
                          </span>
                          <p style={{ margin:'0.35rem 0 0', fontSize:'0.85rem',
                            color:'var(--color-text-muted)', lineHeight:1.5 }}>
                            {f.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion */}
              {r.suggestion && (
                <div style={{ background:'rgba(168,85,247,0.06)', border:'1px solid rgba(168,85,247,0.25)',
                  borderRadius:'var(--border-radius)', padding:'1.25rem',
                  display:'flex', alignItems:'flex-start', gap:'0.875rem' }}>
                  <FiInfo style={{ color:'var(--color-primary)', flexShrink:0, marginTop:'2px', fontSize:'1.1rem' }}/>
                  <div>
                    <p style={{ fontWeight:700, color:'var(--color-primary)', margin:'0 0 0.25rem', fontSize:'0.9rem' }}>
                      Suggestion
                    </p>
                    <p style={{ color:'var(--color-text)', margin:0, fontSize:'0.9rem', lineHeight:1.6 }}>
                      {r.suggestion}
                    </p>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* Plain text fallback */}
        {plainText && (
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
            borderRadius:'var(--border-radius)', padding:'1.5rem', whiteSpace:'pre-wrap',
            fontSize:'0.95rem', lineHeight:1.8, color:'var(--color-text)' }}>
            {plainText}
          </div>
        )}

        <ToolToolbar
          result={isStructured ? JSON.stringify(result, null, 2) : (plainText || '')}
          onRegenerate={handleCheck}
          onSave={handleSave}
          toolName="plagiarism-detector"
        />
      </div>
    </DashboardLayout>
  );
}

export default PlagiarismDetector;
