import React, { useState, useEffect } from "react";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import backArrow from "../assets/backarrow.svg";

const benefits = [
  {
    title: 'Practice with Purpose',
    description: `"Interview preparation should never feel random." Prefify generates questions
    tailored to your role, tech stack, and experience level so every practice session moves you
    closer to the job you want.`
  },
  {
    title: 'Feedback that Actually Helps',
    description: `Great answers are built through reflection. Prefify analyzes every response, gives
    you a score, highlights what worked, and shows how you can communicate your ideas more clearly
    and confidently.`
  },
  {
    title: 'Your Resume, Interview Ready',
    description: `Your resume already tells a story — Prefify simply helps you prepare to tell it better.
    It scans your resume, predicts the questions interviewers are likely to ask, and helps you craft thoughtful
    answers in advance.`
  },
  {
    title: 'A Clear Path Forward',
    description: `Preparation becomes easier when you know exactly what to do next. Share your target role
    and timeline, and Prefify builds a structured learning roadmap that guides your progress day by day.`
  }
];

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(formData.email, formData.password);
      if (data.success) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleGitHubAuth = () => {
    window.location.href = 'http://localhost:5000/api/auth/github';
  };

  return (
    <div className="login-container">
      <div className="back-arrow-link" onClick={() => navigate("/")}>
        <img src={backArrow} alt="Back to Home" />
      </div>
      <div className="login-left">
        <div className="auth-card">
          <h2>Login</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="auth-divider"><span>OR</span></div>
          <div className="oauth-buttons">
            <button className="oauth" onClick={handleGoogleAuth}>
              <FcGoogle className="oauth-icon" /> Google
            </button>
            <button className="oauth" onClick={handleGitHubAuth}>
              <FaGithub className="oauth-icon" /> GitHub
            </button>
          </div>
          <p className="auth-footer">Don't have an account? <a href="/signup">Signup</a></p>
        </div>
      </div>

      <div className="login-right">
        <div className="overlay"></div>
        <div className="welcome-content" key={current}>
          <h1>{benefits[current].title}</h1>
          <p>{benefits[current].description}</p>
          <div className="carousel-dots">
            {benefits.map((_, i) => (
              <span key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
