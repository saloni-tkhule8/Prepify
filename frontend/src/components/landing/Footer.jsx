import { useNavigate } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-logo">Prepify</p>
          <p className="footer-tagline">
            AI-powered interview preparation for developers who want to land their dream job.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-to-use">How it Works</a>
            <a href="#resources">Resources</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about-us">About Us</a>
            <a href="#contact-us">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Get Started</h4>
            <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Sign Up Free</a>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Prepify. All rights reserved.</p>
        <div className="footer-legal">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
