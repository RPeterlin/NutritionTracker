import React, { useState } from 'react';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';
import Meal from '../components/Meal';
import styles from '../styles/Dashboard.module.css';
import Sidebar from '../components/Sidebar';
import { useData } from '../contexts/DataContext';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/dashboard`);
  }
  return null;
}


export default function Dashboard() {

  // Things for add-a-meal subpage (blur the background if we are on route ..../dashboard/add-meal)
  const location = useLocation().pathname.split('/');
  const blurred = location[location.length-1] === 'add-meal';

  const { currentMealData } = useData();

  // TODO: CONDITIONALLY RENDER ONLY MEALS THAT BELONG TO SUBSECTION IN VIEW (BREAKFAST, LUNCH...)!

  return (
    <>
      <Sidebar blurred={blurred}/>
      <main className={blurred ? styles.blurred : ''}>
        <div className={styles.mainContent}>
          {currentMealData && currentMealData.map(item => 
            <Meal meal={item} key={item.id}/>)}
        </div>
      </main>
      <Outlet />
    </>
  );
}