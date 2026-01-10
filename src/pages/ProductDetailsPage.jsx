import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Rating,
    Chip,
    Divider,
    IconButton,
    Paper,
    Skeleton,
    Alert,
    Avatar,
    TextField,
    Tabs,
    Tab,
    CircularProgress,
    Snackbar
} from '@mui/material';
import {
    Add,
    Remove,
    ShoppingCart,
    FavoriteBorder,
    Share,
    ArrowBack,
    AccessTime,
    Restaurant,
    LocalFireDepartment
} from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import { getProductById } from '../services/productsService';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants';

// Tab Panel Component
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, cartItems } = useCart();

    // Initialize with state if available
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Check if item is already in cart
    const cartItem = cartItems.find(item => item.productId === id || (product && item.productId === product.id));
    const isInCart = !!cartItem;

    useEffect(() => {
        // If we already have the product from state, we don't need to fetch immediately
        if (product) {
            setLoading(false);
            return;
        }

        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                // Fetch product data
                const data = await getProductById(id);
                setProduct(data);

                // Reset quantity if in cart
                if (cartItem) {
                    setQuantity(cartItem.quantity);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
                setError('Failed to load product details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id, cartItem, product]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            const result = await addToCart(product.id, quantity);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: `Added ${quantity} ${product.name} to cart`,
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'Failed to add to cart',
                    severity: 'error'
                });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'An error occurred while adding to cart',
                severity: 'error'
            });
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate(ROUTES.CART);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="text" height={60} width="80%" />
                            <Skeleton variant="text" height={30} width="40%" />
                            <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                            <Skeleton variant="rectangular" height={50} width="50%" />
                        </Grid>
                    </Grid>
                </Container>
            </MainLayout>
        );
    }

    if (error || !product) {
        return (
            <MainLayout>
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                    <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
                        {error || 'Product not found'}
                    </Alert>
                    <Button variant="contained" onClick={() => navigate(ROUTES.PRODUCTS)}>
                        Browse All Products
                    </Button>
                </Container>
            </MainLayout>
        );
    }

    // Fallback image
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop';

    return (
        <MainLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Breadcrumb / Back Navigation */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, color: 'text.secondary' }}
                >
                    Back
                </Button>

                <Grid container spacing={5}>
                    {/* Left Column: Image */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative'
                            }}
                        >
                            {product.discount > 0 && (
                                <Chip
                                    label={`${product.discount}% OFF`}
                                    color="error"
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        zIndex: 1,
                                        fontWeight: 'bold'
                                    }}
                                />
                            )}
                            <Box
                                component="img"
                                src={product.image || fallbackImage}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 500,
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                onError={(e) => { e.target.src = fallbackImage; }}
                            />
                        </Paper>

                        {/* Thumbnails (Mock for now since we usually only have 1 image) */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2, overflowX: 'auto', pb: 1 }}>
                            {[product.image || fallbackImage, fallbackImage, fallbackImage].map((img, i) => (
                                <Box
                                    key={i}
                                    component="img"
                                    src={img}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: i === 0 ? '2px solid' : '1px solid',
                                        borderColor: i === 0 ? 'primary.main' : 'divider',
                                        objectFit: 'cover'
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Column: Details */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Chip
                                    label={product.category || 'Main Course'}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <IconButton size="small">
                                    <Share fontSize="small" />
                                </IconButton>
                            </Box>

                            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                                {product.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({product.reviewCount || 128} reviews)
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                    <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">{product.preparationTime || '20-30 mins'}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                    <LocalFireDepartment fontSize="small" sx={{ mr: 0.5, color: product.spiceLevel === 'High' ? 'error.main' : 'warning.main' }} />
                                    <Typography variant="body2">{product.spiceLevel || 'Medium'}</Typography>
                                </Box>
                            </Box>

                            <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                                ₹{product.price}
                                {product.originalPrice > product.price && (
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        color="text.secondary"
                                        sx={{ textDecoration: 'line-through', ml: 2, fontWeight: 400 }}
                                    >
                                        ₹{product.originalPrice}
                                    </Typography>
                                )}
                            </Typography>

                            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, lineHeight: 1.7 }}>
                                {product.description || 'Experience the authentic taste of Indian cuisine with this delightful dish. Prepared with fresh ingredients and traditional spices for a memorable dining experience.'}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                                {product.dietary?.map((diet, index) => (
                                    <Chip
                                        key={index}
                                        label={diet}
                                        icon={diet === 'Veretarian' ? <Restaurant /> : undefined}
                                        color={diet === 'Vegetarian' ? 'success' : 'default'}
                                        variant="outlined"
                                    />
                                )) || (
                                        <>
                                            <Chip label="Vegetarian" color="success" variant="outlined" />
                                            <Chip label="Gluten Free" variant="outlined" />
                                            <Chip label="Organic" variant="outlined" />
                                        </>
                                    )}
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            {/* Actions */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    px: 1
                                }}>
                                    <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                        <Remove />
                                    </IconButton>
                                    <Typography sx={{ mx: 2, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                                        {quantity}
                                    </Typography>
                                    <IconButton onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}>
                                        <Add />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    startIcon={addingToCart ? <CircularProgress size={20} /> : <ShoppingCart />}
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || addingToCart}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    {isInCart ? 'Update Cart' : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        boxShadow: '0 8px 16px rgba(255, 107, 107, 0.3)'
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Tabs: Description, Reviews */}
                <Box sx={{ mt: 8 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Ingredients & Nutrition" />
                            <Tab label="Reviews" />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Ingredients</Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {product.ingredients || 'Basmati Rice, Fresh Vegetables, Saffron, Ghee, Whole Spices (Cardamom, Cloves, Cinnamon), Fried Onions, Fresh Mint, Coriander, Cashews, Raisins.'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom>Nutrition Facts (per serving)</Typography>
                                <Grid container spacing={2}>
                                    {[
                                        { label: 'Calories', value: product.calories || '350 kcal' },
                                        { label: 'Protein', value: '12g' },
                                        { label: 'Carbs', value: '45g' },
                                        { label: 'Fat', value: '14g' },
                                    ].map((item, i) => (
                                        <Grid item xs={6} key={i}>
                                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                                                <Typography variant="subtitle1" fontWeight="bold">{item.value}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Box sx={{ maxWidth: 800 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" sx={{ mr: 2, fontWeight: 700 }}>4.8</Typography>
                                <Box>
                                    <Rating value={4.8} readOnly precision={0.1} />
                                    <Typography variant="body2" color="text.secondary">Based on 128 reviews</Typography>
                                </Box>
                            </Box>

                            {/* Mock Reviews */}
                            {[1, 2].map((review) => (
                                <Paper key={review} elevation={0} sx={{ p: 3, mb: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>AK</Avatar>
                                            <Typography variant="subtitle2">Arjun Kumar</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">2 days ago</Typography>
                                    </Box>
                                    <Rating value={5} size="small" readOnly sx={{ mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Absolutely delicious! The spice level was perfect and the delivery was super fast. Will definitely order again.
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </CustomTabPanel>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </MainLayout>
    );
};

export default ProductDetailsPage;
