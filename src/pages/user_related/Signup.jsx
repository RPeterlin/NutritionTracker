import React from 'react';
import { Form, Link, Navigate, redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


export async function action(request, login){

  const formData = await request.formData();
  const email = formData.get('email');
  const pwd = formData.get('pwd');
  const confPwd = formData.get('pwdConf');

  if (pwd !== confPwd){
    alert("Password don't match!");
    return null;
  }

  try {
    await login(email, pwd);
    return redirect('/login');
  }
  catch (err){
    console.log(err);
  }
  return null;
}


function Signup() {

  // Don't allow signup if the user is logged in, redirect to profile so they can log out first!
  const { currentUser } = useAuth();
  if (currentUser){
    return <Navigate to='/profile?redirectTo=signup' />
  }

  return (
    <div className='login-container'>
      <h1>Creat an account</h1>
      <Form method='post' className='login-form' replace>
        <input name='email' type='email' placeholder='Email address' />
        <input name='pwd' type='password' placeholder='Password' />
        <input name='pwdConf' type='password' placeholder='Confirm password' />
        <button type='submit'>
          Signup
        </button>
      </Form>
      <div>Already have an account? <Link to='/login'>Log in</Link></div>
    </div>
  );
}

export default Signup