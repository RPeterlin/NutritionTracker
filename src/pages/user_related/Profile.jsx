import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/profile`);
  }
  return null;
}


export async function action(request, updateEmail, updatePassword){

  const formData = await request.formData();
  const email = formData.get('email');
  const pwd = formData.get('pwd');
  const confPwd = formData.get('pwdConf');

  if (pwd !== confPwd){
    alert("Password don't match!");
    return null;
  }

  try {
    if (email){
      await updateEmail(email);
    }
    if (pwd){
      await updatePassword(pwd);
    }
    return null;
  }
  catch (err){
    console.log(err);
  }
  return null;
}


function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div>
      <p>Profile</p>
      <div>Update profile</div>
      <Form method='post' replace>
        <label htmlFor='email'>Email</label>
        <input name='email' type='email' placeholder='email' />
        <label htmlFor='email'>Password</label>
        <input name='pwd' type='password' placeholder='Leave blank to keep the same' />
        <label htmlFor='email'>Confirm password</label>
        <input name='pwdConf' type='password' placeholder='Leave blank to keep the same' />
        <button type='submit'>
          Update profile
        </button>
      </Form>
      <button onClick={handleLogout}>
        Log out
      </button>
    </div>
  )
}

export default Profile