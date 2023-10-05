import React from 'react'
import { Form, redirect, Navigate, useActionData, useNavigation, Link } from 'react-router-dom'
import styles from '../../styles/Login.module.css';
import mapErrorMessages from '../../utils';


export async function loader(request, currentUser){

  if (currentUser){
    return redirect('/profile');
  }
  return new URL(request.url).searchParams.get("redirectTo");
}


export async function action(request, resetPassword){

  const formData = await request.formData();
  const email = formData.get("email");

  try {
    await resetPassword(email)
    return redirect('/login');
  }
  catch (err) {
    return mapErrorMessages(err.message);
  }
}


function ForgotPassword() {

  const errorMessage = useActionData();
  const navigation = useNavigation();
  const formStatus = navigation.state;

  return (
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
      <div className={styles.linkText}>Back to <Link to='/login'>log in</Link></div>
    </div>
  )
}

export default ForgotPassword