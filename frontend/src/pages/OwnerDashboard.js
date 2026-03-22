import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerProperties, deleteProperty, getOwnerBookings, approveBooking } from '../services/api';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('properties');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOwnerProperties(), getOwnerBookings()])
      .then(([p, b]) => { setProperties(p.data); setBookings(b.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    await deleteProperty(id);
    setProperties(prev => prev.filter(p => p._id !== id));
  };

  const handleBookingStatus = async (id, status) => {
    await approveBooking(id, status);
    setBookings(prev => prev.map(b => b._id === id ? {...b, status} : b));
  };

  const STATUS_COLORS = {
    pending: { bg: '#faeeda', color: '#854f0b' },
    confirmed: { bg: '#eaf3de', color: '#3b6d11' },
    approved: { bg: '#eaf3de', color: '#3b6d11' },
    rejected: { bg: '#fcebeb', color: '#a32d2d' },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Owner Dashboard</h1>
            <p style={styles.sub}>Manage your properties and bookings</p>
          </div>
          <Link to="/add-property" style={styles.addBtn}>+ Add Property</Link>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { num: properties.length, label: 'Properties' },
            { num: bookings.filter(b => b.status === 'pending').length, label: 'Pending Requests' },
            { num: bookings.filter(b => b.status === 'approved').length, label: 'Active Bookings' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statNum}>{s.num}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['properties', 'bookings'].map(t => (
            <button key={t} style={{...styles.tab, ...(tab === t ? styles.tabActive : {})}}
              onClick={() => setTab(t)}>
              {t === 'properties' ? '🏠 Properties' : '📅 Booking Requests'}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : tab === 'properties' ? (
          <div style={styles.propGrid}>
            {properties.length === 0 ? (
              <div style={styles.empty}>
                <p>No properties yet. <Link to="/add-property" style={{color:'#e8b86d'}}>Add one!</Link></p>
              </div>
            ) : properties.map(p => (
              <div key={p._id} style={styles.propCard}>
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80'}
                  alt={p.title} style={styles.propImg}
                />
                <div style={styles.propBody}>
                  <h3 style={styles.propTitle}>{p.title}</h3>
                  <p style={styles.propLoc}>{p.location}</p>
                  <p style={styles.propPrice}>₹{p.price?.toLocaleString()}/mo</p>

                  {/* Approval Status Badge */}
                  {p.approved ? (
                    <span style={styles.approvedBadge}>✅ Approved — Visible to Tenants</span>
                  ) : (
                    <span style={styles.pendingBadge}>⏳ Pending Admin Approval</span>
                  )}

                  <div style={styles.propActions}>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.bookingList}>
            {bookings.length === 0 ? (
              <p style={styles.loading}>No booking requests yet.</p>
            ) : bookings.map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <div key={b._id} style={styles.bookingCard}>
                  <div style={styles.bookingLeft}>
                    <h4 style={styles.bookingProp}>{b.property?.title}</h4>
                    <p style={styles.bookingTenant}>Tenant: <strong>{b.user?.name || 'Tenant'}</strong></p>
                    <p style={styles.bookingDates}>📍 {b.property?.location}</p>
                    <p style={styles.bookingDates}>💰 ₹{b.property?.price?.toLocaleString()}/mo</p>
                  </div>
                  <div style={styles.bookingRight}>
                    <span style={{...styles.statusPill, background: sc.bg, color: sc.color}}>
                      {b.status}
                    </span>
                    {b.status === 'pending' && (
                      <div style={styles.bookingBtns}>
                        <button style={styles.confirmBtn} onClick={() => handleBookingStatus(b._id, 'approved')}>
                          Approve ✅
                        </button>
                        <button style={styles.rejectBtn} onClick={() => handleBookingStatus(b._id, 'rejected')}>
                          Reject ❌
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '48px 0' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a1a2e', marginBottom: 6 },
  sub: { fontSize: 15, color: '#6b6b80' },
  addBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 15,
    padding: '12px 24px', borderRadius: 50, textDecoration: 'none', border: 'none',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 },
  statCard: {
    background: '#fff', borderRadius: 16, border: '1px solid #e8e8e0',
    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4,
  },
  statNum: { fontSize: 32, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: 13, color: '#6b6b80', fontWeight: 500 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: {
    background: '#f0efe8', color: '#6b6b80', fontWeight: 500, fontSize: 14,
    padding: '10px 20px', borderRadius: 50, border: '1.5px solid transparent', cursor: 'pointer',
  },
  tabActive: { background: '#1a1a2e', color: '#e8b86d', borderColor: '#1a1a2e' },
  loading: { textAlign: 'center', padding: 40, color: '#6b6b80' },
  propGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
  propCard: { background: '#fff', borderRadius: 18, border: '1px solid #e8e8e0', overflow: 'hidden' },
  propImg: { width: '100%', height: 160, objectFit: 'cover' },
  propBody: { padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 },
  propTitle: { fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1a1a2e', marginBottom: 2, fontWeight: 600 },
  propLoc: { fontSize: 13, color: '#6b6b80' },
  propPrice: { fontSize: 17, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  approvedBadge: {
    display: 'inline-block', background: '#eaf3de', color: '#3b6d11',
    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50,
  },
  pendingBadge: {
    display: 'inline-block', background: '#faeeda', color: '#854f0b',
    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50,
  },
  propActions: { display: 'flex', gap: 8, marginTop: 4 },
  deleteBtn: {
    flex: 1, background: '#fcebeb', color: '#a32d2d', fontWeight: 600, fontSize: 13,
    padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
  },
  bookingList: { display: 'flex', flexDirection: 'column', gap: 12 },
  bookingCard: {
    background: '#fff', borderRadius: 16, border: '1px solid #e8e8e0',
    padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 12,
  },
  bookingLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
  bookingProp: { fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1a1a2e', fontWeight: 600 },
  bookingTenant: { fontSize: 13, color: '#6b6b80' },
  bookingDates: { fontSize: 13, color: '#6b6b80' },
  bookingRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  statusPill: { fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50, textTransform: 'capitalize' },
  bookingBtns: { display: 'flex', gap: 8 },
  confirmBtn: {
    background: '#eaf3de', color: '#3b6d11', fontWeight: 600, fontSize: 13,
    padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
  },
  rejectBtn: {
    background: '#fcebeb', color: '#a32d2d', fontWeight: 600, fontSize: 13,
    padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
  },
  empty: { padding: 40, textAlign: 'center', color: '#6b6b80', fontSize: 15 },
};

export default OwnerDashboard;