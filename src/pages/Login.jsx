import React, { useState } from 'react'
import { Form, redirect, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { loginUser } from '../api';


export async function loader(loaderObj){
  // Was the user (forcibly) redirected to login page or not?
  return new URL(loaderObj.request.url).searchParams.get("redirected");
}

export async function action(request, setLoggedIn){
  // Form submission is handled here

  const formData = await request.formData();
  const email = formData.get("email");
  const pwd = formData.get("password");

  try {
    await loginUser({email: email, password: pwd});
    localStorage.setItem("loggedin", true);
    setLoggedIn(true);
    const pathname = new URL(request.url).searchParams.get("redirectTo") || "/";
    const res = redirect(pathname);
    res.body = true;
    return res;
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

  return (
    <div className='login-container'>
      <h1>Sign in to your account</h1>
      {wasRedirected && <h3 className='redirect-message'>You must log in first</h3>}
      {errorMessage && <h3 className='error-message'>{errorMessage}</h3>}
      <Form method='post' className='login-form' replace>
        <input name='email' type='email' placeholder='Email address' />
        <input name='password' type='password' placeholder='Password' />
        <button disabled={formStatus === "submitting"}>
          {formStatus === "submitting" ? "Logging in..." : "Log in"}
        </button>
      </Form>
    </div>
  );
}

export default Login