import axios from 'axios';

// Default to localhost for development, but customizable via env
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If using cookies
});

// Add interceptor to attach token if we use localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
        // If your backend expects a token, attach it here. 
        // Current backend seems to rely on session or just user ID in body/query.
        // We will implement logic as needed.
    }
  }
  return config;
});

export default api;
