import React from 'react'
import { Form, redirect, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';


export async function action(request, resetPassword){

  const formData = await request.formData();
  const email = formData.get("email");

  try {
    await resetPassword(email)
    // const pathname = new URL(request.url).searchParams.get("redirectTo") || "/";
    // const res = redirect(pathname);
    console.log("it worked");
    return redirect('/login');
  }
  catch (err) {
    return err.message;
  }
}


function ForgotPassword() {

  // Don't allow login if the user is logged in, redirect to profile so they can log out first!
  const { currentUser } = useAuth();
  if (currentUser){
    return <Navigate to='/profile?redirectTo=password-reset' />
  }

  return (
    <div>
      <Form method='post' replace>
        <label htmlFor='email'>Email: </label>
        <input name='email' type='email' placeholder='email' />
        <button type='submit'>
          Reset password
        </button>
      </Form>
    </div>
  )
}

export default ForgotPassword