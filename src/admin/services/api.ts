import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
    : 'https://final-portfolio-backend-ten.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add authorization bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shahid_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
