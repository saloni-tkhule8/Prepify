import { Routes, Route } from "react-router-dom"
import './App.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from './components/ProtectedRoutes';
import Roadmap from "./components/dashboard/Roadmap";
import Resume from "./components/dashboard/Resume";
import Settings from "./components/dashboard/Settings";
import Interview from "./components/dashboard/Interview";

const DashboardHome = () => <p>Dashboard Home</p>

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="interview" element={<Interview />} />
        <Route path="resume" element={<Resume />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App;
