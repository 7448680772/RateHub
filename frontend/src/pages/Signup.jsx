import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const validate = (form) => {
  if (form.name.length < 20 || form.name.length > 60) return 'Name must be 20–60 characters';
  if (form.address.length > 400) return 'Address max 400 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
  if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password))
    return 'Password: 8-16 chars, 1 uppercase, 1 special character';
  return null;
};

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) return setError(err);
    try {
      await api.post('/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: 420 }}>
        <h2 style={{ marginBottom: 8, color: '#1c2d4a' }}>Create Account</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>Join RateHub today</p>
        {error && <p className="text-error" style={{ marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="Full Name (20–60 chars)" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Address (max 400 chars)" value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })} required />
          <input placeholder="Password (8-16 chars, 1 uppercase, 1 special)" type="password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn-primary" style={{ padding: '12px', fontWeight: 600 }}>
            Sign Up
          </button>
        </form>
        <p className="text-muted" style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#1c2d4a', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}