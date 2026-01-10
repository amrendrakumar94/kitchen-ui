import { createContext, useContext, useState, useCallback } from 'react';
import * as orderService from '../services/orderService';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0,
    });

    /**
     * Place a new order
     */
    /**
     * Place a new order
     */
    const placeOrder = useCallback(async (orderData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.placeOrder(orderData);

            if (response.status === 'success') {
                setCurrentOrder(response.data);
                return { success: true, data: response.data };
            }

            return { success: false, message: response.message || 'Failed to place order' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to place order';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch all orders
     */
    /**
     * Fetch all orders
     */
    const fetchOrders = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.getOrders(params);

            if (response.status === 'success') {
                setOrders(response.data.orders || []);
                setPagination(response.data.pagination || {
                    currentPage: 1,
                    pageSize: 10,
                    totalPages: 1,
                    totalItems: 0,
                });
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch orders';
            setError(errorMessage);
            setOrders([]);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch order details
     */
    /**
     * Fetch order details
     */
    const fetchOrderDetails = useCallback(async (orderId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.getOrderDetails(orderId);

            if (response.status === 'success') {
                setCurrentOrder(response.data);
                return { success: true, data: response.data };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch order details';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Cancel an order
     */
    /**
     * Cancel an order
     */
    const cancelOrder = useCallback(async (orderId, reason) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.cancelOrder(orderId, reason);

            if (response.status === 'success') {
                // Refresh orders list
                await fetchOrders({ page: pagination.currentPage });
                return { success: true };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to cancel order';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, fetchOrders]);

    /**
     * Reorder from a previous order
     */
    /**
     * Reorder from a previous order
     */
    const reorder = useCallback(async (orderId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await orderService.reorderItems(orderId);

            if (response.status === 'success') {
                return { success: true, data: response.data };
            }

            return { success: false, message: response.message };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reorder';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        orders,
        currentOrder,
        loading,
        error,
        pagination,
        placeOrder,
        fetchOrders,
        fetchOrderDetails,
        cancelOrder,
        reorder,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
