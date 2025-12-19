import { createTheme } from '@mui/material/styles';

// Custom theme for the application
const theme = createTheme({
    palette: {
        primary: {
            main: '#667eea',
            light: '#8b9ef5',
            dark: '#4c5fd4',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#764ba2',
            light: '#9b6ec9',
            dark: '#5a3880',
            contrastText: '#ffffff',
        },
        error: {
            main: '#f56565',
            light: '#fc8181',
            dark: '#c53030',
        },
        success: {
            main: '#48bb78',
            light: '#68d391',
            dark: '#2f855a',
        },
        warning: {
            main: '#ed8936',
            light: '#f6ad55',
            dark: '#c05621',
        },
        background: {
            default: '#f7fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#2d3748',
            secondary: '#718096',
        },
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0,0,0,0.05)',
        '0 4px 8px rgba(0,0,0,0.08)',
        '0 8px 16px rgba(0,0,0,0.1)',
        '0 12px 24px rgba(0,0,0,0.12)',
        '0 16px 32px rgba(0,0,0,0.15)',
        '0 20px 40px rgba(0,0,0,0.18)',
        '0 24px 48px rgba(0,0,0,0.2)',
        '0 2px 10px rgba(102, 126, 234, 0.1)',
        '0 4px 15px rgba(102, 126, 234, 0.15)',
        '0 8px 25px rgba(102, 126, 234, 0.2)',
        '0 12px 35px rgba(102, 126, 234, 0.25)',
        '0 16px 45px rgba(102, 126, 234, 0.3)',
        '0 20px 55px rgba(102, 126, 234, 0.35)',
        '0 24px 65px rgba(102, 126, 234, 0.4)',
        '0 2px 20px rgba(0, 0, 0, 0.1)',
        '0 4px 25px rgba(0, 0, 0, 0.15)',
        '0 8px 30px rgba(0, 0, 0, 0.2)',
        '0 12px 40px rgba(0, 0, 0, 0.25)',
        '0 16px 50px rgba(0, 0, 0, 0.3)',
        '0 20px 60px rgba(0, 0, 0, 0.35)',
        '0 24px 70px rgba(0, 0, 0, 0.4)',
        '0 10px 40px rgba(102, 126, 234, 0.3)',
        '0 20px 60px rgba(0, 0, 0, 0.3)',
        '0 10px 25px rgba(245, 101, 101, 0.4)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd4 0%, #6a4291 100%)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        '&:hover fieldset': {
                            borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
    },
});

export default theme;
