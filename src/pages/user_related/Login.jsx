import React from 'react'
import { Form, Link, Navigate, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Login.module.css';


export async function loader({ request }){
  return new URL(request.url).searchParams.get("redirectTo")
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
    return err.message;
  }
}


function Login() {

  // Needed in order to display additional information in case the user got redirected to login page.
  const wasRedirected = useLoaderData();

  // The return value of action function. It gets returned only if an error is thrown (otherwise the redirect happens).
  const errorMessage = useActionData();

  // useNavigation has useful information such as the state of the navigation (form submission is a navigation event!). https://reactrouter.com/en/main/hooks/use-navigation
  const navigation = useNavigation();
  const formStatus = navigation.state;

  // Don't allow login if the user is logged in, redirect to profile so they can log out first!
  const { currentUser } = useAuth();
  if (currentUser){
    return <Navigate to='/profile?redirectTo=login' />
  }

  return (
    <div className={styles.content}>
      <div className={styles.loginContainer}>
        <h1>Sign in to your account</h1>
        {wasRedirected && <h3 className={styles.redirectMessage}>You must log in first</h3>}
        {errorMessage && <h3 className={styles.errorMessage}>{errorMessage}</h3>}
        <Form method='post' className={styles.loginForm} replace>
          <input name='email' type='email' placeholder='Email address' />
          <input name='password' type='password' placeholder='Password' />
          <button type='submit' disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Logging in...' : 'Log in'}
          </button>
        </Form>
        <div className={styles.linkTextSU}>Don't have an account? <Link to='/signup'>Sign up</Link></div>
        <div className={styles.linkTextRP}>Can't sign in? <Link to='/password-reset'>Reset password</Link></div>
      </div>
    </div>
  );
}

export default Login