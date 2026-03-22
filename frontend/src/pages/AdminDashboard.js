import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllProperties, deleteUser, deleteProperty } from '../services/api';
import API from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllProperties()])
      .then(([u, p]) => { setUsers(u.data); setProperties(p.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await deleteProperty(id);
    setProperties(prev => prev.filter(p => p._id !== id));
  };

  const handleApproveProperty = async (id) => {
    await API.put(`/admin/approve-property/${id}`);
    setProperties(prev => prev.map(p => p._id === id ? {...p, approved: true} : p));
    alert('Property Approved ✅');
  };

  const ROLE_COLORS = {
    admin: { bg: '#eeedfe', color: '#3c3489' },
    owner: { bg: '#faeeda', color: '#854f0b' },
    tenant: { bg: '#eaf3de', color: '#3b6d11' },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.sub}>Manage all users and properties</p>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { num: users.length, label: 'Total Users', icon: '👥' },
            { num: properties.length, label: 'Total Properties', icon: '🏠' },
            { num: users.filter(u => u.role === 'owner').length, label: 'Property Owners', icon: '🔑' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={styles.statNum}>{s.num}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['users', 'properties'].map(t => (
            <button key={t} style={{...styles.tab, ...(tab === t ? styles.tabActive : {})}}
              onClick={() => setTab(t)}>
              {t === 'users' ? `👥 Users (${users.length})` : `🏠 Properties (${properties.length})`}
            </button>
          ))}
        </div>

        {loading ? <p style={styles.loading}>Loading...</p> : tab === 'users' ? (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
            </div>
            {users.map(u => {
              const rc = ROLE_COLORS[u.role] || ROLE_COLORS.tenant;
              return (
                <div key={u._id} style={styles.tableRow}>
                  <span style={styles.userName}>
                    <div style={styles.userAvatar}>{u.name?.[0]?.toUpperCase()}</div>
                    {u.name}
                  </span>
                  <span style={styles.userEmail}>{u.email}</span>
                  <span style={{...styles.rolePill, background: rc.bg, color: rc.color}}>{u.role}</span>
                  <button style={styles.delBtn} onClick={() => handleDeleteUser(u._id)}>Delete</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Property</span><span>Location</span><span>Price</span><span>Status</span><span>Actions</span>
            </div>
            {properties.map(p => (
              <div key={p._id} style={styles.tableRow2}>
                <span style={styles.propName}>{p.title}</span>
                <span style={styles.userEmail}>{p.location}</span>
                <span style={styles.propPrice}>₹{p.price?.toLocaleString()}/mo</span>
                <span style={{
                  ...styles.statusBadge,
                  background: p.approved ? '#eaf3de' : '#faeeda',
                  color: p.approved ? '#3b6d11' : '#854f0b'
                }}>
                  {p.approved ? 'Approved ✅' : 'Pending ⏳'}
                </span>
                <div style={{display:'flex', gap:8}}>
                  {!p.approved && (
                    <button style={styles.approveBtn} onClick={() => handleApproveProperty(p._id)}>
                      Approve ✅
                    </button>
                  )}
                  <button style={styles.delBtn} onClick={() => handleDeleteProperty(p._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '48px 0' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a1a2e', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b6b80', marginBottom: 32 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
  statCard: {
    background: '#fff', borderRadius: 16, border: '1px solid #e8e8e0',
    padding: '22px', display: 'flex', flexDirection: 'column', gap: 4,
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statNum: { fontSize: 32, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: 13, color: '#6b6b80', fontWeight: 500 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: {
    background: '#f0efe8', color: '#6b6b80', fontWeight: 500, fontSize: 14,
    padding: '10px 20px', borderRadius: 50, border: '1.5px solid transparent', cursor: 'pointer',
  },
  tabActive: { background: '#1a1a2e', color: '#e8b86d', borderColor: '#1a1a2e' },
  loading: { textAlign: 'center', padding: 40, color: '#6b6b80' },
  table: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0', overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
    padding: '14px 20px', background: '#faf9f6', borderBottom: '1px solid #e8e8e0',
    fontSize: 12, fontWeight: 600, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr',
    padding: '14px 20px', borderBottom: '1px solid #f0efe8',
    alignItems: 'center',
  },
  tableRow2: {
    display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr',
    padding: '14px 20px', borderBottom: '1px solid #f0efe8',
    alignItems: 'center',
  },
  userName: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: '#1a1a2e' },
  userAvatar: {
    width: 32, height: 32, borderRadius: '50%', background: '#e8b86d', color: '#1a1a2e',
    fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userEmail: { fontSize: 13, color: '#6b6b80' },
  rolePill: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 50, width: 'fit-content', textTransform: 'capitalize' },
  propName: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  propPrice: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  statusBadge: {
    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50, width: 'fit-content',
  },
  approveBtn: {
    background: '#eaf3de', color: '#3b6d11', fontWeight: 600, fontSize: 12,
    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
  },
  delBtn: {
    background: '#fcebeb', color: '#a32d2d', fontWeight: 600, fontSize: 12,
    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
    width: 'fit-content',
  },
};

export default AdminDashboard;