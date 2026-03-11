import React, { useState, useEffect } from "react";
import "./Signup.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import backArrow from "../assets/backarrow.svg";
import { registerUser } from "../services/authService";

const benefits = [
  {
    title: "Walk Into Interviews Confident",
    description: `Interview preparation should replace anxiety with confidence. When you know
    how to structure your answers and explain your experience clearly, interviews stop feeling
    intimidating and start feeling like conversations.`
  },
  {
    title: "Stop Guessing What to Study",
    description: `Many candidates spend weeks preparing without knowing if they are focusing on the
    right things. With the right guidance, every hour you invest in preparation moves you closer to
    the role you want.`
  },
  {
    title: "Turn Your Experience Into Strong Answers",
    description: `You already have the knowledge and projects. The real challenge is explaining them
    clearly under pressure. With the right preparation, your experience becomes your biggest advantage.`
  },
  {
    title: "Prepare Smarter, Not Longer",
    description: `Interview success is not about studying endlessly. It is about practicing the
    right things in the right way so you can show your true potential when the opportunity arrives.`
  }
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % benefits.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(
        formData.username,
        formData.email,
        formData.password
      );

      console.log("Signup response:", data);

      // handle both backend response styles
      if (data.success || data.token) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleGitHubAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
  };

  return (
    <div className="signup-container">
      <div className="back-arrow-link" onClick={() => navigate("/")}>
        <img src={backArrow} alt="Back to Home" />
      </div>

      {/* LEFT SIDE */}
      <div className="signup-left">
        <div className="overlay"></div>

        <div className="welcome-content" key={current}>
          <h1>{benefits[current].title}</h1>
          <p>{benefits[current].description}</p>

          <div className="carousel-dots">
            {benefits.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="signup-right">
        <div className="auth-card">
          <h2>Create Account</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="oauth-buttons">
            <button className="oauth" onClick={handleGoogleAuth}>
              <FcGoogle className="oauth-icon" /> Google
            </button>

            <button className="oauth" onClick={handleGitHubAuth}>
              <FaGithub className="oauth-icon" /> GitHub
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
