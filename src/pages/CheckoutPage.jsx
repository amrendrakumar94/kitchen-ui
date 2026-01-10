import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    CreditCard,
    AccountBalanceWallet,
    LocalAtm,
    QrCode2,
    CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { ROUTES } from '../constants';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartSummary, clearCart } = useCart();
    const { placeOrder, loading } = useOrders();

    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [errors, setErrors] = useState({});
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        // Redirect to cart if cart is empty AND order has not been placed
        if (cartItems.length === 0 && !isOrderPlaced) {
            navigate(ROUTES.CART);
        }

        // Load saved address from localStorage if available
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.address) {
            setDeliveryAddress({
                street: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
                zipCode: userData.zipCode || '',
                phone: userData.phone || '',
            });
        }
    }, [cartItems, navigate, isOrderPlaced]);

    const validateForm = () => {
        const newErrors = {};

        if (!deliveryAddress.street.trim()) {
            newErrors.street = 'Street address is required';
        }
        if (!deliveryAddress.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!deliveryAddress.state.trim()) {
            newErrors.state = 'State is required';
        }
        if (!deliveryAddress.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{6}$/.test(deliveryAddress.zipCode)) {
            newErrors.zipCode = 'Invalid ZIP code (6 digits required)';
        }
        if (!deliveryAddress.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(deliveryAddress.phone)) {
            newErrors.phone = 'Invalid phone number (10 digits required)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
            return;
        }

        const orderData = {
            deliveryAddress,
            paymentMethod,
            specialInstructions: specialInstructions.trim(),
        };

        const result = await placeOrder(orderData);

        if (result.success) {
            setIsOrderPlaced(true);
            setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
            await clearCart();
            // Navigate to order confirmation page
            setTimeout(() => {
                navigate(`${ROUTES.ORDER_CONFIRMATION}/${result.data.orderId}`);
            }, 1500);
        } else {
            setSnackbar({ open: true, message: result.message || 'Failed to place order', severity: 'error' });
        }
    };

    const handleAddressChange = (field) => (event) => {
        setDeliveryAddress({ ...deliveryAddress, [field]: event.target.value });
        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const paymentMethods = [
        { value: 'COD', label: 'Cash on Delivery', icon: <LocalAtm /> },
        { value: 'CARD', label: 'Credit/Debit Card', icon: <CreditCard /> },
        { value: 'UPI', label: 'UPI Payment', icon: <QrCode2 /> },
        { value: 'WALLET', label: 'Digital Wallet', icon: <AccountBalanceWallet /> },
    ];

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                    Checkout
                </Typography>

                <Grid container spacing={3}>
                    {/* Left Column - Forms */}
                    <Grid item xs={12} md={8}>
                        {/* Delivery Address */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Delivery Address
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street Address"
                                            value={deliveryAddress.street}
                                            onChange={handleAddressChange('street')}
                                            error={!!errors.street}
                                            helperText={errors.street}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            value={deliveryAddress.city}
                                            onChange={handleAddressChange('city')}
                                            error={!!errors.city}
                                            helperText={errors.city}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State"
                                            value={deliveryAddress.state}
                                            onChange={handleAddressChange('state')}
                                            error={!!errors.state}
                                            helperText={errors.state}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="ZIP Code"
                                            value={deliveryAddress.zipCode}
                                            onChange={handleAddressChange('zipCode')}
                                            error={!!errors.zipCode}
                                            helperText={errors.zipCode}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            value={deliveryAddress.phone}
                                            onChange={handleAddressChange('phone')}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                                        Payment Method
                                    </FormLabel>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        {paymentMethods.map((method) => (
                                            <FormControlLabel
                                                key={method.value}
                                                value={method.value}
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {method.icon}
                                                        <Typography>{method.label}</Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>

                        {/* Special Instructions */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Special Instructions
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Any special delivery instructions? (Optional)"
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column - Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ position: 'sticky', top: 20 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Order Summary
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {cartSummary.totalItems} items
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Subtotal</Typography>
                                        <Typography variant="body2">₹{cartSummary.subtotal?.toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Tax</Typography>
                                        <Typography variant="body2">₹{cartSummary.tax?.toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Delivery Charge</Typography>
                                        <Typography variant="body2">₹{cartSummary.deliveryCharge?.toLocaleString()}</Typography>
                                    </Box>
                                    {cartSummary.discount > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="success.main">Discount</Typography>
                                            <Typography variant="body2" color="success.main">
                                                -₹{cartSummary.discount?.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                        ₹{cartSummary.total?.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                                    onClick={handlePlaceOrder}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    onClick={() => navigate(ROUTES.CART)}
                                    sx={{ mt: 2 }}
                                    disabled={loading}
                                >
                                    Back to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </MainLayout>
    );
};

export default CheckoutPage;
