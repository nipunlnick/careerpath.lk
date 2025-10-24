
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        // You can add a loading spinner here if you want
        return <div>Loading...</div>;
    }

    return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;