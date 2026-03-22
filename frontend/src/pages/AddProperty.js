// import { useState } from "react";
// import API from "../services/api";

// function AddProperty() {
//   const [form, setForm] = useState({});

//   const submit = async () => {
//     try {
//       await API.post("/properties", form);
//       alert("Property Added ✅");
//     } catch (error) {
//       console.log(error);
//       alert("Error adding property ❌");
//     }
//   };

//   return (
//     <div>
//       <h2>Add Property</h2>

//       <input
//         placeholder="Title"
//         onChange={e => setForm({ ...form, title: e.target.value })}
//       />

//       <input
//         placeholder="Location"
//         onChange={e => setForm({ ...form, location: e.target.value })}
//       />

//       <input
//         placeholder="Price"
//         onChange={e => setForm({ ...form, price: e.target.value })}
//       />

//       <button onClick={submit}>Add</button>
//     </div>
//   );
// }

// export default AddProperty;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/api';

const TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'];

const AddProperty = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', location: '', price: '',
    type: 'Apartment', bedrooms: '', bathrooms: '', images: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await createProperty({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        images: form.images.filter(i => i.trim()),
      });
      navigate('/owner-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm(f => ({...f, [key]: val}));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/owner-dashboard')}>← Back</button>
          <h1 style={styles.title}>Add New Property</h1>
          <p style={styles.sub}>Fill in the details about your property</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Basic Info</h2>
            <div style={styles.grid2}>
              <div style={styles.field}>
                <label style={styles.label}>Property Title *</label>
                <input style={styles.input} placeholder="e.g. Modern Downtown Apartment"
                  value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <input style={styles.input} placeholder="City, State"
                  value={form.location} onChange={e => set('location', e.target.value)} required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description *</label>
              <textarea style={styles.textarea} rows={4} placeholder="Describe your property..."
                value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Details</h2>
            <div style={styles.grid4}>
              <div style={styles.field}>
                <label style={styles.label}>Monthly Rent ($) *</label>
                <input style={styles.input} type="number" placeholder="2500"
                  value={form.price} onChange={e => set('price', e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Type</label>
                <select style={styles.input} value={form.type} onChange={e => set('type', e.target.value)}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Bedrooms</label>
                <input style={styles.input} type="number" min="0" placeholder="2"
                  value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Bathrooms</label>
                <input style={styles.input} type="number" min="0" placeholder="1"
                  value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Images</h2>
            <p style={styles.hint}>Add image URLs (e.g. from Unsplash)</p>
            {form.images.map((img, i) => (
              <div key={i} style={styles.imgRow}>
                <input style={{...styles.input, flex:1}} placeholder="https://images.unsplash.com/..."
                  value={img} onChange={e => {
                    const imgs = [...form.images];
                    imgs[i] = e.target.value;
                    set('images', imgs);
                  }} />
                {form.images.length > 1 && (
                  <button type="button" style={styles.removeImg}
                    onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}>✕</button>
                )}
              </div>
            ))}
            <button type="button" style={styles.addImgBtn}
              onClick={() => set('images', [...form.images, ''])}>+ Add Image</button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#faf9f6', padding: '48px 0' },
  container: { maxWidth: 800, margin: '0 auto', padding: '0 24px' },
  header: { marginBottom: 36 },
  backBtn: {
    background: 'none', border: 'none', fontSize: 14, fontWeight: 600,
    color: '#6b6b80', cursor: 'pointer', marginBottom: 16, padding: 0,
  },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a1a2e', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b6b80' },
  form: { display: 'flex', flexDirection: 'column', gap: 32 },
  section: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    padding: '28px', display: 'flex', flexDirection: 'column', gap: 18,
  },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a1a2e', fontWeight: 600 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 12, fontWeight: 600, color: '#6b6b80', letterSpacing: '0.07em', textTransform: 'uppercase' },
  input: {
    border: '1.5px solid #e8e8e0', borderRadius: 12, padding: '11px 14px',
    fontSize: 15, color: '#1a1a2e', background: '#faf9f6', width: '100%',
  },
  textarea: {
    border: '1.5px solid #e8e8e0', borderRadius: 12, padding: '11px 14px',
    fontSize: 15, color: '#1a1a2e', background: '#faf9f6', resize: 'vertical', width: '100%',
  },
  hint: { fontSize: 13, color: '#6b6b80' },
  imgRow: { display: 'flex', gap: 8, alignItems: 'center' },
  removeImg: {
    background: '#fcebeb', color: '#a32d2d', border: 'none', borderRadius: 8,
    width: 36, height: 36, fontSize: 14, cursor: 'pointer', flexShrink: 0,
  },
  addImgBtn: {
    background: 'none', border: '1.5px dashed #e8e8e0', color: '#6b6b80',
    padding: '10px', borderRadius: 12, fontSize: 14, fontWeight: 500,
    cursor: 'pointer', width: '100%', transition: 'all 0.2s',
  },
  error: {
    background: '#fcebeb', color: '#a32d2d', padding: '12px 16px',
    borderRadius: 12, fontSize: 14, textAlign: 'center',
  },
  submitBtn: {
    background: '#e8b86d', color: '#1a1a2e', fontWeight: 700, fontSize: 17,
    padding: '15px', borderRadius: 50, border: 'none', cursor: 'pointer',
  },
};

export default AddProperty;