import { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import { STORAGE_KEYS } from '../constants';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartSummary, setCartSummary] = useState({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        tax: 0,
        deliveryCharge: 0,
        discount: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart on mount only if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            fetchCart();
        }
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartService.getCart();

            if (response.status === 'success') {
                setCartItems(response.data.items || []);
                setCartSummary(response.data.summary || {
                    totalItems: 0,
                    totalQuantity: 0,
                    subtotal: 0,
                    tax: 0,
                    deliveryCharge: 0,
                    discount: 0,
                    total: 0,
                });
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart');
            // Set empty cart on error
            setCartItems([]);
            setCartSummary({
                totalItems: 0,
                totalQuantity: 0,
                subtotal: 0,
                tax: 0,
                deliveryCharge: 0,
                discount: 0,
                total: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            setError(null);
            const response = await cartService.addToCart(productId, quantity);

            if (response.status === 'success') {
                // Refresh cart
                await fetchCart();
                return { success: true, message: response.message };
            }

            return { success: false, message: response.message || 'Failed to add item' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            setError(null);
            const response = await cartService.updateCartItem(productId, quantity);

            if (response.status === 'success') {
                // Refresh cart
                await fetchCart();
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update quantity';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const removeItem = async (productId) => {
        try {
            setError(null);
            const response = await cartService.removeFromCart(productId);

            if (response.status === 'success') {
                // Refresh cart
                await fetchCart();
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to remove item';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const clearCartItems = async () => {
        try {
            setError(null);
            const response = await cartService.clearCart();

            if (response.status === 'success') {
                setCartItems([]);
                setCartSummary({
                    totalItems: 0,
                    totalQuantity: 0,
                    subtotal: 0,
                    tax: 0,
                    deliveryCharge: 0,
                    discount: 0,
                    total: 0,
                });
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to clear cart';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const value = {
        cartItems,
        cartSummary,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartItems,
        refreshCart: fetchCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
