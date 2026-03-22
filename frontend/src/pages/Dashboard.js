import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on role automatically
    if (user?.role === 'owner') {
      navigate('/owner-dashboard');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Tenant Dashboard
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1 style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}! 👋</h1>
            <p style={styles.sub}>Welcome to your tenant dashboard</p>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.card} onClick={() => navigate('/bookings')}>
            <div style={styles.cardIcon}>📅</div>
            <h3 style={styles.cardTitle}>My Bookings</h3>
            <p style={styles.cardDesc}>View and manage your rental bookings</p>
            <span style={styles.cardArrow}>→</span>
          </div>
          <div style={styles.card} onClick={() => navigate('/')}>
            <div style={styles.cardIcon}>🔍</div>
            <h3 style={styles.cardTitle}>Browse Properties</h3>
            <p style={styles.cardDesc}>Explore available rentals near you</p>
            <span style={styles.cardArrow}>→</span>
          </div>
          <div style={{...styles.card, cursor: 'default'}}>
            <div style={styles.cardIcon}>👤</div>
            <h3 style={styles.cardTitle}>Profile</h3>
            <p style={styles.cardDesc}>{user?.email}</p>
            {/* FIX: Show actual role not hardcoded "Tenant" */}
            <span style={{...styles.cardArrow, background: '#f0efe8', color: '#6b6b80', textTransform: 'capitalize'}}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '48px 0' },
  container: { maxWidth: 900, margin: '0 auto', padding: '0 24px' },
  header: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 },
  avatar: {
    width: 64, height: 64, borderRadius: '50%', background: '#e8b86d',
    color: '#1a1a2e', fontSize: 26, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  greeting: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1a1a2e', marginBottom: 4 },
  sub: { fontSize: 15, color: '#6b6b80' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 },
  card: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    padding: 28, color: 'inherit', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s',
    boxShadow: '0 2px 12px rgba(26,26,46,0.05)',
  },
  cardIcon: { fontSize: 28, marginBottom: 4 },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#1a1a2e', fontWeight: 600 },
  cardDesc: { fontSize: 14, color: '#6b6b80', lineHeight: 1.5, flex: 1 },
  cardArrow: {
    display: 'inline-block', background: '#e8b86d', color: '#1a1a2e',
    fontWeight: 700, fontSize: 13, padding: '5px 14px', borderRadius: 50,
    marginTop: 8, width: 'fit-content',
  },
};

export default Dashboard;