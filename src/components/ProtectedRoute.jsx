import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';


export async function loader({ request }){
  const destination = new URL(request.url).pathname;
  return destination;
}


function ProtectedRoute() {

  const { currentUser } = useAuth();
  const destination = useLoaderData();

  if (!currentUser){
    return <Navigate to={`/login?redirectTo=${destination}`} replace />
  }

  return <Outlet />;
}

export default ProtectedRoute