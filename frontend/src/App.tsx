import { Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { useAuth } from './context/AuthContext';
import LeaderDashboardPage from './pages/leader/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import MyPage from './pages/student/MyPage';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-nitwBlue text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">NITW Clubs & Events</Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-nitwGold">Home</Link>
            {!user && (
              <>
                <Link to="/login" className="hover:text-nitwGold">Login</Link>
                <Link to="/register" className="hover:text-nitwGold">Register</Link>
              </>
            )}
            {user && (
              <>
                <span className="text-sm">{user.name} ({user.role})</span>
                <button className="ml-2 underline" onClick={logout}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leader" element={<LeaderDashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/me" element={<MyPage />} />
        </Routes>
      </main>
      <footer className="bg-gray-100 border-t">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} NIT Warangal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
