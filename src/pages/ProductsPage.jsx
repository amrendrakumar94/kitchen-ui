import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Rating,
    Pagination,
    CircularProgress,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Alert,
} from '@mui/material';
import {
    Search,
    ShoppingCart,
    ArrowForward,
} from '@mui/icons-material';
import MainLayout from '../layouts/MainLayout';
import { fetchProducts } from '../services/productsService';
import { useCart } from '../context/CartContext';
import { Snackbar } from '@mui/material';
import { ROUTES } from '../constants';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [sortOrder, setSortOrder] = useState('desc');
    const [category, setCategory] = useState('all');
    const [addingToCart, setAddingToCart] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const pageSize = 20;
    const { addToCart, cartItems } = useCart();

    // Fetch products from API
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError('');

            try {
                const filters = {};

                // Add category filter if not 'all'
                if (category !== 'all') {
                    filters.category = category;
                }

                // Add search filter if query exists
                if (searchQuery.trim()) {
                    filters.search = searchQuery.trim();
                }

                // Determine sort order based on sortBy value
                let actualSortBy = sortBy;
                let actualSortOrder = sortOrder;

                if (sortBy === 'price-low') {
                    actualSortBy = 'price';
                    actualSortOrder = 'asc';
                } else if (sortBy === 'price-high') {
                    actualSortBy = 'price';
                    actualSortOrder = 'desc';
                }

                const response = await fetchProducts({
                    page,
                    pageSize,
                    sortBy: actualSortBy,
                    sortOrder: actualSortOrder,
                    filters,
                });

                if (response.status === 'success') {
                    setProducts(response.data.products);
                    setTotalPages(response.data.pagination.totalPages);
                    setTotalItems(response.data.pagination.totalItems);
                } else {
                    setError(response.message || 'Failed to fetch products');
                }
            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, sortBy, sortOrder, category, searchQuery]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPage(1); // Reset to first page on category change
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortBy(value);

        // Set default sort order based on selection
        if (value === 'price-low') {
            setSortOrder('asc');
        } else if (value === 'price-high') {
            setSortOrder('desc');
        } else {
            setSortOrder('desc');
        }

        setPage(1); // Reset to first page on sort change
    };

    const handleAddToCart = async (productId) => {
        setAddingToCart(prev => ({ ...prev, [productId]: true }));

        try {
            const result = await addToCart(productId, 1);

            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'Item added to cart successfully!',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'Failed to add item to cart',
                    severity: 'error'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to add item to cart',
                severity: 'error'
            });
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const ProductCard = ({ product }) => {
        // Check if this product is already in the cart
        const isInCart = cartItems.some(item => item.productId === product.id);
        const [imageError, setImageError] = useState(false);

        const handleButtonClick = (e) => {
            e.stopPropagation();
            if (isInCart) {
                // Navigate to cart page
                navigate(ROUTES.CART);
            } else {
                // Add to cart
                handleAddToCart(product.id);
            }
        };

        const handleImageError = () => {
            setImageError(true);
        };

        // Fallback image URL - a nice food placeholder
        const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

        return (
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8,
                    },
                }}
                onClick={() => navigate(`${ROUTES.PRODUCTS}/${product.id}`, { state: { product } })}
            >
                {/* In Cart Badge */}
                {isInCart && (
                    <Chip
                        label="In Cart"
                        color="success"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            fontWeight: 600,
                            boxShadow: 2,
                        }}
                    />
                )}

                <CardMedia
                    component="img"
                    height="200"
                    image={imageError ? fallbackImage : product.image}
                    alt={product.name}
                    onError={handleImageError}
                    sx={{
                        objectFit: 'cover',
                        backgroundColor: 'grey.100',
                    }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 1 }}>
                        <Chip
                            label={product.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        {product.discount > 0 && (
                            <Chip
                                label={`${product.discount}% OFF`}
                                size="small"
                                color="error"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {product.name}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {product.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.5} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.reviewCount})
                        </Typography>
                    </Box>

                    {/* Additional Info */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {product.servingSize} • {product.preparationTime}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            {product.spiceLevel && (
                                <Chip
                                    label={product.spiceLevel}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                            )}
                            {product.dietary?.map((diet, index) => (
                                <Chip
                                    key={index}
                                    label={diet}
                                    size="small"
                                    variant="outlined"
                                    color={diet === 'vegetarian' ? 'success' : 'default'}
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                                ₹{product.price.toLocaleString()}
                            </Typography>
                            {product.originalPrice > product.price && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1, textDecoration: 'line-through' }}
                                >
                                    ₹{product.originalPrice.toLocaleString()}
                                </Typography>
                            )}
                        </Box>

                        <Button
                            variant={isInCart ? "outlined" : "contained"}
                            fullWidth
                            startIcon={
                                addingToCart[product.id]
                                    ? <CircularProgress size={20} color="inherit" />
                                    : isInCart
                                        ? <ArrowForward />
                                        : <ShoppingCart />
                            }
                            disabled={!product.inStock || addingToCart[product.id]}
                            onClick={handleButtonClick}
                        >
                            {addingToCart[product.id]
                                ? 'Adding...'
                                : isInCart
                                    ? 'Go to Cart'
                                    : (product.inStock ? 'Add to Cart' : 'Out of Stock')
                            }
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <MainLayout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Page Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Delicious Indian Cuisine
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                        Explore our authentic dishes made with love and traditional recipes
                    </Typography>
                </Box>

                {/* Filters Section */}
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search food items..."
                                value={searchQuery}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Category"
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    <MenuItem value="starters">Starters</MenuItem>
                                    <MenuItem value="main-course">Main Course</MenuItem>
                                    <MenuItem value="rice-biryani">Rice & Biryani</MenuItem>
                                    <MenuItem value="south-indian">South Indian</MenuItem>
                                    <MenuItem value="north-indian">North Indian</MenuItem>
                                    <MenuItem value="desserts">Desserts</MenuItem>
                                    <MenuItem value="beverages">Beverages</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortBy}
                                    label="Sort By"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="popular">Most Popular</MenuItem>
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                                    <MenuItem value="rating">Rating</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Results Count */}
                    {!loading && !error && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Showing {products.length} of {totalItems} items
                        </Typography>
                    )}
                </Box>

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Products Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : products.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No products found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your search or filters
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {products.map((product) => (
                                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
};

export default ProductsPage;
