import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Profile.module.css';
import { Form, useNavigation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function UpdateProfile() {

  const navigation = useNavigation();
  const formStatus = navigation.state;

  return (
    <div className={styles.updateContainer}>
      <h1>Update Profile</h1>

      <Form method='post' className={styles.form} replace>
        <div className={styles.labelInput}>
          <label htmlFor='email'>Email</label>
          <input name='email' type='email' />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor='email'>Password</label>
          <input name='pwd' type='password' />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor='email'>Confirm password</label>
          <input name='pwdConf' type='password' />
        </div>
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
          <button name='button' value='logout' className={styles.rightButton}>
            Log out
          </button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateProfile;