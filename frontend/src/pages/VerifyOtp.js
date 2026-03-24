// =============================================
// NEW FILE: frontend/src/pages/VerifyOtp.js
// This page appears after Register form is submitted
// =============================================

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyRegisterOtp } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  // Email passed via navigate state from Register page
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await verifyRegisterOtp({ email, otp });

      // Auto-login: save token and user
      const decoded = jwtDecode(data.token);
      const userData = {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'owner') navigate('/owner-dashboard');
      else navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>
        <p style={styles.subtitle}>
          We sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Verifying...' : 'Verify & Create Account'}
          </button>
        </form>

        <p style={styles.back} onClick={() => navigate('/register')}>
          ← Back to Register
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5'
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center'
  },
  title: { marginBottom: '8px', color: '#333' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '20px',
    textAlign: 'center',
    letterSpacing: '8px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  back: {
    color: '#4f46e5',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default VerifyOtp;
