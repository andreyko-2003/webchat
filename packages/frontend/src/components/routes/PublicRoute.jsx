import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated() ? <Navigate to="/" replace /> : <Element {...rest} /> ;
};

export default PublicRoute;
