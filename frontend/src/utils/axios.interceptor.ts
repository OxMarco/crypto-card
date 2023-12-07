import axios from 'axios';
import { redirect } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:3000', // our API base URL
});
console.log()
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    config.headers['Content-Type'] = 'application/json';
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },

  function (error) {
    if (error.response.status === 401 && window.location.pathname !== '/login') {
      window.location.replace('/login');
      return Promise.reject(error);
    } 
    return error;
  },
);

export default api;
