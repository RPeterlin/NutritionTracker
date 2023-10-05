import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form, redirect, useActionData, useLoaderData, useNavigate } from 'react-router-dom';
import styles from '../../styles/Profile.module.css';
import { useData } from '../../contexts/DataContext';
import UpdateProfile from '../../components/UpdateProfile';
import TargetMacros from '../../components/TargetMacros';
import mapErrorMessages from '../../utils';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/profile`);
  }
  return null;
}


export async function action(request, updateEmail, updatePassword, logout, updateUser){

  const formData = await request.formData();
  const buttonType = formData.get('button');

  switch (buttonType){

    case 'update':
      const email = formData.get('email');
      const pwd = formData.get('pwd');
      const confPwd = formData.get('pwdConf');

      if (pwd !== confPwd){
        return {success: false, msg: "Passwords don't match!"}
      }

      try {
        if (email){
          await updateEmail(email);
          await updateUser('email', email);
          return {success: true, msg: 'Email updated successfully.'}
        }
        if (pwd){
          await updatePassword(pwd);
          return {success: true, msg: 'Password updated successfully.'}
        }
        return null;
      }
      catch (err){
        console.log(err);
        return {success: false, msg: mapErrorMessages(err.message)}
      }

    case 'logout':
      await logout();
      return redirect('/');

    case 'save':
      let data = Object.fromEntries(formData);
      delete data.button;

      try {
        await updateUser('target', data);
        return null;
      }
      catch (err) {
        return {success: false, msg: mapErrorMessages(err.message)}
      }
    default:
      console.log("Unknown button type!");
      return null;
  }
}


function Profile() {

  const actionResponse = useActionData();

  return (
    <div className={styles.main}>
      {actionResponse && <h3 className={actionResponse.success ? styles.success : styles.fail}>{actionResponse.msg}</h3>}
      <div className={styles.globalContainer}>
        <UpdateProfile className={styles.updateContainer} />
        <TargetMacros />
      </div>
    </div>
  );
}

export default Profile
