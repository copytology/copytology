
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Only show the loading indicator for a genuine loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8ACE00]"></div>
      </div>
    );
  }
  
  // If not loading and no user, redirect to login
  if (!user) {
    // Redirect to login but save the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
