import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_RUBRION_DEV_URL
    : import.meta.env.VITE_RUBRION_API_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
