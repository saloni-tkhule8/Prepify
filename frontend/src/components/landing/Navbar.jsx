import { useNavigate } from "react-router-dom";
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate();
  return (
      <nav className="navbar">  
        <div className="navbar-logo">
          <img src={logo} alt="Prepify" />
          <p>Prepify</p>
        </div>
        <div className="navbar-links">
          {['Features', 'How to use', 'Resources', 'About us', 'Contact us'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`}>
              {link}
            </a>
          ))}
        </div>

        <div className="navbar-buttons">
          <button className="navbar-cta" onClick={() => navigate("/signup")}>Get Started</button>
          <button className="login-cta" onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>
  )
}

export default Navbar;
