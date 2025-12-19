import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { ROUTES } from '../constants';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children;
};

export default ProtectedRoute;
