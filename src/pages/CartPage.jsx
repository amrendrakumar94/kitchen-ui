import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Divider,
    Paper,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Add,
    Remove,
    Delete,
    ShoppingCartOutlined,
    ArrowBack,
} from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartSummary, loading, error, updateQuantity, removeItem } = useCart();

    const handleQuantityChange = async (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        if (newQuantity > 10) return; // Max quantity limit

        await updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = async (productId) => {
        await removeItem(productId);
    };

    const handleContinueShopping = () => {
        navigate(ROUTES.PRODUCTS);
    };

    const handleCheckout = () => {
        // TODO: Navigate to checkout page
        alert('Checkout functionality coming soon!');
    };

    if (loading) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress size={60} />
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleContinueShopping}
                        sx={{ mb: 2 }}
                    >
                        Continue Shopping
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Shopping Cart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'item' : 'items'} in your cart
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Empty Cart State */}
                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 3,
                        }}
                    >
                        <ShoppingCartOutlined sx={{ fontSize: 100, color: 'text.secondary', opacity: 0.5, mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Your cart is empty
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Add some delicious items to get started!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleContinueShopping}
                        >
                            Browse Products
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Cart Items */}
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {cartItems.map((item) => (
                                    <Card key={item.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: { xs: '100%', sm: 150 },
                                                height: { xs: 200, sm: 150 },
                                                objectFit: 'cover',
                                            }}
                                            image={item.productImage}
                                            alt={item.productName}
                                        />
                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {item.productDescription}
                                                    </Typography>
                                                    {!item.inStock && (
                                                        <Typography variant="caption" color="error">
                                                            Out of Stock
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <IconButton
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                                                {/* Quantity Controls */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Remove />
                                                    </IconButton>
                                                    <Typography
                                                        sx={{
                                                            minWidth: 40,
                                                            textAlign: 'center',
                                                            fontWeight: 600,
                                                            fontSize: '1.1rem',
                                                        }}
                                                    >
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                                                        disabled={item.quantity >= 10}
                                                    >
                                                        <Add />
                                                    </IconButton>
                                                </Box>

                                                {/* Price */}
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                                        ₹{item.subtotal.toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ₹{item.price} × {item.quantity}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>

                        {/* Cart Summary */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    position: { md: 'sticky' },
                                    top: { md: 100 },
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                    Order Summary
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Subtotal</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ₹{cartSummary.subtotal.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Tax (9%)</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ₹{cartSummary.tax.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Delivery Charge</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {cartSummary.deliveryCharge === 0 ? (
                                                <span style={{ color: '#48bb78' }}>FREE</span>
                                            ) : (
                                                `₹${cartSummary.deliveryCharge}`
                                            )}
                                        </Typography>
                                    </Box>

                                    {cartSummary.discount > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Discount</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                -₹{cartSummary.discount.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Divider />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Total
                                        </Typography>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                            ₹{cartSummary.total.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    {cartSummary.subtotal > 0 && cartSummary.subtotal < 500 && (
                                        <Alert severity="info" sx={{ mt: 1 }}>
                                            Add ₹{(500 - cartSummary.subtotal).toLocaleString()} more for free delivery!
                                        </Alert>
                                    )}

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={handleCheckout}
                                        sx={{ mt: 2, py: 1.5 }}
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        onClick={handleContinueShopping}
                                    >
                                        Continue Shopping
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </MainLayout>
    );
};

export default CartPage;
