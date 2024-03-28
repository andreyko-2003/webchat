import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuth();
  
    return isAuthenticated ?  <Element {...rest} /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;