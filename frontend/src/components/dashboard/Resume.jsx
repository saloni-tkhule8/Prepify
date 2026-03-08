import { useState, useRef } from 'react';
import { analyzeResume } from '../../services/aiService';
import './Resume.css';

import uploadIcon    from '../../assets/upload-file.png';
import fileIcon      from '../../assets/resume-file.png';
import strengthsIcon from '../../assets/correct.png';
import weaknessIcon  from '../../assets/wrong.png';
import missingIcon   from '../../assets/missing.png';
import suggestIcon   from '../../assets/suggest.png';
import atsIcon       from '../../assets/ats.png';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const ATSInfo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ats-info ${open ? 'ats-open' : ''}`}>
      <button type="button" className="ats-toggle" onClick={() => setOpen(!open)}>
        <span className="ats-toggle-label">
          <img src={atsIcon} alt="ats" className="icon-ats" />
          How ATS Really Works
        </span>
        <span className={`ats-arrow ${open ? 'rotated' : ''}`}>›</span>
      </button>
      {open && (
        <div className="ats-content">
          <div className="ats-myth">
            <div className="myth-badge">MYTH</div>
            <p>"ATS systems just scan for keywords and reject resumes automatically."</p>
          </div>
          <div className="ats-grid">
            <div className="ats-card">
              <h4>Parsing & Structure</h4>
              <p>ATS first parses your resume into sections — experience, education, skills. Poor formatting (tables, columns, graphics) causes parsing failures, not keyword mismatch.</p>
            </div>
            <div className="ats-card">
              <h4>Contextual Matching</h4>
              <p>Modern ATS use NLP to understand context. "Built React apps" and "developed frontend with React.js" score similarly. It's about relevance, not exact keywords.</p>
            </div>
            <div className="ats-card">
              <h4>Scoring Factors</h4>
              <p>ATS scores are based on job title match, years of experience, education level, skill relevance, and employment gaps — not just keyword density.</p>
            </div>
            <div className="ats-card">
              <h4>Human Review</h4>
              <p>ATS doesn't reject resumes — it ranks them. A human recruiter reviews the top ranked resumes. ATS is a sorting tool, not a gatekeeper.</p>
            </div>
            <div className="ats-card">
              <h4>What Actually Helps</h4>
              <p>Clean single-column layout, standard section headings, measurable achievements, relevant job titles, and matching the seniority level of the role.</p>
            </div>
            <div className="ats-card">
              <h4>What Hurts</h4>
              <p>Headers/footers with key info, images, fancy fonts, tables, text boxes, missing contact info, and applying for roles far outside your experience level.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreRing = ({ score }) => {
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#facc15' : '#f87171';
  return (
    <div className="score-ring" style={{ '--score-color': color }}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="42" fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 42}`}
          strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-text">
        <span className="score-number" style={{ color }}>{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
};

