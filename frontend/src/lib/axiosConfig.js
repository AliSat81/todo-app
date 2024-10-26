import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // 'Pragma': 'no-cache',
    // 'If-Modified-Since': '0' 
  },
});

export default axiosInstance;
