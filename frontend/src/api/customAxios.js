import axios from 'axios';
import { triggerGlobalError } from '../utils/errorHandler';

const customAxios = axios.create({
  baseURL: 'http://localhost:5000/api',
});

customAxios.interceptors.response.use(
  response => response,
  error => {
    triggerGlobalError(error.response || error); // Pass error globally
    
    return Promise.reject(error);
    
  }
);

export default customAxios;
