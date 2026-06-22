import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    // Redirect to home if user is not an admin but trying to access admin routes
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
