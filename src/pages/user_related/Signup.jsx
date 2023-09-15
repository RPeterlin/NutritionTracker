import React from 'react';
import { Form, Link, Navigate, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Signup.module.css'


export async function action(request, login){

  const formData = await request.formData();
  const email = formData.get('email');
  const pwd = formData.get('pwd');
  const confPwd = formData.get('pwdConf');

  if (pwd !== confPwd){
    // alert("Password don't match!");
    return "Passwords don't match";
  }

  try {
    await login(email, pwd);
    return redirect('/login');
  }
  catch (err){
    return err.message;
  }
}


function Signup() {

  const errorMessage = useActionData();
  const navigation = useNavigation();
  const formStatus = navigation.state;

  // Don't allow signup if the user is logged in, redirect to profile so they can log out first!
  const { currentUser } = useAuth();
  if (currentUser){
    return <Navigate to='/profile?redirectTo=signup' />
  }

  return (
    <div className={styles.content}>
      <div className={styles.loginContainer}>
        <h1>Create an account</h1>
        {errorMessage && <h3>{errorMessage}</h3>}
        <Form method='post' className={styles.loginForm} replace>
          <div className={styles.labelInput}>
            <label htmlFor='email'>Email</label>
            <input name='email' type='email' />
          </div>
          <div className={styles.labelInput}>
            <label htmlFor='pwd'>Password</label>
            <input name='pwd' type='password' />
          </div>
          <div className={styles.labelInput}>
            <label htmlFor='pwdConf'>Confirm password</label>
            <input name='pwdConf' type='password' />
          </div>
          <button type='submit' disabled={formStatus === 'submitting'}>
            {formStatus === 'submitting' ? 'Signing up...' : 'Signup'}
          </button>
        </Form>
        <div className={styles.linkText}>Already have an account? <Link to='/login'>Sing in</Link></div>
      </div>
    </div>
  );
}

export default Signup