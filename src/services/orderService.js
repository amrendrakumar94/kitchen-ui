import api from '../utils/api';

/**
 * Place a new order from cart
 * @param {Object} orderData - Order details
 * @param {Object} orderData.deliveryAddress - Delivery address
 * @param {string} orderData.paymentMethod - Payment method (COD, CARD, UPI, WALLET)
 * @param {string} orderData.specialInstructions - Special delivery instructions
 * @returns {Promise<Object>} Order response
 */
export const placeOrder = async (orderData) => {
    try {
        const response = await api.post('/api/orders/place', orderData);
        return response.data;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
};

/**
 * Get all orders for the authenticated user
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Number of orders per page
 * @param {string} params.status - Filter by status
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc, desc)
 * @returns {Promise<Object>} Orders list with pagination
 */
export const getOrders = async (params = {}) => {
    try {
        const { page = 1, pageSize = 10, status, sortBy = 'orderDate', sortOrder = 'desc' } = params;

        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortOrder,
        });

        if (status) {
            queryParams.append('status', status);
        }

        const response = await api.get(`/api/orders?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

/**
 * Get details of a specific order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await api.put(`/api/orders/${orderId}/cancel`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error cancelling order:', error);
        throw error;
    }
};

/**
 * Reorder items from a previous order
 * @param {string} orderId - Order ID to reorder from
 * @returns {Promise<Object>} Reorder response
 */
export const reorderItems = async (orderId) => {
    try {
        const response = await api.post(`/api/orders/${orderId}/reorder`);
        return response.data;
    } catch (error) {
        console.error('Error reordering:', error);
        throw error;
    }
};
