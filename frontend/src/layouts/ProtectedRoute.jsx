import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { authUser, isAuthenticated } = useAuthStore();
  // console.log(authUser);
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // console.log(allowedRoles.includes(authUser?.role));
  if (allowedRoles && !allowedRoles.includes(authUser?.role))
    return <Navigate to="/profile" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
