import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust if backend is elsewhere

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json', // No 'Authorization' header in default config?
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Add interceptor for response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      if (typeof window !== 'undefined') {
         // window.location.href = '/login'; // Optional: auto-redirect
      }
    }
    return Promise.reject(error);
  }
);

