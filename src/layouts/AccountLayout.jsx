import { Box, AppBar, Toolbar, Container, Tabs, Tab, Button, Typography } from '@mui/material';
import { Restaurant, Logout, Person, ShoppingBag, Settings } from '@mui/icons-material';

const AccountLayout = ({ children, activeTab, onTabChange, onLogout }) => {
    const tabs = [
        { value: 'profile', label: 'Profile', icon: <Person /> },
        { value: 'orders', label: 'Orders', icon: <ShoppingBag /> },
        { value: 'settings', label: 'Settings', icon: <Settings /> },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    animation: 'moveBackground 20s linear infinite',
                    pointerEvents: 'none',
                },
                '@keyframes moveBackground': {
                    '0%': { transform: 'translate(0, 0)' },
                    '100%': { transform: 'translate(50px, 50px)' },
                },
            }}
        >
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: 1,
                    borderColor: 'rgba(102, 126, 234, 0.1)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Restaurant sx={{ fontSize: 32, color: 'primary.main' }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                Kitchen UI
                            </Typography>
                        </Box>

                        {/* Navigation Tabs */}
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, newValue) => onTabChange(newValue)}
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                    },
                                }}
                            >
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.value}
                                        value={tab.value}
                                        label={tab.label}
                                        icon={tab.icon}
                                        iconPosition="start"
                                        sx={{
                                            minHeight: 64,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    />
                                ))}
                            </Tabs>
                        </Box>

                        {/* Logout Button */}
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<Logout />}
                            onClick={onLogout}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                display: { xs: 'none', sm: 'flex' },
                            }}
                        >
                            Logout
                        </Button>

                        {/* Mobile Logout */}
                        <Button
                            variant="contained"
                            color="error"
                            onClick={onLogout}
                            sx={{
                                minWidth: 'auto',
                                px: 2,
                                display: { xs: 'flex', sm: 'none' },
                            }}
                        >
                            <Logout />
                        </Button>
                    </Toolbar>

                    {/* Mobile Navigation */}
                    <Box sx={{ display: { xs: 'block', md: 'none' }, pb: 1 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(e, newValue) => onTabChange(newValue)}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                },
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab
                                    key={tab.value}
                                    value={tab.value}
                                    icon={tab.icon}
                                    sx={{
                                        minHeight: 56,
                                        '&.Mui-selected': {
                                            color: 'primary.main',
                                        },
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                </Container>
            </AppBar>

            {/* Main Content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
        </Box>
    );
};

export default AccountLayout;
