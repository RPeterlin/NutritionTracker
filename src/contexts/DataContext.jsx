import { db } from '../firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';


const DataContext = createContext();

export function DataProvider({ children }) {

  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();


  useEffect(() => {
    // On login: add listener to the relevant user document
    if (currentUser){
      const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), doc => {
        // Save feched data into currentData state
        setCurrentData(doc.data());
        setLoading(false);
        return unsubscribe;
      });
    }
    // On logout: clear the current data
    else {
      setCurrentData(null);
      setLoading(false);
    }
  }, [currentUser]);

  function addUser(uid, email){
    const docData = {
      userID: uid,
      email: email,
      target_macros: {
        calories: null,
        tfat: null,
        sfat: null,
        carbs: null,
        sugars: null,
        protein: null,
      },
      today_list: [],
    }

    return setDoc(doc(db, 'users', uid), docData);
  }

  function updateUser(props){
    // Update target_macros and/or email
  }
  function addElement(props){
    // Modify user's meals
  }
  function deleteElement(props){
    // Modify user's meals
  }
  function updateElement(props){
    // Modify user's meals
  }


  const value = {
    currentData,
    addUser,
    updateUser,
    addElement,
    deleteElement,
    updateElement,
  }

  return (
    <DataContext.Provider value={value}>
      {!loading && children}
    </DataContext.Provider>
  );
}

export function useData(){
  return useContext(DataContext);
}
