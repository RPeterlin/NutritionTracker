import { redirect } from "react-router-dom";


export async function requireAuth(loaderObj){

  const isLoggedIn = localStorage.getItem("loggedin");

  if (!isLoggedIn){
    // Get the route to which the user was trying to go, so the login component can redirect the user to the desired route upon logging in. Request was passed from the loader of the desired route.
    const url = new URL(loaderObj.request.url).pathname;
    const redirectURL = `/login?redirectTo=${url}&redirected=true`;
    const res = redirect(redirectURL);
    res.body = true;
    return res;

  }
  return null;
}