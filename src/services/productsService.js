import api from '../utils/api';

/**
 * Fetch food items/products from the backend
 * @param {Object} params - Search parameters
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.sortBy - Sort field (name, price, rating, popular)
 * @param {string} params.sortOrder - Sort order (asc, desc)
 * @param {Object} params.filters - Filter criteria
 * @returns {Promise} API response with products and pagination
 */
export const fetchProducts = async (params) => {
    try {
        const response = await api.post('/api/products/search', params);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Search products by query
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise} API response
 */
export const searchProducts = async (query, page = 1, pageSize = 20) => {
    return fetchProducts({
        page,
        pageSize,
        filters: {
            search: query,
        },
    });
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @returns {Promise} API response
 */
export const getProductsByCategory = async (category, page = 1, pageSize = 20) => {
    return fetchProducts({
        page,
        pageSize,
        filters: {
            category,
        },
    });
};

/**
 * Get products with filters
 * @param {Object} filters - Filter object
 * @param {number} page - Page number
 * @param {number} pageSize - Items per page
 * @param {string} sortBy - Sort field
 * @param {string} sortOrder - Sort order
 * @returns {Promise} API response
 */
export const getFilteredProducts = async (filters, page = 1, pageSize = 20, sortBy = 'popular', sortOrder = 'desc') => {
    return fetchProducts({
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters,
    });
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise} API response
 */
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
    }
};
