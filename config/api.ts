import axios from 'axios';
import { accessToken, AD_OBJECT_ID } from '../constants';

export const api = axios.create({
  baseURL: `https://graph.facebook.com/v20.0/${AD_OBJECT_ID}`,
});

api.interceptors.request.use((config) => {
  config.params = config.params || {};
  
  config.params.access_token = accessToken;

  return config;
}, (error) => {
  return Promise.reject(error);
});
