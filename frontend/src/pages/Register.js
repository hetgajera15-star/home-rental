// import { useState } from "react";
// import API from "../services/api";

// function Register() {
//   const [form, setForm] = useState({});

//   const handleRegister = async () => {
//     await API.post("/auth/register", form);
//     alert("Registered");
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
//       <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
//       <input placeholder="Password" onChange={e => setForm({...form, password: e.target.value})}/>
//       <select onChange={e => setForm({...form, role: e.target.value})}>
//         <option value="tenant">Tenant</option>
//         <option value="owner">Owner</option>
//       </select>
//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// }

// export default Register;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'tenant' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      const user = await register(form);
      if (user.role === 'owner') navigate('/owner-dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.top}>
          <Link to="/" style={styles.brand}>⌂ MY</Link>
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.sub}>Join thousands of renters & owners</p>
        </div>

        {/* Role Toggle */}
        <div style={styles.roleToggle}>
          {['tenant', 'owner'].map(r => (
            <button
              key={r} type="button"
              style={{...styles.roleBtn, ...(form.role === r ? styles.roleBtnActive : {})}}
              onClick={() => setForm({...form, role: r})}
            >
              {r === 'tenant' ? '🔍 I want to rent' : '🏠 I own property'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text" style={styles.input}
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" style={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password" style={styles.input}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>

      <div style={styles.bg1}></div>
      <div style={styles.bg2}></div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    position: 'relative', overflow: 'hidden', padding: 24,
  },
  card: {
    background: '#fff', borderRadius: 24, padding: '40px',
    width: '100%', maxWidth: 420, position: 'relative', zIndex: 2,
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
  },
  top: { textAlign: 'center', marginBottom: 24 },
  brand: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700,
    color: '#e8b86d', textDecoration: 'none', display: 'block', marginBottom: 24,
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b6b80' },
  roleToggle: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24,
  },
  roleBtn: {
    padding: '10px 8px', borderRadius: 12, border: '1.5px solid #e8e8e0',
    background: '#faf9f6', fontSize: 13, fontWeight: 500, color: '#6b6b80',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  roleBtnActive: {
    background: '#1a1a2e', color: '#e8b86d', borderColor: '#1a1a2e', fontWeight: 600,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 12, fontWeight: 600, color: '#6b6b80', letterSpacing: '0.07em', textTransform: 'uppercase' },
  input: {
    border: '1.5px solid #e8e8e0', borderRadius: 12, padding: '12px 16px',
    fontSize: 15, color: '#1a1a2e', background: '#faf9f6', width: '100%',
  },
  error: {
    background: '#fcebeb', color: '#a32d2d', fontSize: 14,
    padding: '10px 14px', borderRadius: 10, textAlign: 'center',
  },
  btn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 16,
    padding: '14px', borderRadius: 50, border: 'none', cursor: 'pointer',
    marginTop: 4,
  },
  footer: { textAlign: 'center', fontSize: 14, color: '#6b6b80', marginTop: 24 },
  link: { color: '#e8b86d', fontWeight: 600, textDecoration: 'none' },
  bg1: {
    position: 'absolute', width: 350, height: 350, borderRadius: '50%',
    background: 'rgba(232,184,109,0.08)', top: -80, right: -80,
  },
  bg2: {
    position: 'absolute', width: 250, height: 250, borderRadius: '50%',
    background: 'rgba(232,184,109,0.05)', bottom: -60, left: -60,
  },
};

export default Register;