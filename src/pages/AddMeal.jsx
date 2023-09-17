import React from 'react'
import { redirect } from 'react-router-dom';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/add-meal`);
  }
  return null;
}


function AddMeal() {
  return (
    <div>AddMeal</div>
  )
}

export default AddMeal