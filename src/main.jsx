import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fortawesome/fontawesome-free/css/all.css';

import theme from './theme/theme';
import { isAuthenticated } from './services/authService';
import { ROUTES } from './constants';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrdersPage from './pages/OrdersPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <OrderProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path={ROUTES.LOGIN}
                element={
                  isAuthenticated() ? <Navigate to={ROUTES.PRODUCTS} replace /> : <LoginPage />
                }
              />
              <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
              <Route
                path={ROUTES.PRODUCTS}
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PRODUCT_DETAILS}
                element={
                  <ProtectedRoute>
                    <ProductDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.CART}
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.CHECKOUT}
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`${ROUTES.ORDER_CONFIRMATION}/:orderId`}
                element={
                  <ProtectedRoute>
                    <OrderConfirmationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ORDERS}
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`${ROUTES.ORDERS}/:orderId`}
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ACCOUNT}
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
