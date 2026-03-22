import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../services/api';

const PROPERTY_TYPES = ['All', 'Apartment', 'House', 'Villa', 'Studio', 'Condo'];

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data } = await getProperties();
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = properties.filter(p => {
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'All' || p.type === type;
    const matchPrice = !maxPrice || p.price <= Number(maxPrice);
    return matchSearch && matchType && matchPrice;
  });

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>🏠 Find Your Perfect Home</div>
          <h1 style={styles.heroTitle}>
            Discover Premium<br />
            <span style={styles.heroAccent}>Rental Properties</span>
          </h1>
          <p style={styles.heroSub}>
            Browse thousands of verified listings across the country. Find the home that fits your lifestyle.
          </p>

          {/* Search Bar */}
          <div style={styles.searchBar}>
            <div style={styles.searchField}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b80" strokeWidth="2" style={{flexShrink:0}}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                style={styles.searchInput}
                placeholder="Search by city or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={styles.searchDivider}></div>
            <select style={styles.searchSelect} value={type} onChange={e => setType(e.target.value)}>
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={styles.searchDivider}></div>
            <div style={styles.searchField}>
              <span style={{fontSize:14, color:'#6b6b80', flexShrink:0}}>Max ₹</span>
              <input
                style={{...styles.searchInput, width:90}}
                placeholder="Budget"
                type="number"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
              />
            </div>
            <button style={styles.searchBtn}>Search</button>
          </div>

          {/* Stats */}
          <div style={styles.stats}>
            {[['50+', 'Properties'], ['10+', 'Cities'], ['98%', 'Satisfaction']].map(([num, label]) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statNum}>{num}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
      </section>

      {/* Listings */}
      <section style={styles.listings}>
        <div style={styles.container}>
          <div style={styles.listingsHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Available Properties</h2>
              <p style={styles.sectionSub}>{filtered.length} properties found</p>
            </div>
            {/* Type filter pills */}
            <div style={styles.pills}>
              {PROPERTY_TYPES.map(t => (
                <button
                  key={t}
                  style={{...styles.pill, ...(type === t ? styles.pillActive : {})}}
                  onClick={() => setType(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingGrid}>
              {[1,2,3,4,5,6].map(i => <div key={i} style={styles.skeleton}></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🏚</div>
              <h3 style={styles.emptyTitle}>No properties found</h3>
              <p style={styles.emptySub}>Try adjusting your filters</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    minHeight: '88vh', display: 'flex', alignItems: 'center',
    position: 'relative', overflow: 'hidden', padding: '60px 0',
  },
  heroInner: {
    maxWidth: 800, margin: '0 auto', padding: '0 24px',
    textAlign: 'center', position: 'relative', zIndex: 2,
  },
  heroBadge: {
    display: 'inline-block', background: 'rgba(232,184,109,0.15)',
    border: '1px solid rgba(232,184,109,0.3)', color: '#e8b86d',
    fontSize: 13, fontWeight: 500, padding: '6px 16px', borderRadius: 50, marginBottom: 24,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 700, color: '#fff',
    lineHeight: 1.15, marginBottom: 20,
  },
  heroAccent: { color: '#e8b86d' },
  heroSub: { fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.7 },
  searchBar: {
    background: '#fff', borderRadius: 80, padding: '8px 8px 8px 20px',
    display: 'flex', alignItems: 'center', gap: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    marginBottom: 40, flexWrap: 'wrap',
  },
  searchField: { display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140, padding: '8px 0' },
  searchInput: {
    border: 'none', background: 'transparent', fontSize: 15, color: '#1a1a2e',
    width: '100%', outline: 'none', padding: 0,
  },
  searchSelect: {
    border: 'none', background: 'transparent', fontSize: 15, color: '#1a1a2e',
    padding: '8px 12px', outline: 'none', cursor: 'pointer',
  },
  searchDivider: { width: 1, height: 24, background: '#e8e8e0', margin: '0 4px' },
  searchBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 15,
    padding: '12px 28px', borderRadius: 60, border: 'none', cursor: 'pointer',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  },
  stats: { display: 'flex', justifyContent: 'center', gap: 40 },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  statNum: { fontSize: 24, fontWeight: 700, color: '#e8b86d', fontFamily: "'Playfair Display', serif" },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 },
  circle1: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'rgba(232,184,109,0.06)', top: -100, right: -100,
  },
  circle2: {
    position: 'absolute', width: 300, height: 300, borderRadius: '50%',
    background: 'rgba(232,184,109,0.04)', bottom: -80, left: -60,
  },
  listings: { padding: '60px 0 80px' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  listingsHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 32, flexWrap: 'wrap', gap: 16,
  },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#1a1a2e' },
  sectionSub: { fontSize: 14, color: '#6b6b80', marginTop: 4 },
  pills: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pill: {
    background: '#f0efe8', color: '#6b6b80', fontWeight: 500, fontSize: 13,
    padding: '7px 16px', borderRadius: 50, border: '1.5px solid transparent', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pillActive: { background: '#1a1a2e', color: '#e8b86d', borderColor: '#1a1a2e' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 24,
  },
  skeleton: {
    height: 340, borderRadius: 20, background: '#f0efe8',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  empty: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a1a2e', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#6b6b80' },
};

export default Home;