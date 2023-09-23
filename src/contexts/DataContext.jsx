import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { redirect } from 'react-router-dom';


const DataContext = createContext();

export function DataProvider({ children }) {
  
  // User's data (email, target macros...)
  const [currentUserData, setCurrentUserData] = useState(null);
  // List of meals in a user's 'meals' collection
  const [currentMealData, setCurrentMealData] = useState(null);

  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();


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
        calories: null,
        tfat: null,
        sfat: null,
        carbs: null,
        sugars: null,
        protein: null,
      },
      todayList: {},
    }
    return setDoc(doc(db, 'users', uid), docData);
  }

  function updateUser(props){
    // TODO
    // Update target_macros and/or email
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
    const currentMeal = currentMealData.filter(meal => meal.id === id)[0];

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
    const todayList = currentUserData.todayList;
    const id = data.id;
    delete data.id;

    if (id in todayList){
      todayList[id].count += 1;
    }
    else {
      todayList[id] = {meal: data, count: 1};
    }
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }
  function updateTodayList(id, amount){
    currentUserData.todayList[id].count = amount;
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: currentUserData.todayList});
  }
  function deleteFromTodayList(id){
    delete currentUserData.todayList[id];
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: currentUserData.todayList});
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
