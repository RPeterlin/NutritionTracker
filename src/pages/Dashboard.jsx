import React from 'react';
import { redirect } from 'react-router-dom';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/dashboard`);
  }
  return null;
}


function Dashboard() {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard