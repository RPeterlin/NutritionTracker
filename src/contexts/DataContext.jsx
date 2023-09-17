import { db } from '../firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';


const DataContext = createContext();

export function DataProvider({ children }) {

  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();


  useEffect(() => {
    // On login: add listener to the relevant user document
    if (currentUser){
      const unsubscribe = onSnapshot(doc(db, 'users', '123'), doc => {
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

  }
  function updateUser(props){

  }
  function addElement(props){

  }
  function deleteElement(props){

  }
  function updateElement(props){

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
  return useData(DataContext);
}
