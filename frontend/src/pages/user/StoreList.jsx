import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const [msg, setMsg] = useState('');

  const loadStores = () => {
    api.get('/stores', { params: { ...search, ...sort } })
      .then(res => setStores(res.data))
      .catch(() => setMsg('Failed to load stores'));
  };

  useEffect(() => { loadStores(); }, [search, sort]);

  const handleSort = (col) => {
    setSort(s => ({
      sortBy: col,
      order: s.sortBy === col && s.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const submitRating = async (storeId, rating) => {
    if (rating < 1 || rating > 5) return setMsg('Rating must be 1 to 5');
    try {
      await api.post('/stores/rate', { store_id: storeId, rating: Number(rating) });
      setMsg('Rating saved!');
      loadStores();
    } catch {
      setMsg('Could not save rating');
    }
  };

  const arrow = (col) =>
    sort.sortBy === col ? (sort.order === 'ASC' ? ' ▲' : ' ▼') : '';

  return (
    <div>
      <Navbar />
      <div className="page-wrap">
        <h2 className="page-title">All Stores</h2>
        {msg && <p className="text-info" style={{ marginBottom: 12 }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            className="filter-input-wide"
            placeholder="Search by name"
            value={search.name}
            onChange={e => setSearch({ ...search, name: e.target.value })}
          />
          <input
            className="filter-input-wide"
            placeholder="Search by address"
            value={search.address}
            onChange={e => setSearch({ ...search, address: e.target.value })}
          />
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Store Name{arrow('name')}
                </th>
                <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                  Address{arrow('address')}
                </th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Give Rating (1-5)</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>{store.avg_rating || 'No ratings'}</td>
                  <td>{store.user_rating || '—'}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      defaultValue={store.user_rating || ''}
                      style={{ width: 60, marginRight: 8 }}
                      id={`rate-${store.id}`}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => {
                        const val = document.getElementById(`rate-${store.id}`).value;
                        submitRating(store.id, val);
                      }}
                      style={{ padding: '6px 12px' }}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
              {stores.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }} className="text-muted">
                    No stores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}