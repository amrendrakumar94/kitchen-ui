import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    ArrowBack,
    LocalShipping,
    Restaurant,
    CreditCard,
    LocationOn,
    Receipt,
    Refresh,
    Cancel,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants';

const OrderDetailsPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { fetchOrderDetails, cancelOrder, reorder, loading } = useOrders();
    const { refreshCart } = useCart();

    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadOrder = async () => {
            const result = await fetchOrderDetails(orderId);
            if (result.success) {
                setOrder(result.data);
            } else {
                setError(result.message);
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId, fetchOrderDetails]);

    const handleBack = () => {
        navigate(ROUTES.ORDERS);
    };

    const handleCancelClick = () => {
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancelReason.trim()) return;

        setActionLoading(true);
        const result = await cancelOrder(orderId, cancelReason);
        setActionLoading(false);

        if (result.success) {
            setCancelDialogOpen(false);
            // Refresh order details
            const updated = await fetchOrderDetails(orderId);
            if (updated.success) {
                setOrder(updated.data);
            }
        }
    };

    const handleReorder = async () => {
        setActionLoading(true);
        const result = await reorder(orderId);
        setActionLoading(false);

        if (result.success) {
            await refreshCart();
            navigate(ROUTES.CART);
        }
    };

    if (loading && !order) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
                </Container>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
                        Back to Orders
                    </Button>
                    <Alert severity="error">{error}</Alert>
                </Container>
            </MainLayout>
        );
    }

    if (!order) return null;

    // Order Status Logic
    const steps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const activeStep = {
        'pending': 0,
        'confirmed': 0,
        'preparing': 1,
        'out_for_delivery': 2,
        'delivered': 3,
        'cancelled': -1
    }[order.status] || 0;

    const isCancelled = order.status === 'cancelled';
    const canCancel = order.status === 'pending' || order.status === 'confirmed';

    // Handle field names
    const orderDate = new Date(order.orderDate || order.createdAt || Date.now());
    const subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const tax = order.tax || (subtotal * 0.09);
    const deliveryCharge = order.deliveryCharge !== undefined ? order.deliveryCharge : 40;
    const totalAmount = order.totalAmount || order.total || (subtotal + tax + deliveryCharge);

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
                    Back to Orders
                </Button>

                <Grid container spacing={3}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        {/* Order Header & Status */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Order #{order.orderId || order.orderNumber}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Placed on {orderDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={order.status?.toUpperCase().replace('_', ' ')}
                                        color={isCancelled ? 'error' : 'primary'}
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                {!isCancelled && (
                                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                )}

                                {isCancelled && (
                                    <Alert severity="error" icon={<Cancel fontSize="inherit" />}>
                                        This order was cancelled.
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Restaurant fontSize="small" color="primary" />
                                    Items
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {order.items?.map((item, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                                            <Box
                                                component="img"
                                                src={item.image || item.productImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'}
                                                alt={item.productName || item.name}
                                                sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {item.productName || item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Qty: {item.quantity} × ₹{item.price}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                ₹{(item.quantity * item.price).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        {index < order.items.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        {/* Summary */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Receipt fontSize="small" color="primary" />
                                    Order Summary
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Subtotal</Typography>
                                    <Typography variant="body2">₹{subtotal.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Tax</Typography>
                                    <Typography variant="body2">₹{tax.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2">Delivery</Typography>
                                    <Typography variant="body2">₹{deliveryCharge.toLocaleString()}</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                        ₹{totalAmount.toLocaleString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Delivery & Payment */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOn fontSize="small" color="action" />
                                        Delivery Address
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.deliveryAddress?.street}<br />
                                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br />
                                        {order.deliveryAddress?.zipCode}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CreditCard fontSize="small" color="action" />
                                        Payment Method
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {canCancel && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={handleCancelClick}
                                    disabled={actionLoading}
                                >
                                    Cancel Order
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                fullWidth
                                onClick={handleReorder}
                                disabled={actionLoading}
                            >
                                Reorder Items
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Cancel Dialog */}
                <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>Please tell us why you want to cancel:</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Reason for cancellation..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCancelDialogOpen(false)}>Back</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCancelConfirm}
                            disabled={!cancelReason.trim() || actionLoading}
                        >
                            Confirm Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </MainLayout>
    );
};

export default OrderDetailsPage;
