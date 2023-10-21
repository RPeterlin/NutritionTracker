import React from 'react'
import { Form, Link, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
import mapErrorMessages from '../../utils';


export async function loader(request, currentUser){

  const dest = new URL(request.url).searchParams.get("redirectTo");

  if (currentUser && !dest){
    return redirect('/profile');
  }
  else if (currentUser){
    return redirect(dest);
  }
  else {
    return dest;
  }
}


export async function action(request, login){
  
  const formData = await request.formData();
  const email = formData.get("email");
  const pwd = formData.get("password");

  try {
    await login(email, pwd);
    const pathname = new URL(request.url).searchParams.get("redirectTo") || "/";
    return redirect(pathname);
  }
  catch (err) {
    return mapErrorMessages(err.message);
  }
}


function Login() {

  const wasRedirected = useLoaderData();
  const errorMessage = useActionData();
  const navigation = useNavigation();
  const formStatus = navigation.state;

  return (
    <div className={styles.loginContainer}>
      <h1>Log in</h1>
      {wasRedirected && !errorMessage 
      ? 
        <h3 className={styles.redirectMessage}>You must log in first</h3>
      :
        errorMessage && <h3>{errorMessage}</h3>
      }
      <Form method='post' className={styles.loginForm} replace>
        <div className={styles.labelInput}>
          <label htmlFor='email'>Email</label>
          <input name='email' type='email' />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor='password'>Password</label>
          <input name='password' type='password' />
        </div>
        <button type='submit' disabled={formStatus === 'submitting'}>
          {formStatus === 'submitting' ? 'Logging in...' : 'Log in'}
        </button>
      </Form>
      <div className={styles.linkTextSU}>Don't have an account? <Link to='/signup'>Sign up</Link></div>
      <div className={styles.linkText}>Can't sign in? <Link to='/password-reset'>Reset password</Link></div>
    </div>
  );
}


export default Login