// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://www.kitchen.publicvm.com',
    ENDPOINTS: {
        AUTH: '/auth/authenticate/user',
    },
};

// Auth Types
export const AUTH_TYPES = {
    LOGIN: 'login',
    SIGNUP: 'signup',
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    TOKEN_EXPIRY: 'tokenExpiry',
    USER_DATA: 'userData',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/',
    SIGNUP: '/signup',
    PRODUCTS: '/products',
    CART: '/cart',
    ACCOUNT: '/account',
};

// Token expiry time (24 hours in milliseconds)
export const TOKEN_EXPIRY_TIME = 86400000;
