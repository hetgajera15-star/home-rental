// =============================================
// NEW FILE: frontend/src/pages/ForgotPassword.js
// 3-step flow: Email → OTP → New Password
// =============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, verifyForgotOtp, resetPassword } from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await verifyForgotOtp({ email, otp });
      setResetToken(data.resetToken);
      setSuccess('OTP verified! Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await resetPassword({ resetToken, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Step indicator */}
        <div style={styles.steps}>
          {['Email', 'OTP', 'New Password'].map((label, i) => (
            <div key={i} style={styles.stepItem}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? '#22c55e' : step === i + 1 ? '#4f46e5' : '#e5e7eb',
                color: step >= i + 1 ? '#fff' : '#9ca3af'
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '12px', color: step === i + 1 ? '#4f46e5' : '#9ca3af' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <h2 style={styles.title}>Forgot Password</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label style={styles.label}>Enter your registered email</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label style={styles.label}>Enter OTP sent to {email}</label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{ ...styles.input, letterSpacing: '8px', fontSize: '20px', textAlign: 'center' }}
              required
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <p style={styles.resend} onClick={() => { setStep(1); setError(''); setSuccess(''); }}>
              ← Change email
            </p>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p style={styles.back} onClick={() => navigate('/login')}>
          ← Back to Login
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
    maxWidth: '400px'
  },
  steps: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
    alignItems: 'center'
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flex: 1
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '20px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
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
    marginBottom: '12px'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  successMsg: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  resend: { textAlign: 'center', color: '#4f46e5', cursor: 'pointer', fontSize: '13px' },
  back: { textAlign: 'center', color: '#4f46e5', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }
};

export default ForgotPassword;
