import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const { _id, title, location, price, images, type, bedrooms, bathrooms, isBooked } = property;
  const img = images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80';

  return (
    <Link to={`/property/${_id}`} style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={img} alt={title} style={styles.img} />
        <div style={styles.badge}>{type || 'Apartment'}</div>
        <div style={styles.overlay}></div>

        {/* Booked/Available badge on image */}
        {isBooked ? (
          <div style={styles.bookedTag}>🔴 Booked</div>
        ) : (
          <div style={styles.availableTag}>🟢 Available</div>
        )}
      </div>
      <div style={styles.body}>
        <div style={styles.meta}>
          <span style={styles.location}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {location}
          </span>
        </div>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.features}>
          {bedrooms !== undefined && (
            <span style={styles.feat}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {bedrooms} bed
            </span>
          )}
          {bathrooms !== undefined && (
            <span style={styles.feat}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16"/><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/>
                <path d="M4 18h16"/><path d="M4 22h16"/>
              </svg>
              {bathrooms} bath
            </span>
          )}
        </div>
        <div style={styles.footer}>
          <div style={styles.price}>
            <span style={styles.amount}>₹{price?.toLocaleString()}</span>
            <span style={styles.period}>/mo</span>
          </div>
          {isBooked ? (
            <span style={styles.bookedCta}>Booked 🔴</span>
          ) : (
            <span style={styles.cta}>View →</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: 'block', textDecoration: 'none', color: 'inherit',
    background: '#fff', borderRadius: 20, overflow: 'hidden',
    border: '1px solid #e8e8e0',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: '0 2px 12px rgba(26,26,46,0.06)',
  },
  imgWrap: { position: 'relative', height: 200, overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(26,26,46,0.25), transparent)',
  },
  badge: {
    position: 'absolute', top: 12, left: 12,
    background: 'rgba(250,249,246,0.92)', backdropFilter: 'blur(8px)',
    color: '#1a1a2e', fontSize: 11, fontWeight: 600,
    padding: '4px 10px', borderRadius: 50, letterSpacing: '0.05em', textTransform: 'uppercase',
  },
  bookedTag: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(220,53,69,0.9)', color: '#fff',
    fontSize: 11, fontWeight: 700,
    padding: '4px 10px', borderRadius: 50,
  },
  availableTag: {
    position: 'absolute', top: 12, right: 12,
    background: 'rgba(40,167,69,0.9)', color: '#fff',
    fontSize: 11, fontWeight: 700,
    padding: '4px 10px', borderRadius: 50,
  },
  body: { padding: '16px 18px 18px' },
  meta: { marginBottom: 6 },
  location: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 12, color: '#6b6b80', fontWeight: 500,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 10,
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  features: { display: 'flex', gap: 12, marginBottom: 14 },
  feat: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 12, color: '#6b6b80', fontWeight: 500,
  },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { display: 'flex', alignItems: 'baseline', gap: 2 },
  amount: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  period: { fontSize: 13, color: '#6b6b80' },
  cta: {
    fontSize: 13, fontWeight: 600, color: '#e8b86d',
    background: '#fef9f0', padding: '6px 14px', borderRadius: 50,
  },
  bookedCta: {
    fontSize: 13, fontWeight: 600, color: '#a32d2d',
    background: '#fcebeb', padding: '6px 14px', borderRadius: 50,
  },
};

export default PropertyCard;