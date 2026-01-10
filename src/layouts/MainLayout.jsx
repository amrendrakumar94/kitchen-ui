import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Container,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Button,
    Avatar,
    Divider,
    ListItemIcon,
} from '@mui/material';
import {
    Restaurant,
    ShoppingCart,
    AccountCircle,
    Logout,
    Person,
    ShoppingBag,
    Settings,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout, getUserData } from '../services/authService';
import { useCart } from '../context/CartContext';
import { ROUTES } from '../constants';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const userData = getUserData();
    const { cartSummary } = useCart();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const handleNavigate = (path) => {
        handleMenuClose();
        navigate(path);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={2}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        {/* Logo */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate(ROUTES.PRODUCTS)}
                        >
                            <Restaurant sx={{ fontSize: 32 }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Kitchen UI
                            </Typography>
                        </Box>

                        {/* Right Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Cart Icon */}
                            <IconButton
                                color="inherit"
                                size="large"
                                onClick={() => navigate(ROUTES.CART)}
                                sx={{
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <Badge
                                    badgeContent={cartSummary.totalItems}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            animation: cartSummary.totalItems > 0 ? 'pulse 2s infinite' : 'none',
                                            '@keyframes pulse': {
                                                '0%': {
                                                    transform: 'scale(1)',
                                                    opacity: 1,
                                                },
                                                '50%': {
                                                    transform: 'scale(1.1)',
                                                    opacity: 0.8,
                                                },
                                                '100%': {
                                                    transform: 'scale(1)',
                                                    opacity: 1,
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>

                            {/* User Menu */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Welcome,
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {userData?.name || 'User'}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={handleMenuOpen}
                                    size="large"
                                    sx={{
                                        ml: 1,
                                        border: 2,
                                        borderColor: 'rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                        }}
                                    >
                                        <Person />
                                    </Avatar>
                                </IconButton>
                            </Box>

                            {/* User Dropdown Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        minWidth: 200,
                                    },
                                }}
                            >
                                <Box sx={{ px: 2, py: 1.5 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Signed in as
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {userData?.name || 'User'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {userData?.phone || ''}
                                    </Typography>
                                </Box>
                                <Divider />
                                <MenuItem onClick={() => handleNavigate(ROUTES.ACCOUNT)}>
                                    <ListItemIcon>
                                        <Person fontSize="small" />
                                    </ListItemIcon>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={() => handleNavigate(ROUTES.ORDERS)}>
                                    <ListItemIcon>
                                        <ShoppingBag fontSize="small" />
                                    </ListItemIcon>
                                    My Orders
                                </MenuItem>
                                <MenuItem onClick={() => handleNavigate(ROUTES.ACCOUNT)}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" color="error" />
                                    </ListItemIcon>
                                    <Typography color="error">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                }}
            >
                {children}
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    bgcolor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <Container maxWidth="xl">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2024 Kitchen UI. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;
