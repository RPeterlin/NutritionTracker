import React from 'react';
import { useActionData } from 'react-router-dom';
import styles from '../../styles/Profile.module.css';
import UpdateProfile from '../../components/UpdateProfile';
import TargetMacros from '../../components/TargetMacros';
import mapErrorMessages from '../../utils';


export async function action(request, updateEmail, updatePassword, updateUser){

  const formData = await request.formData();
  const buttonType = formData.get('button');

  let data = Object.fromEntries(formData);
  delete data.button;

  switch (buttonType){

    case 'update':
      const email = data.email;
      const pwd = data.pwd;
      const confPwd = data.pwdConf;

      try {
        if (email){
          await updateEmail(email);
          await updateUser('email', email);
          return {success: true, msg: 'Email updated successfully.'}
        }
        if (pwd){
          await updatePassword(pwd, confPwd);
          return {success: true, msg: 'Password updated successfully.'}
        }
        return null;
      }
      catch (err){
        return {success: false, msg: mapErrorMessages(err.message)}
      }

    case 'save':
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
