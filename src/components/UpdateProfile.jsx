import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Profile.module.css';
import { Form, redirect, useNavigate, useNavigation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function UpdateProfile() {

  const navigation = useNavigation();
  const formStatus = navigation.state;
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className={styles.updateContainer}>
      <h1>Update Profile</h1>

      <Form method='post' className={styles.form} replace>
        <FormRow name='email' txtField='Email' type='email' />
        <FormRow name='pwd' txtField='Password' type='password' />
        <FormRow name='pwdConf' txtField='Confirm password' type='password' />

        <div className={styles.buttonContainer}>
          <button 
            className={styles.leftButton}
            type='submit' 
            name='button' 
            value='update' 
            disabled={formStatus === 'submitting'}
          >
            {formStatus === 'submitting' ? 'Updating...' : 'Update profile'}
          </button>
          <button type='button' className={styles.rightButton} onClick={async () => {
            await logout();
            navigate('/');
          }} >
            Log out
          </button>
        </div>
      </Form>
    </div>
  );
}


function FormRow({ name, txtField, type }){
  return (
    <div className={styles.labelInput}>
      <label htmlFor={name}>{txtField} </label>
      <input type={type} name={name} />
    </div>
  );
}


export default UpdateProfile;