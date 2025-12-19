import api from '../utils/api';

/**
 * Add item to cart
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise} API response with cart data
 */
export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('/api/cart/add', {
            productId,
            quantity,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

/**
 * Get cart items
 * @returns {Promise} API response with cart items and summary
 */
export const getCart = async () => {
    try {
        const response = await api.get('/api/cart');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

/**
 * Update cart item quantity
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise} API response with updated cart
 */
export const updateCartItem = async (productId, quantity) => {
    try {
        const response = await api.put('/api/cart/update', {
            productId,
            quantity,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
};

/**
 * Remove item from cart
 * @param {number} productId - Product ID to remove
 * @returns {Promise} API response
 */
export const removeFromCart = async (productId) => {
    try {
        const response = await api.delete(`/api/cart/remove/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};

/**
 * Clear entire cart
 * @returns {Promise} API response
 */
export const clearCart = async () => {
    try {
        const response = await api.delete('/api/cart/clear');
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};
