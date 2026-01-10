import { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Divider,
    Grid,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    CheckCircleOutline,
    ShoppingBag,
    Restaurant,
    LocalShipping,
    Payment,
    LocationOn,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useOrders } from '../context/OrderContext';
import { ROUTES } from '../constants';

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { fetchOrderDetails, loading } = useOrders();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                const result = await fetchOrderDetails(orderId);
                if (result.success) {
                    setOrder(result.data);
                } else {
                    // If order not found, redirect to orders page
                    // using setTimeout to allow user to see potential error if needed, 
                    // but standard flow is redirect
                    console.error('Failed to fetch order:', result.message);
                    navigate(ROUTES.ORDERS);
                }
            }
        };

        fetchOrder();
    }, [orderId, fetchOrderDetails, navigate]);

    if (loading || !order) {
        return (
            <MainLayout>
                <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading order details...
                    </Typography>
                </Container>
            </MainLayout>
        );
    }

    // Handle different field names from API
    const orderDate = order.orderDate || order.createdAt || new Date().toISOString();
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 45);

    const subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const tax = order.tax || (subtotal * 0.09); // Fallback 9%
    const deliveryCharge = order.deliveryCharge !== undefined ? order.deliveryCharge : 40; // Fallback
    const totalAmount = order.totalAmount || order.total || (subtotal + tax + deliveryCharge);

    return (
        <MainLayout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Success Header */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                        animation: 'fadeIn 0.5s ease-in',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(-20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    <CheckCircleOutline
                        sx={{
                            fontSize: 100,
                            color: 'success.main',
                            mb: 2,
                            animation: 'scaleIn 0.5s ease-out',
                            '@keyframes scaleIn': {
                                from: { transform: 'scale(0)' },
                                to: { transform: 'scale(1)' },
                            },
                        }}
                    />
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
                        Order Placed Successfully!
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Thank you for your order
                    </Typography>
                </Box>

                {/* Order Number Card */}
                <Card
                    sx={{
                        mb: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    }}
                >
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                    Order Number
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    #{order.orderId || orderId}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                                    Estimated Delivery
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {estimatedDelivery.toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    (30-45 minutes)
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <ShoppingBag color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Order Summary
                            </Typography>
                        </Box>

                        {/* Order Items */}
                        {order.items?.map((item, index) => (
                            <Box key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        py: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                                        <Box
                                            component="img"
                                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'}
                                            alt={item.productName || item.name} // Handle both name fields
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                            }}
                                        />
                                        <Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {item.productName || item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Qty: {item.quantity} × ₹{item.price}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        ₹{(item.quantity * item.price).toLocaleString()}
                                    </Typography>
                                </Box>
                                {index < order.items.length - 1 && <Divider />}
                            </Box>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        {/* Price Breakdown */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Subtotal</Typography>
                                <Typography variant="body2">₹{subtotal.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Tax</Typography>
                                <Typography variant="body2">₹{tax.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Delivery Charge</Typography>
                                <Typography variant="body2">₹{deliveryCharge.toLocaleString()}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Total
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                ₹{totalAmount.toLocaleString()}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Delivery Details */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <LocationOn color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Delivery Address
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {order.deliveryAddress?.street}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {order.deliveryAddress?.zipCode}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Phone: {order.deliveryAddress?.phone}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Payment color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Payment Method
                                    </Typography>
                                </Box>
                                <Chip
                                    label={order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    Status: {order.paymentStatus || 'Pending'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<ShoppingBag />}
                            onClick={() => navigate(`${ROUTES.ORDERS}/${orderId}`)}
                        >
                            View Order Details
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            size="large"
                            startIcon={<Restaurant />}
                            onClick={() => navigate(ROUTES.PRODUCTS)}
                        >
                            Continue Shopping
                        </Button>
                    </Grid>
                </Grid>

                {/* Delivery Info */}
                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        bgcolor: 'info.lighter',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <LocalShipping color="info" sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Your order is being prepared
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            We'll notify you once your order is out for delivery. Track your order status in the Orders section.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </MainLayout>
    );
};

export default OrderConfirmationPage;
