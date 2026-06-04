import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [raters, setRaters] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/user/owner/dashboard')
      .then(res => {
        setStore(res.data.store);
        setRaters(res.data.raters);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Could not load dashboard');
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-wrap">
        <h2 className="page-title">Store Owner Dashboard</h2>
        {error && <p className="text-error">{error}</p>}

        {store && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <p><strong>Store:</strong> {store.name}</p>
            <p style={{ fontSize: 24, marginTop: 8, color: '#b8956a', fontWeight: 700 }}>
              Average Rating: {store.avg_rating || 'No ratings yet'}
            </p>
          </div>
        )}

        <h3 style={{ marginBottom: 12, color: '#1c2d4a' }}>Users who rated your store</h3>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {raters.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.rating}</td>
                </tr>
              ))}
              {raters.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }} className="text-muted">
                    No ratings yet
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