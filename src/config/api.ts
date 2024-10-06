import axios from 'axios'
import * as dotenv from 'dotenv';
dotenv.config();

export const facebookApiConfig = axios.create({
  baseURL: `https://graph.facebook.com/v20.0`,
})

facebookApiConfig.interceptors.request.use(
  (config) => {
    config.params = config.params || {}
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const strapiApiConfig = axios.create({
  baseURL: `${process.env.SERVER_URL}/api`,
})
