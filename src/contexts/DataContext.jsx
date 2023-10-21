import React, { createContext, useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { tableHeaders, numericInputCheck } from '../utils';


const DataContext = createContext();

export function DataProvider({ children }) {

  // Includes user's data (email, target macros...)
  const [currentUserData, setCurrentUserData] = useState(null);
  // A list of meals in the current-user's collection
  const [currentMealData, setCurrentMealData] = useState(null);

  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    function getData() {
      const unsubscribeUserData = onSnapshot(doc(db, 'users', currentUser.uid), doc => {
        setCurrentUserData(doc.data());
      });
      const unsubscribeMealData = onSnapshot(collection(db, 'users', currentUser.uid, 'meals'), col => {
        const listOfMeals = col.docs.map(doc => {return {...doc.data(), id: doc.id}});
        setCurrentMealData(listOfMeals);
      });
      return {unsubscribeUserData, unsubscribeMealData};
    }

    if (currentUser) {
      // onLogin: get data
      const { unsubscribeUserData, unsubscribeMealData } = getData();
      setLoading(false);
      return () => {
        unsubscribeUserData();
        unsubscribeMealData();
      }
    }
    else {
      // onLogout: clear data (this scenario also happens on the initial visit when the user isn't logged in yet)
      setCurrentUserData(null);
      setCurrentMealData(null);
      setLoading(false);
    }
  }, [currentUser]);

  function addUser(uid, email) {
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

  function updateUser(type, arg) {

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

  function addToLibrary(data) {

    // Check if required fields are set
    if (!data.label || !data.unit || !data.calories){
      throw new Error('Please fill the required fields');
    }
    // Check if optional fields are either numeric or not set ('')
    const invalidKey = numericInputCheck(data, ['label', 'unit', 'cat']);
    if (invalidKey){
      throw new Error(`"${tableHeaders[invalidKey]}" has to be a number.`);
    }
    
    // Set the rest of the fields to default values (0)
    Object.keys(data).forEach((key) => {
      if(data[key] === ''){
        data[key] = 0;
      }
    });

    // Append the fields that will be required in the next version
    data.tag = 'no-tag';
    data.image = 'todo-implement-adding-images';

    // Add it to the collection/library
    return addDoc(collection(db, 'users', currentUser.uid, 'meals'), data);
  }

  function updateLibrary(id, data) {
    
    // Check if there are no fields that were set (empty data)
    const oneFieldIsNonEmpty = Object.keys(data).map(k => data[k] !== '').reduce((a, c) => a || c, false);
    if (!oneFieldIsNonEmpty){
      throw new Error("At least one field must be changed.")
    }

    // Check if the fields that are set are actually numeric
    const invalidKey = numericInputCheck(data, ['label', 'unit', 'cat']);
    if (invalidKey){
      throw new Error(`"${tableHeaders[invalidKey]}" has to be a number.`);
    }

    // Get the old version of the meal
    let oldMeal = currentMealData.find(meal => meal.id === id);

    // Check if there is any difference between the old and new version
    const diff = {}
    Object.keys(data).map(k => {
      if (data[k] !== '' && data[k] !== oldMeal[k]){
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

  function addToTodayList(data) {

    const todayList = {...currentUserData.todayList};
    // If already on the list, increase the count, else add it to the list
    if (todayList[data.id]){
      todayList[data.id] += 1;
    }
    else {
      todayList[data.id] = 1;
    }
    // Update today-list
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }

  function updateTodayList(id, amount) {

    if (!amount){
      throw new Error('Please enter a new amount.');
    }

    if (isNaN(amount)){
      throw new Error('New amount has to be a number.');
    }

    if (amount === 0){
      return deleteFromTodayList(id);
    }

    const todayList = {...currentUserData.todayList};
    todayList[id] = Number(amount);
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }

  function deleteFromTodayList(id) {
    const todayList = {...currentUserData.todayList};
    delete todayList[id];
    return updateDoc(doc(db, 'users', currentUser.uid), {todayList: todayList});
  }

  function clearTodayList() {
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
      { !loading && children }
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext);
}