import Cookies from 'js-cookie';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = Cookies.get('jwtToken') || '';

  return token ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
