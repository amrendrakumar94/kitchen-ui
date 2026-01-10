import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Pagination,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    ShoppingBag,
    LocalShipping,
    CheckCircle,
    Cancel,
    Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { orders, loading, error, pagination, fetchOrders, cancelOrder, reorder } = useOrders();
    const { refreshCart } = useCart();
    const [page, setPage] = useState(1);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadOrders(page);
    }, [page]);

    const loadOrders = async (pageNum) => {
        await fetchOrders({ page: pageNum, pageSize: 10 });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelClick = (order) => {
        setSelectedOrder(order);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedOrder || !cancelReason.trim()) {
            return;
        }

        setActionLoading(true);
        const result = await cancelOrder(selectedOrder.orderId, cancelReason);
        setActionLoading(false);

        if (result.success) {
            setSnackbar({ open: true, message: 'Order cancelled successfully', severity: 'success' });
            setCancelDialogOpen(false);
            setCancelReason('');
            setSelectedOrder(null);
        } else {
            setSnackbar({ open: true, message: result.message || 'Failed to cancel order', severity: 'error' });
        }
    };

    const handleReorder = async (orderId) => {
        setActionLoading(true);
        const result = await reorder(orderId);
        setActionLoading(false);

        if (result.success) {
            setSnackbar({ open: true, message: 'Items added to cart!', severity: 'success' });
            await refreshCart();
            navigate(ROUTES.CART);
        } else {
            setSnackbar({ open: true, message: result.message || 'Failed to reorder', severity: 'error' });
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: 'warning',
            confirmed: 'info',
            preparing: 'info',
            out_for_delivery: 'primary',
            delivered: 'success',
            cancelled: 'error',
        };
        return statusColors[status] || 'default';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <ShoppingBag />,
            confirmed: <CheckCircle />,
            preparing: <ShoppingBag />,
            out_for_delivery: <LocalShipping />,
            delivered: <CheckCircle />,
            cancelled: <Cancel />,
        };
        return icons[status] || <ShoppingBag />;
    };

    const canCancelOrder = (status) => {
        return status === 'pending' || status === 'confirmed';
    };

    const OrderCard = ({ order }) => (
        <Card sx={{ mb: 3, '&:hover': { boxShadow: 6 } }}>
            <CardContent>
                {/* Order Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Order #{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(order.orderDate).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}
                        </Typography>
                    </Box>
                    <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(order.status)}
                        size="small"
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Order Items */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {order.items?.slice(0, 3).map((item, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.productName}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {item.productName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Qty: {item.quantity} × ₹{item.price}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                    {order.items?.length > 3 && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary">
                                +{order.items.length - 3} more items
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Order Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Total Amount
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            ₹{order.total?.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {canCancelOrder(order.status) && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleCancelClick(order)}
                                disabled={actionLoading}
                            >
                                Cancel Order
                            </Button>
                        )}
                        {order.status === 'delivered' && (
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                size="small"
                                onClick={() => handleReorder(order.orderId)}
                                disabled={actionLoading}
                            >
                                Reorder
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate(`${ROUTES.ORDERS}/${order.orderId}`)}
                        >
                            View Details
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Page Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        My Orders
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track and manage your orders
                    </Typography>
                </Box>

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Loading State */}
                {loading && !orders.length ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : orders.length === 0 ? (
                    /* Empty State */
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No orders yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Start shopping to see your orders here
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate(ROUTES.PRODUCTS)}
                        >
                            Browse Products
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Orders List */}
                        {orders.map((order) => (
                            <OrderCard key={order.orderId} order={order} />
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </>
                )}

                {/* Cancel Order Dialog */}
                <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Are you sure you want to cancel this order? Please provide a reason.
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Cancellation Reason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="e.g., Changed my mind, ordered by mistake"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCancelDialogOpen(false)} disabled={actionLoading}>
                            Keep Order
                        </Button>
                        <Button
                            onClick={handleCancelConfirm}
                            color="error"
                            variant="contained"
                            disabled={!cancelReason.trim() || actionLoading}
                        >
                            {actionLoading ? <CircularProgress size={24} /> : 'Cancel Order'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </MainLayout>
    );
};

export default OrdersPage;
