import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/coco_tours/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage'); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;