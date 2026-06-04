import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function ManageStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStores = () => {
    api.get('/admin/stores', { params: { ...filters, ...sort } }).then(res => setStores(res.data));
  };

  useEffect(() => { fetchStores(); }, [filters, sort]);

  const handleSort = (col) => {
    setSort(s => ({ sortBy: col, order: s.sortBy === col && s.order === 'ASC' ? 'DESC' : 'ASC' }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.length < 20 || form.name.length > 60) return setError('Store name must be 20–60 characters');
    try {
      await api.post('/admin/stores', form);
      setShowAdd(false);
      setForm({ name: '', email: '', address: '' });
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store');
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
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1c2d4a' }}>Manage Stores</span>
          </div>
          <button className="btn-accent" onClick={() => setShowAdd(true)} style={{ padding: '10px 20px' }}>
            + Add Store
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            className="filter-input-wide"
            placeholder="Filter by name"
            value={filters.name}
            onChange={e => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            className="filter-input-wide"
            placeholder="Filter by address"
            value={filters.address}
            onChange={e => setFilters({ ...filters, address: e.target.value })}
          />
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                {['name', 'email', 'address'].map(col => (
                  <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}{arrow(col)}
                  </th>
                ))}
                <th>Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{s.avg_rating ? `⭐ ${s.avg_rating}` : 'No ratings yet'}</td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }} className="text-muted">
                    No stores found
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
              <h3 style={{ marginBottom: 20, color: '#1c2d4a' }}>Add New Store</h3>
              {error && <p className="text-error" style={{ marginBottom: 12 }}>{error}</p>}
              <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder="Store Name (20–60 chars)" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input placeholder="Store Email" type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input placeholder="Address (max 400 chars)" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} required />
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn-accent" style={{ flex: 1, padding: 12 }}>Add Store</button>
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