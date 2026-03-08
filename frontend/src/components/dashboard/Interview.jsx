import { useState, useEffect, useRef } from 'react';
import { genarateQuestions, evaluateAnswer } from '../../services/aiService';
import { saveInterviewSession, getInterviewSessions } from '../../services/interviewService';
import './Interview.css';

import interviewIcon from '../../assets/job-interview.png';
import correctIcon   from '../../assets/correct.png';
import wrongIcon     from '../../assets/wrong.png';
import dashboardIcon from '../../assets/dashboard.png';

const LEVELS = ['Beginner', 'Junior', 'Mid-level', 'Senior'];
const TOPICS = ['Data Structures', 'Algorithms', 'System Design', 'OOP', 'Databases', 'Networking', 'OS Concepts', 'Frameworks', 'Testing', 'Security'];

/* ── Shared UI ──────────────────────────────────────────── */
const ScoreBar = ({ score }) => {
  const color = score >= 8 ? '#4ade80' : score >= 5 ? '#facc15' : '#f87171';
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score * 10}%`, background: color }} />
      </div>
      <span className="score-bar-label" style={{ color }}>
        {score}<span className="score-bar-max">/10</span>
      </span>
    </div>
  );
};

const AvgRing = ({ avg }) => {
  const color = avg >= 8 ? '#4ade80' : avg >= 5 ? '#facc15' : '#f87171';
  const r = 38, circ = 2 * Math.PI * r;
  return (
    <div className="avg-ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - avg / 10)}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="avg-ring-text">
        <span className="avg-ring-num" style={{ color }}>{avg.toFixed(1)}</span>
        <span className="avg-ring-sub">avg</span>
      </div>
    </div>
  );
};

/* ── SETUP ──────────────────────────────────────────────── */
const SetupScreen = ({ onStart }) => {
  const [role, setRole]     = useState('');
  const [level, setLevel]   = useState('');
  const [topics, setTopics] = useState([]);
  const [count, setCount]   = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const toggleTopic = (t) =>
    setTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleStart = async () => {
    if (!role.trim()) return setError('Please enter a role.');
    if (!level)       return setError('Please select a level.');
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await genarateQuestions(role, level, topics, count, token);
      if (res.success) onStart({ role, level, topics, count }, res.data);
      else setError(res.message || 'Failed to generate questions.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-setup">
      <div className="setup-form">
        <div className="form-group full-width">
          <label>Role</label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Java Backend, DevOps..."
          />
        </div>

        <div className="form-group">
          <label>Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option value="">Select level</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Questions</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))}>
            {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} questions</option>)}
          </select>
        </div>

        <div className="form-group full-width">
          <label>Topics <span className="label-opt">(optional)</span></label>
          <div className="topic-chips">
            {TOPICS.map(t => (
              <button
                key={t}
                type="button"
                className={`topic-chip ${topics.includes(t) ? 'active' : ''}`}
                onClick={() => toggleTopic(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {error && <p className="form-error full-width">{error}</p>}

        <div className="form-group full-width">
          <button className="generate-btn" onClick={handleStart} disabled={loading}>
            {loading
              ? <><span className="spinner" /> Generating Questions...</>
              : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── SESSION ────────────────────────────────────────────── */
const SessionScreen = ({ config, questions: initialQs, onFinish }) => {
  const [questions, setQuestions] = useState(initialQs);
  const [idx, setIdx]             = useState(0);
  const [answer, setAnswer]       = useState('');
  const [evaluation, setEval]     = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults]     = useState([]);
  const [addingMore, setAddingMore] = useState(false);
  const [error, setError]         = useState('');
  const textareaRef               = useRef();

  const current  = questions[idx];
  const isLast   = idx === questions.length - 1;
  const progress = (idx / questions.length) * 100;

  useEffect(() => {
    setAnswer('');
    setEval(null);
    textareaRef.current?.focus();
  }, [idx]);

  const handleSubmit = async () => {
    if (!answer.trim()) return setError('Please write your answer first.');
    setError('');
    setEvaluating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await evaluateAnswer(current, answer, config.role, token);
      if (res.success) setEval(res.data);
      else setError(res.message || 'Evaluation failed.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (!evaluation) return;
    const newResults = [...results, { question: current, answer, evaluation }];
    if (isLast) {
      onFinish(config, questions, newResults);
    } else {
      setResults(newResults);
      setIdx(i => i + 1);
    }
  };

  const handleAddMore = async () => {
    setAddingMore(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await genarateQuestions(config.role, config.level, config.topics, 5, token);
      if (res.success) setQuestions(prev => [...prev, ...res.data]);
      else setError(res.message || 'Failed to add questions.');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setAddingMore(false);
    }
  };

  return (
    <div className="session-screen">
      <div className="session-progress-wrap">
        <div className="session-progress-info">
          <span className="session-q-count">
            Question {idx + 1} <span className="session-q-total">/ {questions.length}</span>
          </span>
          <span className="session-role-badge">{config.role} · {config.level}</span>
        </div>
        <div className="session-progress-track">
          <div className="session-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div className="question-number">Q{idx + 1}</div>
        <p className="question-text">{current}</p>
      </div>

      {!evaluation && (
        <div className="answer-area">
          <label className="answer-label">Your Answer</label>
          <textarea
            ref={textareaRef}
            className="answer-textarea"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={6}
            disabled={evaluating}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="answer-actions">
            {isLast && (
              <button className="add-more-btn" onClick={handleAddMore} disabled={addingMore}>
                {addingMore ? <><span className="spinner spinner-dark" /> Adding...</> : '+ Add 5 More'}
              </button>
            )}
            <button
              className="generate-btn"
              onClick={handleSubmit}
              disabled={evaluating || !answer.trim()}
            >
              {evaluating ? <><span className="spinner" /> Evaluating...</> : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}

      {evaluation && (
        <div className="eval-card">
          <div className="eval-header">
            <h3>Evaluation</h3>
            <ScoreBar score={evaluation.score} />
          </div>

          <p className="eval-feedback">{evaluation.feedback}</p>

          <div className="eval-grid">
            <div className="eval-section strengths-section">
              <h4><img src={correctIcon} alt="" className="icon-eval" /> Strengths</h4>
              <ul>{evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="eval-section improvements-section">
              <h4><img src={wrongIcon} alt="" className="icon-eval" /> Improvements</h4>
              <ul>{evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          </div>

          <div className="eval-actions">
            {isLast && (
              <button className="add-more-btn" onClick={handleAddMore} disabled={addingMore}>
                {addingMore ? <><span className="spinner spinner-dark" /> Adding...</> : '+ Add 5 More'}
              </button>
            )}
            <button className="generate-btn" onClick={handleNext}>
              {isLast ? 'Finish Session' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── SUMMARY ────────────────────────────────────────────── */
const SummaryScreen = ({ session, onNewSession, onViewHistory }) => {
  const avg = session.results.reduce((a, r) => a + r.evaluation.score, 0) / session.results.length;

  return (
    <div className="summary-screen">
      <div className="summary-header">
        <AvgRing avg={avg} />
        <div className="summary-meta">
          <h2>Session Complete</h2>
          <p className="summary-sub">{session.config.role} · {session.config.level}</p>
          <p className="summary-sub">
            {session.results.length} questions ·{' '}
            {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="summary-results">
        {session.results.map((r, i) => (
          <div key={i} className="summary-item">
            <div className="summary-item-header">
              <span className="summary-q-num">Q{i + 1}</span>
              <ScoreBar score={r.evaluation.score} />
            </div>
            <p className="summary-question">{r.question}</p>
            <p className="summary-feedback">{r.evaluation.feedback}</p>
          </div>
        ))}
      </div>

      <div className="summary-actions">
        <button className="reset-btn" onClick={onViewHistory}>View History</button>
        <button className="generate-btn" onClick={onNewSession}>New Session</button>
      </div>
    </div>
  );
};

/* ── HISTORY ────────────────────────────────────────────── */
const HistoryScreen = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await getInterviewSessions(token);
        if (res.success) setHistory(res.data);
        else setError(res.message || 'Failed to load history.');
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="history-loading">
        <span className="spinner spinner-dark" />
        <span>Loading history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-empty">
        <p className="form-error">{error}</p>
        <button className="generate-btn" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <img src={interviewIcon} alt="" className="history-empty-icon" />
        <h3>No interview history yet</h3>
        <p>Complete a session to see your results here.</p>
        <button className="generate-btn" onClick={onBack}>Start Interview</button>
      </div>
    );
  }

  return (
    <div className="history-screen">
      <div className="history-header">
        <h3>{history.length} Session{history.length !== 1 ? 's' : ''}</h3>
      </div>

      <div className="history-list">
        {history.map((session, si) => {
          const avg   = session.avgScore ?? 0;
          const color = avg >= 8 ? '#4ade80' : avg >= 5 ? '#facc15' : '#f87171';
          const isOpen = expanded === si;

          return (
            <div key={session._id} className={`history-card ${isOpen ? 'history-open' : ''}`}>
              <button
                className="history-card-toggle"
                onClick={() => setExpanded(isOpen ? null : si)}
              >
                <div className="history-card-left">
                  <span className="history-role">{session.config.role}</span>
                  <span className="history-meta">
                    {session.config.level} · {session.results.length} Qs ·{' '}
                    {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="history-card-right">
                  <span className="history-avg" style={{ color }}>
                    {avg.toFixed(1)}<span className="history-avg-max">/10</span>
                  </span>
                  <span className={`phase-arrow ${isOpen ? 'rotated' : ''}`}>›</span>
                </div>
              </button>

              {isOpen && (
                <div className="history-card-body">
                  {session.results.map((r, ri) => (
                    <div key={ri} className="history-result-item">
                      <div className="history-result-header">
                        <span className="summary-q-num">Q{ri + 1}</span>
                        <ScoreBar score={r.evaluation.score} />
                      </div>
                      <p className="summary-question">{r.question}</p>
                      <p className="summary-feedback">{r.evaluation.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── ROOT ───────────────────────────────────────────────── */
const Interview = () => {
  const [tab, setTab]     = useState('session');
  const [stage, setStage] = useState('setup');
  const [sessionData, setSessionData] = useState(null);
  const [config, setConfig]     = useState(null);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving]     = useState(false);

  const handleStart = (cfg, qs) => {
    setConfig(cfg);
    setQuestions(qs);
    setStage('session');
  };

  const handleFinish = async (cfg, qs, results) => {
    const session = { config: cfg, questions: qs, results, date: Date.now() };
    setSessionData(session);
    setStage('summary');

    // Save to DB in background
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await saveInterviewSession(cfg, qs, results, token);
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNewSession = () => {
    setStage('setup');
    setSessionData(null);
    setConfig(null);
    setQuestions([]);
  };

  return (
    <div className="interview-page">
      <div className="interview-page-header">
        <div className="interview-title-row">
          <img src={interviewIcon} alt="interview" className="icon-interview-header" />
          <div>
            <h1>AI Interview</h1>
            <p>Practice real questions and get instant AI feedback</p>
          </div>
        </div>

        <div className="interview-tabs">
          <button
            className={`interview-tab ${tab === 'session' ? 'active' : ''}`}
            onClick={() => setTab('session')}
          >
            <img src={dashboardIcon} alt="" className="tab-icon" /> Session
          </button>
          <button
            className={`interview-tab ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            <img src={correctIcon} alt="" className="tab-icon" /> History
            {saving && <span className="saving-dot" title="Saving..." />}
          </button>
        </div>
      </div>

      {tab === 'session' && (
        <>
          {stage === 'setup'   && <SetupScreen onStart={handleStart} />}
          {stage === 'session' && <SessionScreen config={config} questions={questions} onFinish={handleFinish} />}
          {stage === 'summary' && (
            <SummaryScreen
              session={sessionData}
              onNewSession={handleNewSession}
              onViewHistory={() => setTab('history')}
            />
          )}
        </>
      )}

      {tab === 'history' && (
        <HistoryScreen onBack={() => { setTab('session'); handleNewSession(); }} />
      )}
    </div>
  );
};

export default Interview;
