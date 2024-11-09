import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';


const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  // If the user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children component
  return children;
};

export default ProtectedRoute;
