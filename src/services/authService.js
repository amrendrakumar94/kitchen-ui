import api from '../utils/api';
import { AUTH_TYPES, STORAGE_KEYS, ROUTES } from '../constants';

const AUTH_ENDPOINT = '/auth/authenticate/user';

// Signup function
export const signup = async (phoneNo, password, name) => {
    try {
        const response = await api.post(AUTH_ENDPOINT, {
            phoneNo,
            password,
            name,
            authType: AUTH_TYPES.SIGNUP,
        });

        if (response.data.status === 'success') {
            // Store user data
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));

            // Auto-login after signup
            return await login(phoneNo, password);
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Signup failed', status: 'error' };
    }
};

// Login function
export const login = async (phoneNo, password) => {
    try {
        const response = await api.post(AUTH_ENDPOINT, {
            phoneNo,
            password,
            authType: AUTH_TYPES.LOGIN,
        });

        if (response.data.status === 'success' && response.data.token) {
            // Store token and expiry
            setToken(response.data.token, response.data.tokenExpire);

            // Store user data from response
            if (response.data.data) {
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.data));
            }
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed', status: 'error' };
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    window.location.href = ROUTES.LOGIN;
};

// Set token with expiry
export const setToken = (token, expiryMs) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    const expiryTime = Date.now() + expiryMs;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
};

// Get token
export const getToken = () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

    if (token && expiry) {
        // Check if token is expired
        if (Date.now() > parseInt(expiry)) {
            logout();
            return null;
        }
        return token;
    }

    return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return getToken() !== null;
};

// Get user data
export const getUserData = () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
};
