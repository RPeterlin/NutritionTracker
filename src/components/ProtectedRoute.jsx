import React from 'react';
import { Navigate, Route, redirect } from 'react-router-dom';


function ProtectedRoute({ currentUser, dest, children }) {

  if (!currentUser) {
    return <Navigate to={'/login?redirectTo=' + dest} replace />;
  }

  return children;
}

export default ProtectedRoute