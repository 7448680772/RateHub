import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      const role = res.data.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom: 8, color: '#1c2d4a' }}>⭐ RateHub</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>Sign in to your account</p>
        {error && <p className="text-error" style={{ marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn-primary" style={{ padding: '12px', fontWeight: 600 }}>
            Login
          </button>
        </form>
        <p className="text-muted" style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#1c2d4a', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}