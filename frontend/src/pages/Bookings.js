// import { useEffect, useState } from "react";
// import API from "../services/api";

// function Bookings() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get("/bookings/my")
//       .then(res => {
//         setData(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   }, []);

//   const pay = async (bookingId, amount) => {
//     try {
//       await API.post("/payments", {
//         booking: bookingId,
//         amount: amount
//       });
//       alert(`Payment of ₹${amount} Done ✅`);
//       window.location.reload();
//     } catch (err) {
//       alert("Payment Failed ❌");
//       console.log(err);
//     }
//   };

//   if (loading) return <p>Loading your bookings...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>My Bookings 🏠</h2>

//       {data.length === 0 && (
//         <p>You have no bookings yet! Go to <a href="/">Home</a> to book a property.</p>
//       )}

//       {data.map(b => (
//         <div key={b._id} style={{
//           border: "1px solid #ccc",
//           margin: "10px",
//           padding: "15px",
//           borderRadius: "8px",
//           background: "#f9f9f9"
//         }}>

//           <h3>🏠 {b.property?.title}</h3>
//           <p>📍 <b>Location:</b> {b.property?.location}</p>
//           <p>💰 <b>Monthly Rent:</b> ₹{b.property?.price}</p>
//           <p>📋 <b>Booking Status:</b>{" "}
//             <span style={{
//               color: b.status === "approved" ? "green" : b.status === "rejected" ? "red" : "orange",
//               fontWeight: "bold"
//             }}>
//               {b.status.toUpperCase()}
//             </span>
//           </p>

//           <hr />

//           {/* Payment Section */}
//           {b.status === "approved" && (
//             <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "5px" }}>
//               <p>✅ <b>Booking Approved!</b> Please complete your payment.</p>
//               <p>💳 <b>Amount to Pay:</b> ₹{b.property?.price}</p>
//               <button
//                 onClick={() => pay(b._id, b.property?.price)}
//                 style={{
//                   background: "green",
//                   color: "white",
//                   padding: "10px 20px",
//                   cursor: "pointer",
//                   borderRadius: "5px",
//                   border: "none",
//                   fontSize: "16px"
//                 }}>
//                 Pay ₹{b.property?.price} Now 💳
//               </button>
//             </div>
//           )}

//           {b.status === "pending" && (
//             <div style={{ background: "#fff3e0", padding: "10px", borderRadius: "5px" }}>
//               <p>⏳ <b>Waiting for Owner Approval...</b></p>
//               <p>Amount: ₹{b.property?.price} (payable after approval)</p>
//             </div>
//           )}

//           {b.status === "rejected" && (
//             <div style={{ background: "#ffebee", padding: "10px", borderRadius: "5px" }}>
//               <p>❌ <b>Booking Rejected by Owner</b></p>
//               <p>You can book another property from <a href="/">Home</a></p>
//             </div>
//           )}

//         </div>
//       ))}
//     </div>
//   );
// }

// export default Bookings;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../services/api';

const STATUS_COLORS = {
  pending:  { bg: '#faeeda', color: '#854f0b' },
  confirmed: { bg: '#eaf3de', color: '#3b6d11' },
  rejected:  { bg: '#fcebeb', color: '#a32d2d' },
  cancelled: { bg: '#f1efe8', color: '#5f5e5a' },
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBookings()
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading bookings...</div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.sub}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

        {bookings.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No bookings yet</h3>
            <p style={styles.emptySub}>Browse properties and make your first booking</p>
            <Link to="/" style={styles.browseBtn}>Browse Properties</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {bookings.map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              const img = b.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&q=80';
              return (
                <div key={b._id} style={styles.card}>
                  <img src={img} alt={b.property?.title} style={styles.cardImg} />
                  <div style={styles.cardBody}>
                    <div style={styles.cardTop}>
                      <h3 style={styles.cardTitle}>{b.property?.title || 'Property'}</h3>
                      <span style={{...styles.statusBadge, background: sc.bg, color: sc.color}}>
                        {b.status}
                      </span>
                    </div>
                    <p style={styles.cardLocation}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {b.property?.location}
                    </p>
                    <div style={styles.dates}>
                      <div style={styles.dateItem}>
                        <span style={styles.dateLabel}>Check-in</span>
                        <span style={styles.dateVal}>{formatDate(b.startDate)}</span>
                      </div>
                      <div style={styles.dateDivider}>→</div>
                      <div style={styles.dateItem}>
                        <span style={styles.dateLabel}>Check-out</span>
                        <span style={styles.dateVal}>{formatDate(b.endDate)}</span>
                      </div>
                    </div>
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
  container: { maxWidth: 800, margin: '0 auto', padding: '0 24px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#1a1a2e', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b6b80', marginBottom: 32 },
  loadingText: { textAlign: 'center', padding: 60, fontSize: 16, color: '#6b6b80' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: {
    background: '#fff', borderRadius: 20, border: '1px solid #e8e8e0',
    display: 'flex', overflow: 'hidden', boxShadow: '0 2px 12px rgba(26,26,46,0.05)',
  },
  cardImg: { width: 130, objectFit: 'cover', flexShrink: 0 },
  cardBody: { padding: '20px 24px', flex: 1 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1a1a2e', fontWeight: 600 },
  statusBadge: {
    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50,
    textTransform: 'capitalize', letterSpacing: '0.04em',
  },
  cardLocation: {
    display: 'flex', alignItems: 'center', gap: 4,
    fontSize: 13, color: '#6b6b80', marginBottom: 14,
  },
  dates: { display: 'flex', alignItems: 'center', gap: 12 },
  dateItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  dateLabel: { fontSize: 10, fontWeight: 600, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: '0.06em' },
  dateVal: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  dateDivider: { color: '#e8b86d', fontWeight: 700, fontSize: 16 },
  empty: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1a1a2e', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#6b6b80', marginBottom: 24 },
  browseBtn: {
    display: 'inline-block', background: '#e8b86d', color: '#1a1a2e',
    fontWeight: 600, fontSize: 15, padding: '12px 28px', borderRadius: 50,
    textDecoration: 'none',
  },
};

export default Bookings;