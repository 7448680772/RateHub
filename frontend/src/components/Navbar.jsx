import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">⭐ RateHub</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 14 }}>Hi, {user?.name}</span>
        {(user?.role === 'user' || user?.role === 'store_owner') && (
          <button
            className="navbar-btn-light"
            onClick={() => navigate('/update-password')}
          >
            Change Password
          </button>
        )}
        <button className="btn-danger" onClick={handleLogout} style={{ fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  );
}