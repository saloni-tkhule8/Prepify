import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import dashboardIcon from '../../assets/dashboard.png';
import interviewIcon from '../../assets/job-interview.png';
import resumeIcon from '../../assets/resume.png';
import roadmapIcon from '../../assets/roadmap.png';
import settingsIcon from '../../assets/settings.png';
import logoutIcon from '../../assets/logout.png';
import './SideBar.css';

const navItems = [
  { label: 'Dashboard',       to: '/dashboard',           icon: dashboardIcon },
  { label: 'AI Interview',    to: '/dashboard/interview', icon: interviewIcon },
  { label: 'Resume Analyzer', to: '/dashboard/resume',    icon: resumeIcon },
  { label: 'Roadmap',         to: '/dashboard/roadmap',   icon: roadmapIcon },
  { label: 'Settings',        to: '/dashboard/settings',  icon: settingsIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Prefify" className="logo-img" />
        <span className="logo-name">Prefify</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <img src={item.icon} alt={item.label} />
            </span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <div className="user-row">
          <div className="user-avatar">U</div>
          <span className="user-name">Username</span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <img src={logoutIcon} alt="Logout" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
