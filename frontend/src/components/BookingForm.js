import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createBooking } from '../services/api';

const BookingForm = ({ property }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const nights = (() => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  })();

  const total = nights * (property?.price || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!form.startDate || !form.endDate) return setError('Please select dates');
    if (nights <= 0) return setError('End date must be after start date');
    setLoading(true); setError('');
    try {
      await createBooking({ property: property._id, ...form });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✓</div>
        <h3 style={styles.successTitle}>Booking Requested!</h3>
        <p style={styles.successText}>Your request has been sent to the owner. You'll be notified once it's confirmed.</p>
        <button style={styles.successBtn} onClick={() => navigate('/bookings')}>View My Bookings</button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <span style={styles.price}>₹{property?.price?.toLocaleString()}</span>
          <span style={styles.period}> / month</span>
        </div>
        <div style={styles.ratingBadge}>★ 4.9</div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.dateGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Check-in</label>
            <input
              type="date" style={styles.input}
              min={new Date().toISOString().split('T')[0]}
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Check-out</label>
            <input
              type="date" style={styles.input}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
            />
          </div>
        </div>

        {nights > 0 && (
          <div style={styles.breakdown}>
            <div style={styles.breakdownRow}>
              <span>${property?.price?.toLocaleString()} × {nights} nights</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div style={styles.breakdownRow}>
              <span>Service fee</span>
              <span>${Math.round(total * 0.05).toLocaleString()}</span>
            </div>
            <div style={styles.breakdownTotal}>
              <span>Total</span>
              <span>${(total + Math.round(total * 0.05)).toLocaleString()}</span>
            </div>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Booking...' : user ? 'Reserve Now' : 'Login to Book'}
        </button>

        <p style={styles.note}>You won't be charged yet</p>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    padding: 24, boxShadow: '0 8px 40px rgba(26,26,46,0.12)',
    position: 'sticky', top: 88,
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  price: { fontSize: 26, fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display', serif" },
  period: { fontSize: 15, color: '#6b6b80' },
  ratingBadge: {
    background: '#fef9f0', color: '#c9952a', fontWeight: 600,
    fontSize: 13, padding: '4px 10px', borderRadius: 50,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  dateGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 11, fontWeight: 600, color: '#6b6b80', letterSpacing: '0.08em', textTransform: 'uppercase' },
  input: {
    border: '1.5px solid #e8e8e0', borderRadius: 10, padding: '10px 12px',
    fontSize: 14, color: '#1a1a2e', background: '#faf9f6', width: '100%',
  },
  breakdown: {
    background: '#faf9f6', borderRadius: 12, padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b6b80' },
  breakdownTotal: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 15, fontWeight: 700, color: '#1a1a2e',
    borderTop: '1px solid #e8e8e0', paddingTop: 10, marginTop: 4,
  },
  error: { fontSize: 13, color: '#e24b4a', textAlign: 'center' },
  submitBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 16,
    padding: '14px', borderRadius: 50, border: 'none', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  note: { fontSize: 12, color: '#6b6b80', textAlign: 'center' },
  successBox: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    padding: 32, textAlign: 'center',
  },
  successIcon: {
    width: 60, height: 60, borderRadius: '50%', background: '#eaf3de',
    color: '#3b6d11', fontSize: 28, display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 16px',
  },
  successTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 },
  successText: { fontSize: 14, color: '#6b6b80', lineHeight: 1.6, marginBottom: 20 },
  successBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 600, fontSize: 14,
    padding: '10px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
  },
};

export default BookingForm;