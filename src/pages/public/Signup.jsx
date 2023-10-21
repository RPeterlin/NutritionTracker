import React from 'react';
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';
import styles from '../../styles/Login.module.css';
import mapErrorMessages from '../../utils';


export async function action(request, signup, addUser){

  const formData = await request.formData();
  const email = formData.get('email');
  const pwd = formData.get('pwd');
  const confPwd = formData.get('pwdConf');

  try {
    const response = await signup(email, pwd, confPwd);
    await addUser(response.user.uid, email);
    return redirect('/profile');
  }
  catch (err){
    return mapErrorMessages(err.message);
  }
}


function Signup() {

  const errorMessage = useActionData();
  const navigation = useNavigation();
  const formStatus = navigation.state;

  return (
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
          {formStatus === 'submitting' ? 'Signing up...' : 'Sign up'}
        </button>
      </Form>
      <div className={styles.linkText}>Already have an account? <Link to='/login'>Log in</Link></div>
    </div>
  );
}


export default Signup