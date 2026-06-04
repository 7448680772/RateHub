import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setStats(res.data));
  }, []);

  const statCard = (label, value, color) => (
    <div className="card" style={{ padding: 32, flex: 1, borderTop: `4px solid ${color}` }}>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 700, color }}>{value}</p>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="page-wrap">
        <h2 className="page-title">Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {statCard('Total Users', stats.totalUsers, '#1c2d4a')}
          {statCard('Total Stores', stats.totalStores, '#b8956a')}
          {statCard('Total Ratings', stats.totalRatings, '#2d4a6f')}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/admin/users')}
            style={{ padding: '12px 24px' }}
          >
            Manage Users
          </button>
          <button
            className="btn-accent"
            onClick={() => navigate('/admin/stores')}
            style={{ padding: '12px 24px' }}
          >
            Manage Stores
          </button>
        </div>
      </div>
    </div>
  );
}