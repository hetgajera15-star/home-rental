import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getProperty(id)
      .then(res => setProperty(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'tenant') return alert('Only tenants can book properties!');
    try {
      setBooking(true);
      await API.post('/bookings', { property: id });
      alert('Booking Requested ✅ Wait for Owner Approval!');
      navigate('/bookings');
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed ❌');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!property) return <div style={styles.center}>Property not found!</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Back Button */}
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Back to Listings</button>

        {/* Image */}
        <div style={styles.imgWrap}>
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
            alt={property.title}
            style={styles.img}
          />
        </div>

        <div style={styles.content}>
          {/* Left Side - Details */}
          <div style={styles.left}>
            <span style={styles.typeBadge}>{property.type || 'Apartment'}</span>
            <h1 style={styles.title}>{property.title}</h1>
            <p style={styles.location}>📍 {property.location}</p>

            {/* Features */}
            <div style={styles.features}>
              {property.bedrooms !== undefined && (
                <div style={styles.feat}>
                  <span style={styles.featNum}>{property.bedrooms}</span>
                  <span style={styles.featLabel}>Bedrooms</span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div style={styles.feat}>
                  <span style={styles.featNum}>{property.bathrooms}</span>
                  <span style={styles.featLabel}>Bathrooms</span>
                </div>
              )}
              <div style={styles.feat}>
                <span style={styles.featNum}>₹{property.price?.toLocaleString()}</span>
                <span style={styles.featLabel}>Per Month</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>About this property</h3>
                <p style={styles.desc}>{property.description}</p>
              </div>
            )}

            {/* Owner Info */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Property Owner</h3>
              <p style={styles.ownerName}>👤 {property.owner?.name || 'Owner'}</p>
              <p style={styles.ownerEmail}>✉️ {property.owner?.email || ''}</p>
            </div>
          </div>

          {/* Right Side - Booking Card */}
          <div style={styles.right}>
            <div style={styles.bookCard}>
              <div style={styles.priceRow}>
                <span style={styles.price}>₹{property.price?.toLocaleString()}</span>
                <span style={styles.period}>/month</span>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoRow}>
                  <span>📍 Location</span>
                  <span>{property.location}</span>
                </div>
                <div style={styles.infoRow}>
                  <span>🏠 Type</span>
                  <span>{property.type || 'Apartment'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span>✅ Available</span>
                  <span>{property.available ? 'Yes' : 'No'}</span>
                </div>
                <div style={styles.infoRow}>
                  <span>💰 Monthly Rent</span>
                  <span style={{fontWeight:700, color:'#1a1a2e'}}>₹{property.price?.toLocaleString()}</span>
                </div>
              </div>

              {user?.role === 'tenant' && (
                <button
                  style={styles.bookBtn}
                  onClick={handleBook}
                  disabled={booking}>
                  {booking ? 'Booking...' : `Book Now — ₹${property.price?.toLocaleString()}/mo`}
                </button>
              )}

              {!user && (
                <button style={styles.bookBtn} onClick={() => navigate('/login')}>
                  Login to Book 🔑
                </button>
              )}

              {user?.role === 'owner' && (
                <p style={styles.ownerNote}>You are viewing as Owner</p>
              )}

              {user?.role === 'admin' && (
                <p style={styles.ownerNote}>You are viewing as Admin</p>
              )}

              <p style={styles.note}>No payment charged until owner approves</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '32px 0 80px' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  center: { textAlign: 'center', padding: 80, fontSize: 18, color: '#6b6b80' },
  backBtn: {
    background: 'none', border: 'none', fontSize: 14, fontWeight: 600,
    color: '#6b6b80', cursor: 'pointer', marginBottom: 24, padding: 0,
  },
  imgWrap: { borderRadius: 20, overflow: 'hidden', marginBottom: 32, height: 400 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  content: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' },
  left: { display: 'flex', flexDirection: 'column', gap: 20 },
  typeBadge: {
    display: 'inline-block', background: '#f0efe8', color: '#1a1a2e',
    fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 50,
    textTransform: 'uppercase', letterSpacing: '0.06em', width: 'fit-content',
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#1a1a2e', fontWeight: 700 },
  location: { fontSize: 16, color: '#6b6b80', fontWeight: 500 },
  features: { display: 'flex', gap: 24 },
  feat: {
    display: 'flex', flexDirection: 'column', gap: 4,
    background: '#fff', borderRadius: 14, border: '1px solid #e8e8e0',
    padding: '14px 20px', minWidth: 90,
  },
  featNum: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  featLabel: { fontSize: 12, color: '#6b6b80', fontWeight: 500 },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a1a2e', fontWeight: 600 },
  desc: { fontSize: 15, color: '#6b6b80', lineHeight: 1.7 },
  ownerName: { fontSize: 15, color: '#1a1a2e', fontWeight: 500 },
  ownerEmail: { fontSize: 14, color: '#6b6b80' },
  right: { position: 'sticky', top: 88 },
  bookCard: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    padding: 24, boxShadow: '0 8px 40px rgba(26,26,46,0.10)',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 4 },
  price: { fontSize: 32, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  period: { fontSize: 15, color: '#6b6b80' },
  infoBox: {
    background: '#faf9f6', borderRadius: 12, padding: 16,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 14, color: '#6b6b80',
  },
  bookBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 16,
    padding: '14px', borderRadius: 50, border: 'none', cursor: 'pointer',
    width: '100%',
  },
  ownerNote: { textAlign: 'center', fontSize: 13, color: '#6b6b80' },
  note: { textAlign: 'center', fontSize: 12, color: '#6b6b80' },
};

export default PropertyDetail;