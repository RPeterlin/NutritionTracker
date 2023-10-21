import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from 'firebase/auth';


const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);


  function signup(email, pwd, confPwd){

    if (!email || !pwd || !confPwd) {
      throw new Error("All fields must be filled out");
    }
    if (pwd !== confPwd){
      throw new Error("Passwords don't match.");
    }
    return createUserWithEmailAndPassword(auth, email, pwd);
  }
  
  function logout(){
    return signOut(auth);
  }

  function login(email, pwd){

    if (!email || !pwd) {
      throw new Error("All fields must be filled out");
    }
    return signInWithEmailAndPassword(auth, email, pwd);
  }

  function resetPassword(email){
    return sendPasswordResetEmail(auth, email);
  }
  function handleUpdateEmail(email){
    return updateEmail(currentUser, email);
  }
  function handleUpdatePassword(pwd, confPwd){
    if (pwd !== confPwd){
      throw new Error("Passwords don't match!");
    }
    return updatePassword(currentUser, pwd);
  }

  const value={
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
      { !loading && children }
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}