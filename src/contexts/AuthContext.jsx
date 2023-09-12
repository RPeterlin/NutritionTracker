import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from 'firebase/auth';


const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  function signup(email, pwd){
    return createUserWithEmailAndPassword(auth, email, pwd);
  }
  function login(email, pwd){
    console.log("User has been logged in");
    return signInWithEmailAndPassword(auth, email, pwd);
  }
  function logout(){
    return signOut(auth);
  }
  function resetPassword(email){
    return sendPasswordResetEmail(auth, email);
  }
  function handleUpdateEmail(email){
    return updateEmail(currentUser, email);
  }
  function handleUpdatePassword(pwd){
    return updatePassword(currentUser, pwd);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    handleUpdateEmail,
    handleUpdatePassword,
  };


  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


export function useAuth(){
  return useContext(AuthContext);
}
