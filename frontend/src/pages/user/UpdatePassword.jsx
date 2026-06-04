import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const pwdRule = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!pwdRule.test(form.newPassword)) {
      return setError('New password: 8-16 chars, 1 uppercase, 1 special character');
    }

    try {
      await api.put('/auth/update-password', form);
      setSuccess('Password updated!');
      setTimeout(() => {
        if (user.role === 'user') navigate('/stores');
        else navigate('/owner/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ padding: 32, width: 400 }}>
          <h2 className="page-title" style={{ marginBottom: 16 }}>Change Password</h2>
          {error && <p className="text-error">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            <input
              type="password"
              placeholder="Current password"
              value={form.currentPassword}
              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="New password (8-16, 1 upper, 1 special)"
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary" style={{ padding: 12 }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}