import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://home-rental-vrbh.onrender.com/api',
  baseURL: 'https://home-rental-ew53.vercel.app/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// =============================================
// ADD these lines to your existing frontend/src/services/api.js
// (add after the existing registerUser export)
// =============================================

// OTP - Register flow
export const verifyRegisterOtp = (data) => API.post('/auth/verify-register', data);

// Forgot Password flow
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const verifyForgotOtp = (data) => API.post('/auth/verify-forgot-otp', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);


// Properties
export const getProperties = (params) => API.get('/properties', { params });
export const getProperty = (id) => API.get(`/properties/${id}`);
export const createProperty = (data) => API.post('/properties', data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);
export const getOwnerProperties = () => API.get('/properties/owner');

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/my');
export const getOwnerBookings = () => API.get('/bookings/owner');
export const approveBooking = (id) => API.put(`/bookings/approve/${id}`);

// Payments
export const makePayment = (data) => API.post('/payments', data);

// Admin
export const getAllUsers = () => API.get('/admin/users');
export const getAllProperties = () => API.get('/properties/all');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;