const Resume = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const desktopInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type === 'application/pdf') {
      setFile(f);
      setError('');
    } else {
      setError('Only PDF files are supported.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (result) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const toBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload a PDF resume.');
    if (!targetRole.trim()) return setError('Please enter a target role.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const base64File = await toBase64(file);
      const token = localStorage.getItem('token');
      const data = await analyzeResume(base64File, targetRole, token);
      if (!data.success) throw new Error(data.message);
      setResult(data.data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = (e) => {
    e.preventDefault();
    setResult(null);
    setFile(null);
    setTargetRole('');
  };

  const goodPoints = [
    'Single-column, clean layout easy to scan',
    'Clear section headings: Education, Experience, Skills',
    'Quantified achievements (e.g. "Reduced load time by 40%")',
    'Relevant skills tailored to the job description',
    'Concise bullet points — 1 to 2 lines each',
    'Standard fonts like Calibri, Arial, or Times New Roman',
    'Contact info clearly at the top',
    'No graphics, tables, or multi-column layouts',
  ];

  const badPoints = [
    'Fancy multi-column or graphic-heavy design',
    'Lists responsibilities instead of achievements',
    'Long paragraphs and walls of text',
    'Includes photos, logos, or decorative elements',
    "Uses headers/footers which ATS often can't parse",
    'Generic skills like "MS Office" or "team player"',
    'No measurable impact or results mentioned',
    'Irrelevant work experience filling up space',
  ];

  return (
    <div className="resume-page">
      <div className="resume-header">
        <h1>Resume Analyzer</h1>
        <p>Upload your resume and get AI-powered feedback tailored to your target role</p>
      </div>

      <div className={`resume-form ${result ? 'frozen' : ''}`}>

        {/* ── MOBILE UPLOAD UI ── */}
        {isMobile ? (
          <div className={`mobile-upload-zone ${file ? 'has-file' : ''}`}>
            {file ? (
              <div className="mobile-file-info">
                <img src={fileIcon} alt="file" className="icon-file" />
                <div className="mobile-file-meta">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {!result && (
                  <button
                    type="button"
                    className="change-file"
                    onClick={(e) => { e.preventDefault(); setFile(null); setResult(null); }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : (
              <div className="mobile-upload-prompt">
                <img src={uploadIcon} alt="upload" className="icon-upload" />
                <p className="upload-text">Select your PDF resume</p>
              </div>
            )}

            {!result && (
              <label className="mobile-file-label">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    handleFile(e.target.files[0]);
                    e.target.value = '';
                  }}
                />
                {file ? 'Change File' : 'Browse PDF'}
              </label>
            )}
          </div>
        ) : (
          /* ── DESKTOP UPLOAD UI ── */
          <>
            <input
              ref={desktopInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleFile(e.target.files[0]);
                e.target.value = '';
              }}
            />
            <div
              className={`drop-zone ${drag ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(e) => { if (result) return; e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
              onClick={() => { if (!result) desktopInputRef.current.click(); }}
            >
              {file ? (
                <>
                  <img src={fileIcon} alt="file" className="icon-file" />
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                  {!result && (
                    <button
                      type="button"
                      className="change-file"
                      onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                    >
                      Remove
                    </button>
                  )}
                </>
              ) : (
                <>
                  <img src={uploadIcon} alt="upload" className="icon-upload" />
                  <p className="upload-text">Drop your PDF resume here</p>
                  <p className="upload-sub">or click to browse</p>
                </>
              )}
            </div>
          </>
        )}

        <div className="role-row">
          <div className="form-group">
            <label>Target Role</label>
            <input
              placeholder="e.g. Frontend Developer, Data Scientist"
              value={targetRole}
              onChange={(e) => { if (!result) setTargetRole(e.target.value); }}
              readOnly={!!result}
            />
          </div>
          {result ? (
            <button type="button" className="reset-btn" onClick={handleReset}>
              Analyze Another
            </button>
          ) : (
            <button type="button" className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? <><span className="spinner" /> Analyzing...</> : 'Analyze Resume'}
            </button>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}
      </div>

      <ATSInfo />

      {result && (
        <div className="result-section">
          <div className="result-top">
            <ScoreRing score={result.score} />
            <div className="result-summary">
              <h2>Analysis Complete</h2>
              <p>{result.summary}</p>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-card strengths">
              <h3><img src={strengthsIcon} alt="" className="icon-card" /> Strengths</h3>
              <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="result-card weaknesses">
              <h3><img src={weaknessIcon} alt="" className="icon-card" /> Weaknesses</h3>
              <ul>{result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
            <div className="result-card missing">
              <h3><img src={missingIcon} alt="" className="icon-card" /> Missing Skills</h3>
              <div className="tags">
                {result.missingSkills.map((s, i) => <span key={i} className="tag">{s}</span>)}
              </div>
            </div>
            <div className="result-card suggestions">
              <h3><img src={suggestIcon} alt="" className="icon-card" /> Suggestions</h3>
              <ul>{result.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Good vs Bad Resume ── */}
      <div className="ats-deepdive">
        <div className="deepdive-header">
          <h2>What Makes a Good vs Bad Resume?</h2>
          <p>Key differences that determine whether your resume gets noticed</p>
        </div>

        <div className="good-bad-grid">
          <div className="good-bad-card good-card">
            <div className="good-bad-card-header">
              <span className="resume-type-badge good">Good Resume</span>
              <h3>What a strong resume looks like</h3>
              <p>A strong resume is clean, simple, and easy to scan by both ATS and recruiters.</p>
            </div>
            <ul className="keypoints-list">
              {goodPoints.map((point, i) => (
                <li key={i}>
                  <span className="keypoint-dot good-dot" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="good-bad-card bad-card">
            <div className="good-bad-card-header">
              <span className="resume-type-badge bad">Bad Resume</span>
              <h3>What a weak resume looks like</h3>
              <p>A weak resume focuses more on design than content, hurting both ATS ranking and readability.</p>
            </div>
            <ul className="keypoints-list">
              {badPoints.map((point, i) => (
                <li key={i}>
                  <span className="keypoint-dot bad-dot" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Resume;
