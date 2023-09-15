import React from 'react'
import { Form, redirect, Navigate, useActionData, useNavigation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/ForgotPassword.module.css';


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
    return "err.message";
  }
}


function ForgotPassword() {

  const errorMessage = useActionData();
  const navigation = useNavigation();
  const formStatus = navigation.state;

  // Don't allow login if the user is logged in, redirect to profile so they can log out first!
  const { currentUser } = useAuth();
  if (currentUser){
    return <Navigate to='/profile?redirectTo=password-reset' />
  }

  return (
    <div className={styles.content}>
      <div className={styles.loginContainer}>
        <h1>Forgot password?</h1>
        {errorMessage && <h3>{errorMessage}</h3>}
        <Form method='post' replace className={styles.loginForm}>
          <div className={styles.labelInput}>
            <label htmlFor='email'>Email: </label>
            <input name='email' type='email' />
          </div>
          <button type='submit' disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Resetting password' : 'Reset password'}
          </button>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPassword