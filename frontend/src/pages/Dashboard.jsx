import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/SideBar.jsx';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;