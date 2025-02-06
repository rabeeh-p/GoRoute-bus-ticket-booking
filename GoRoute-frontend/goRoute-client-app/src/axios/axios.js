import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');

const axiosInstance = axios.create({
  // baseURL: 'http://127.0.0.1:8000/',   
  baseURL: 'https://api.goroute.site/',   
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axiosInstance;

