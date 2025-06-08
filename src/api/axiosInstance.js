import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://reservatec-tesis-backend-8asuen-298379-31-220-104-112.traefik.me/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agrega token automáticamente si existe
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const token = auth.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
