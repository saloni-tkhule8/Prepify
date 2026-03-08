import { useState, useEffect } from 'react';
import { getInterviewSessions } from '../../services/interviewService';
import { getProfile } from '../../services/authService';
import './DashboardHome.css';

import defaultAvatar  from '../../assets/userProfile.png';
import waveIcon from '../../assets/wave.png';

// ── Helpers ──────────────────────────────────────────────
const scoreColor = (s) => s >= 8 ? '#4ade80' : s >= 5 ? '#facc15' : '#f87171';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const deriveStats = (sessions) => {
  if (!sessions.length) return { total: 0, avgScore: 0, totalQs: 0, bestScore: 0 };
  const total     = sessions.length;
  const avgScore  = sessions.reduce((a, s) => a + s.avgScore, 0) / total;
  const totalQs   = sessions.reduce((a, s) => a + s.results.length, 0);
  const bestScore = Math.max(...sessions.map(s => s.avgScore));
  return { total, avgScore: +avgScore.toFixed(1), totalQs, bestScore: +bestScore.toFixed(1) };
};

const buildChartData = (sessions) =>
  [...sessions]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-10)
    .map((s) => ({ score: s.avgScore, date: formatDate(s.createdAt), role: s.config.role }));

// ── Welcome Banner ────────────────────────────────────────
const WelcomeBanner = ({ user }) => {
  const [imgSrc, setImgSrc] = useState(user?.profileImage?.url || defaultAvatar);

  useEffect(() => {
    setImgSrc(user?.profileImage?.url || defaultAvatar);
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

return (
  <div className="welcome-banner">
    <div className="welcome-left">
      <div className="welcome-avatar-wrap">
        <img
          src={imgSrc}
          alt="profile"
          className="welcome-avatar"
          onError={() => setImgSrc(defaultAvatar)}
        />
      </div>
      <div className="welcome-text">
        <p className="welcome-greeting">{greeting},</p>
        <h2 className="welcome-name">
          {user?.name || 'User'} <img src={waveIcon} alt="wave" className="wave-icon" />
        </h2>
        <p className="welcome-sub">{user?.email || ''}</p>
      </div>
    </div>
  </div>
);
};

// ── Stat Card ─────────────────────────────────────────────
const StatCard = ({ label, value, unit, color, delay }) => (
  <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
    <span className="stat-label">{label}</span>
    <div className="stat-value-row">
      <span className="stat-value" style={{ color }}>{value}</span>
      {unit && <span className="stat-unit">{unit}</span>}
    </div>
  </div>
);

// ── Score Line Chart (pure SVG) ───────────────────────────
const ScoreChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  if (!data.length) return null;

  const W = 100, H = 60, pad = 6;
  const scores = data.map(d => d.score);
  const min = Math.max(0, Math.min(...scores) - 1);
  const max = Math.min(10, Math.max(...scores) + 1);

  const x = (i) => pad + (i / (data.length - 1 || 1)) * (W - pad * 2);
  const y = (s) => pad + (1 - (s - min) / (max - min || 1)) * (H - pad * 2);

  const pts  = data.map((d, i) => `${x(i)},${y(d.score)}`).join(' ');
  const area = `M${x(0)},${H} ` + data.map((d, i) => `L${x(i)},${y(d.score)}`).join(' ') + ` L${x(data.length - 1)},${H} Z`;

  return (
    <div className="chart-wrap">
      <div className="chart-header">
        <span className="chart-title">Score Trend</span>
        <span className="chart-sub">Last {data.length} sessions</span>
      </div>
      <div className="chart-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="chart-svg">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#4f7cff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4f7cff" stopOpacity="0"    />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line key={i}
              x1={pad} y1={pad + t * (H - pad * 2)}
              x2={W - pad} y2={pad + t * (H - pad * 2)}
              stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
            />
          ))}
          <path d={area} fill="url(#chartGrad)" />
          <polyline points={pts} fill="none" stroke="#4f7cff" strokeWidth="1.2"
            strokeLinejoin="round" strokeLinecap="round" />
          {data.map((d, i) => (
            <circle key={i}
              cx={x(i)} cy={y(d.score)}
              r={hovered === i ? 2.2 : 1.3}
              fill={hovered === i ? scoreColor(d.score) : '#4f7cff'}
              style={{ cursor: 'pointer', transition: 'r 0.15s' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        {hovered !== null && (
          <div className="chart-tooltip" style={{
            left: `${(hovered / (data.length - 1 || 1) * 100).toFixed(1)}%`,
          }}>
            <span className="tooltip-score" style={{ color: scoreColor(data[hovered].score) }}>
              {data[hovered].score.toFixed(1)}
            </span>
            <span className="tooltip-role">{data[hovered].role}</span>
            <span className="tooltip-date">{data[hovered].date}</span>
          </div>
        )}
      </div>
      <div className="chart-x-labels">
        {data.map((d, i) => <span key={i} className="chart-x-label">{d.date}</span>)}
      </div>
    </div>
  );
};

// ── Weekly Streak ─────────────────────────────────────────
const WeekStreak = ({ sessions }) => {
  const days  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const activeDays = new Set(sessions.map(s => {
    const d = new Date(s.createdAt); d.setHours(0, 0, 0, 0);
    return d.getTime();
  }));

  const week = days.map((label, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    return { label, isActive: activeDays.has(d.getTime()), isToday: d.toDateString() === today.toDateString() };
  });

  const count = week.filter(d => d.isActive).length;

  return (
    <div className="streak-wrap">
      <div className="chart-header">
        <span className="chart-title">This Week</span>
        <span className="chart-sub">{count}/7 days</span>
      </div>
      <div className="streak-days">
        {week.map(({ label, isActive, isToday }) => (
          <div key={label} className={`streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}>
            <div className="streak-dot" />
            <span className="streak-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Recent Sessions ───────────────────────────────────────
const RecentSessions = ({ sessions }) => {
  const recent = sessions.slice(0, 3);
  if (!recent.length) return null;
  return (
    <div className="recent-wrap">
      <span className="chart-title">Recent Sessions</span>
      <div className="recent-list">
        {recent.map((s, i) => {
          const color = scoreColor(s.avgScore);
          return (
            <div key={i} className="recent-item">
              <div className="recent-left">
                <span className="recent-role">{s.config.role}</span>
                <span className="recent-meta">{s.config.level} · {s.results.length} Qs · {formatDate(s.createdAt)}</span>
              </div>
              <span className="recent-score" style={{ color }}>
                {s.avgScore.toFixed(1)}<span className="recent-score-max">/10</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────
const EmptyState = ({ user }) => {
  const [imgSrc, setImgSrc] = useState(user?.profileImage?.url || defaultAvatar);
  useEffect(() => { setImgSrc(user?.profileImage?.url || defaultAvatar); }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

return (
  <div className="welcome-banner">
    <div className="welcome-left">
      <div className="welcome-avatar-wrap">
        <img
          src={imgSrc}
          alt="profile"
          className="welcome-avatar"
          onError={() => setImgSrc(defaultAvatar)}
        />
      </div>
      <div className="welcome-text">
        <p className="welcome-greeting">{greeting},</p>
        <h2 className="welcome-name">
          {user?.name || 'User'} <img src={waveIcon} alt="wave" className="wave-icon" />
        </h2>
        <p className="welcome-sub">{user?.email || ''}</p>
      </div>
    </div>
  </div>
);
};

// ── Root ──────────────────────────────────────────────────
const DashboardHome = () => {
  const [sessions, setSessions] = useState([]);
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const loadAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sessRes, profileRes] = await Promise.all([
          getInterviewSessions(token),
          getProfile(token),
        ]);
        if (sessRes.success)    setSessions(sessRes.data);
        if (profileRes.success) setUser(profileRes.user);
        if (!sessRes.success)   setError(sessRes.message || 'Failed to load sessions.');
      } catch {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const stats     = deriveStats(sessions);
  const chartData = buildChartData(sessions);

  return (
    <div className="dash-page">
      {loading && (
        <div className="dash-loading">
          <span className="spinner spinner-dark" /> Loading...
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {!loading && sessions.length === 0 && <EmptyState user={user} />}

      {!loading && sessions.length > 0 && (
        <>
          <WelcomeBanner user={user} />

          <div className="stats-grid">
            <StatCard label="Total Sessions"  value={stats.total}               color="var(--text-primary)"        delay={0}   />
            <StatCard label="Avg Score"       value={stats.avgScore}  unit="/10" color={scoreColor(stats.avgScore)} delay={60}  />
            <StatCard label="Questions Done"  value={stats.totalQs}              color="var(--text-primary)"        delay={120} />
            <StatCard label="Best Score"      value={stats.bestScore} unit="/10" color={scoreColor(stats.bestScore)} delay={180} />
          </div>

          <div className="dash-row">
            <div className="dash-card dash-card-wide">
              <ScoreChart data={chartData} />
            </div>
            <div className="dash-card dash-card-narrow">
              <WeekStreak sessions={sessions} />
            </div>
          </div>

          <div className="dash-card">
            <RecentSessions sessions={sessions} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
