import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, ROUTES } from '../constants';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // The original code had a nested arrow function here, which was likely a mistake.
        // The outer (error) => { ... } is the actual error handler for the interceptor.
        // The inner (error) => { ... } was a function definition that was never called.
        // The fix is to remove the outer (error) => { ... } and keep the inner logic directly
        // within the interceptor's error handler.
        if (error.response?.status === 401) {
            console.error('API 401 Error from:', error.config?.url);
            // Token expired or invalid
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
    }
);

export default api;
