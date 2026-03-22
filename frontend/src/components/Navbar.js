import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⌂</span>
          <span style={styles.logoText}>My Brothers<span style={styles.logoAccent}>.</span></span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Browse</Link>
          {user?.role === 'owner' && (
            <Link to="/owner-dashboard" style={styles.link}>My Properties</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.link}>Admin</Link>
          )}
          {user && (
            <Link to="/bookings" style={styles.link}>Bookings</Link>
          )}
        </div>

        {/* Auth */}
        <div style={styles.auth}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.userChip}>
                <div style={styles.avatar}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
                <span style={styles.userName}>{user.name}</span>
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline" style={{...styles.authBtn, background:'transparent', color:'#1a1a2e', border:'2px solid #1a1a2e'}}>Login</Link>
              <Link to="/register" className="btn-primary" style={styles.authBtnPrimary}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={{...styles.bar, transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none'}}></span>
          <span style={{...styles.bar, opacity: menuOpen ? 0 : 1}}></span>
          <span style={{...styles.bar, transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none'}}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Browse</Link>
          {user?.role === 'owner' && <Link to="/owner-dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Properties</Link>}
          {user?.role === 'admin' && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user && <Link to="/bookings" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Bookings</Link>}
          {user ? (
            <button style={styles.mobileLogout} onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={{...styles.mobileLink, color:'#e8b86d', fontWeight:'600'}} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(250,249,246,0.92)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #e8e8e0',
  },
  inner: {
    maxWidth: 1200, margin: '0 auto', padding: '0 24px',
    height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
  },
  logoIcon: { fontSize: 22, color: '#e8b86d' },
  logoText: {
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a1a2e',
  },
  logoAccent: { color: '#e8b86d' },
  links: {
    display: 'flex', gap: 32, alignItems: 'center',
  },
  link: {
    fontSize: 15, fontWeight: 500, color: '#1a1a2e',
    textDecoration: 'none', transition: 'color 0.2s',
    position: 'relative',
  },
  auth: { display: 'flex', alignItems: 'center', gap: 12 },
  userChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#f0efe8', borderRadius: 50, padding: '6px 14px 6px 6px',
    textDecoration: 'none',
  },
  avatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: '#e8b86d', color: '#1a1a2e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 13,
  },
  userName: { fontSize: 14, fontWeight: 500, color: '#1a1a2e' },
  logoutBtn: {
    background: 'transparent', border: '1.5px solid #e8e8e0', borderRadius: 50,
    padding: '8px 18px', fontSize: 14, fontWeight: 500, color: '#6b6b80',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  authBtn: {
    padding: '8px 20px', borderRadius: 50, fontSize: 14, fontWeight: 600,
    textDecoration: 'none', transition: 'all 0.2s',
  },
  authBtnPrimary: {
    background: '#e8b86d', color: '#1a1a2e', padding: '8px 20px',
    borderRadius: 50, fontSize: 14, fontWeight: 600, textDecoration: 'none',
    border: '2px solid #e8b86d', transition: 'all 0.2s',
  },
  hamburger: {
    display: 'none', flexDirection: 'column', gap: 5, background: 'none',
    border: 'none', cursor: 'pointer', padding: 4,
    '@media(max-width:768px)': { display: 'flex' },
  },
  bar: {
    width: 22, height: 2, background: '#1a1a2e', borderRadius: 2,
    transition: 'all 0.3s', display: 'block',
  },
  mobileMenu: {
    background: '#fff', borderTop: '1px solid #e8e8e0',
    padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4,
  },
  mobileLink: {
    fontSize: 16, fontWeight: 500, color: '#1a1a2e', textDecoration: 'none',
    padding: '10px 0', borderBottom: '1px solid #f0efe8',
  },
  mobileLogout: {
    background: 'none', border: 'none', fontSize: 16, fontWeight: 500,
    color: '#e24b4a', padding: '10px 0', textAlign: 'left', cursor: 'pointer',
  },
};

export default Navbar;