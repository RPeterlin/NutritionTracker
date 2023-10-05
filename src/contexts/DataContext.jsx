import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';


const DataContext = createContext();

export function DataProvider({ children }) {
  
  // User's data (email, target macros...)
  const [currentUserData, setCurrentUserData] = useState(null);
  // List of meals in a user's 'meals' collection
  const [currentMealData, setCurrentMealData] = useState(null);

  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // return updateDoc(doc(db, 'users', currentUser.uid, 'meals', id), diff);
  // On user-change, apply listeners
  useEffect(() => {

    async function getData(){
      onSnapshot(doc(db, 'users', currentUser.uid), doc => {
        setCurrentUserData(doc.data());
      })
      onSnapshot(collection(db, 'users', currentUser.uid, 'meals'), col => {
        const listOfMeals = col.docs.map(doc => {return {...doc.data(), id: doc.id}});
        setCurrentMealData(listOfMeals);
      })
    }

    if (currentUser){
      getData();
    }
    setLoading(false);
    
  }, [currentUser]);


  //
  // USER section
  //
  function addUser(uid, email){
    // On signup, add user to the database
    const docData = {
      userID: uid,
      email: email,
      targetMacros: {
        isSet: false,
        values: {
          calories: null,
          tfat: null,
          sfat: null,
          carbs: null,
          sugar: null,
          protein: null,
        }
      },
      todayList: {},
    }
    return setDoc(doc(db, 'users', uid), docData);
  }

  function updateUser(type, arg){

    if (type === 'email'){
      // Update user's email
      return updateDoc(doc(db, 'users', currentUser.uid), {...currentUserData, email: arg});
    }
    else {
      // Update user's target macros

      // Filter keys that have non-empty & numeric values
      const validKeys = Object.keys(arg).filter(k => arg[k] !== '' && !isNaN(arg[k]));
      if (validKeys.length === 0){
        return null;
      }

      // Get the current targetMacros
      const { isSet, values } = {...currentUserData.targetMacros};
      // Update the values of targetMacros
      validKeys.forEach(e => values[e] = arg[e]);

      // If this is the first time targetMacros are being set, set the remaining key-values pairs to default (0)
      if (!isSet) {
        Object.keys(values).map(k => {
          if (!validKeys.includes(k)){
            values[k] = 0;
          }
        });
      }

      return updateDoc(doc(db, 'users', currentUser.uid), {...currentUserData, targetMacros: {isSet: true, values: values}});
    }
  }


  //
  // LIBRARY section
  //


  function addToLibrary(data){
    data.tag = 'no-tag';
    data.image = 'todo-implement-adding-images';
    return addDoc(collection(db, 'users', currentUser.uid, 'meals'), data);
  }


  function updateLibrary(id, data){

    // Check if there are no changes (empty data)
    if (Object.keys(data).length === 0){
      return null;
    }

    // Get the old version of the meal
    const currentMealDataCopy = {...currentMealData};
    let currentMeal = null;
    Object.keys(currentMealDataCopy).map(keyName => {
      if (currentMealDataCopy[keyName].id === id) {
        currentMeal = currentMealDataCopy[keyName];
      }
    });
    
    // Check if there is any difference between the old and new version
    const diff = {}
    Object.keys(data).map(k => {
      if (data[k] !== currentMeal[k]){
        diff[k] = data[k];
      }
    });

    // If there is no difference, don't do any updates
    if (Object.keys(diff).length === 0){
      return null;
    }

    // Update the database
    return updateDoc(doc(db, 'users', currentUser.uid, 'meals', id), diff);
  }


  function deleteFromLibrary(id){
    return deleteDoc(doc(db, 'users', currentUser.uid, 'meals', id));
  }


  //
  // TODAY-LIST section
  //


  function addToTodayList(data){

    const todayList = {...currentUserData.todayList};
    if (todayList[data.id]){
      todayList[data.id] += 1;
    }
    else {
      todayList[data.id] = 1;
    }
    console.log(todayList);
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }


  function updateTodayList(id, amount){
    
    if (amount === 0){
      return deleteFromTodayList(id);
    }
    const todayList = {...currentUserData.todayList};
    todayList[id] = Number(amount);
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }

  function deleteFromTodayList(id){
    const todayList = {...currentUserData.todayList};
    delete todayList[id];
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }
  
  function clearTodayList(){
    return updateDoc(doc(db, 'users', currentUser.uid), {...currentUserData, todayList: {}});
  }


  const value = {
    currentUserData,
    currentMealData,
    addUser,
    updateUser,
    addToLibrary,
    updateLibrary,
    deleteFromLibrary,
    addToTodayList,
    updateTodayList,
    deleteFromTodayList,
    clearTodayList,
  }

  return (
    <DataContext.Provider value={value}>
      {/* {console.log(loading, currentUserData, currentMealData)} */}


      {!loading && children}
    </DataContext.Provider>
  );
}

export function useData(){
  return useContext(DataContext);
}
