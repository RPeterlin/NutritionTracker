import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form, useLoaderData, useNavigate, defer } from 'react-router-dom';


export function loader({ request }){
  // Used in case of user wanting to either reset their password, sign up or login WHILE ALREADY BEING LOGGED IN. In case they want to access one of these routes, they should logout first and then be redirected back to the thing they were initially trying to do. 
  return request;
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

  // Do that here instead of in loader, because loaders get executed in parallel (profileLoader and protectedLoader), meaning any potential data fetching in profileLoader would have started before the ProtectedRoute gets the chance redirect non authenticated users!
  const loaderRequest = useLoaderData();
  const destination = new URL(loaderRequest.url).searchParams.get("redirectTo");
  console.log("yes", destination);

  async function handleLogout() {
    await logout();
    const pathname = destination || '';
    navigate(`/${pathname}`);
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