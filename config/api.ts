import axios from 'axios';

export const api = axios.create({
  baseURL: `https://graph.facebook.com/v20.0`,
});

api.interceptors.request.use((config) => {
  config.params = config.params || {};
  return config;
}, (error) => {
  return Promise.reject(error);
});
