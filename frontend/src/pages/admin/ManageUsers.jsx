import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsers = () => {
    const params = { ...filters, ...sort };
    api.get('/admin/users', { params }).then(res => setUsers(res.data));
  };

  useEffect(() => { fetchUsers(); }, [filters, sort]);

  const handleSort = (col) => {
    setSort(s => ({ sortBy: col, order: s.sortBy === col && s.order === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.length < 20 || form.name.length > 60) return setError('Name must be 20–60 characters');
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) return setError('Invalid password format');
    try {
      await api.post('/admin/users', form);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  const arrow = (col) => sort.sortBy === col ? (sort.order === 'ASC' ? ' ▲' : ' ▼') : '';

  return (
    <div>
      <Navbar />
      <div className="page-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <button className="btn-outline" onClick={() => navigate('/admin/dashboard')} style={{ marginRight: 12 }}>
              ← Back
            </button>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1c2d4a' }}>Manage Users</span>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)} style={{ padding: '10px 20px' }}>
            + Add User
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {['name', 'email', 'address'].map(f => (
            <input
              key={f}
              className="filter-input"
              placeholder={`Filter by ${f}`}
              value={filters[f]}
              onChange={e => setFilters({ ...filters, [f]: e.target.value })}
            />
          ))}
          <select
            value={filters.role}
            onChange={e => setFilters({ ...filters, role: e.target.value })}
            style={{ width: 150 }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                {['name', 'email', 'address', 'role'].map(col => (
                  <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}{arrow(col)}
                  </th>
                ))}
                <th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td><span className="badge">{u.role}</span></td>
                  <td>{u.avg_rating || (u.role === 'store_owner' ? 'No ratings' : '—')}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }} className="text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAdd && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}>
            <div className="card" style={{ padding: 32, width: 440 }}>
              <h3 style={{ marginBottom: 20, color: '#1c2d4a' }}>Add New User</h3>
              {error && <p className="text-error" style={{ marginBottom: 12 }}>{error}</p>}
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder="Full Name (20–60 chars)" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input placeholder="Address" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} required />
                <input placeholder="Password" type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Normal User</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12 }}>Add User</button>
                  <button type="button" className="btn-outline" onClick={() => { setShowAdd(false); setError(''); }}
                    style={{ flex: 1, padding: 12 }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}