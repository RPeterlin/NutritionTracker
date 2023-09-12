import { redirect } from "react-router-dom";


export async function checkAuth(request, currentUser, dest){
  
  if (!currentUser){
    console.log("here");
    const url = new URL(request.url).pathname;
    const redirectURL = `${dest}?redirectTo=${url}`;
    console.log(redirectURL);
    return redirect(redirectURL);
  }

  return null;
}