import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Chip,
    CircularProgress,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import {
    Person,
    Phone,
    Email,
    CalendarToday,
    CheckCircle,
    ShoppingBag,
    Settings as SettingsIcon,
    LocationOn,
} from '@mui/icons-material';
import { getUserData, logout } from '../services/authService';
import AccountLayout from '../layouts/AccountLayout';

const AccountPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const data = getUserData();
        if (data) {
            setUserData(data);
        }
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (!userData) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                        Loading account details...
                    </Typography>
                </Box>
            </Box>
        );
    }

    const renderProfileSection = () => (
        <Box>
            {/* User Header */}
            <Box
                sx={{
                    textAlign: 'center',
                    mb: 4,
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: 3,
                }}
            >
                <Avatar
                    sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '3rem',
                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                    }}
                >
                    <Person sx={{ fontSize: '3.5rem' }} />
                </Avatar>
                <Typography variant="h4" gutterBottom>
                    {userData.name || 'User'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {userData.phone || 'Not available'}
                </Typography>
            </Box>

            {/* User Details Grid */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Person sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Full Name
                                </Typography>
                            </Box>
                            <Typography variant="h6">{userData.name || 'Not provided'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Phone sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Phone Number
                                </Typography>
                            </Box>
                            <Typography variant="h6">
                                {userData.phone || 'Not available'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Email sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Email Address
                                </Typography>
                            </Box>
                            <Typography variant="h6">{userData.email || 'Not provided'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Address
                                </Typography>
                            </Box>
                            <Typography variant="h6">{userData.address || 'Not provided'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarToday sx={{ color: 'primary.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Member Since
                                </Typography>
                            </Box>
                            <Typography variant="h6">
                                {userData.createDate
                                    ? new Date(userData.createDate).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                    : 'Not available'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckCircle sx={{ color: 'success.main', mr: 1.5 }} />
                                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    Account Status
                                </Typography>
                            </Box>
                            <Chip
                                label="Active"
                                color="success"
                                sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );

    const renderOrdersSection = () => (
        <Box
            sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 3,
            }}
        >
            <ShoppingBag sx={{ fontSize: 80, color: 'primary.main', opacity: 0.5, mb: 3 }} />
            <Typography variant="h4" gutterBottom>
                No Orders Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Your order history will appear here
            </Typography>
        </Box>
    );

    const renderSettingsSection = () => (
        <Box
            sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 3,
            }}
        >
            <SettingsIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.5, mb: 3 }} />
            <Typography variant="h4" gutterBottom>
                Settings Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Account settings will be available here
            </Typography>
        </Box>
    );

    return (
        <AccountLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {activeTab === 'profile' && renderProfileSection()}
                {activeTab === 'orders' && (
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                            Order History
                        </Typography>
                        {renderOrdersSection()}
                    </Box>
                )}
                {activeTab === 'settings' && (
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                            Account Settings
                        </Typography>
                        {renderSettingsSection()}
                    </Box>
                )}
            </Container>
        </AccountLayout>
    );
};

export default AccountPage;
