import React, { useState } from 'react';
import { Link, Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';
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
  if (!currentMealData){
    return <></>;
  }

  // TODO: CONDITIONALLY RENDER ONLY MEALS THAT BELONG TO SUBSECTION IN VIEW (BREAKFAST, LUNCH...)!

  if (!currentMealData.length){
    return (
      <>
        <div className={`${blurred ? styles.blurred : ''} ${styles.main}`}>
          <div className={styles.unsetContainer}>
            <p>You haven't added any meals to your library yet. Whenever you <Link to='/dashboard/add-meal' style={{textDecoration: 'underline'}}>
                add a meal
              </Link> to your library, it appears on the dashboard.</p>
          </div> 
        </div>
        <Outlet />
      </>
    );
  }
  else {
    return (
      <>
        {/* <Sidebar blurred={blurred}/> */}
        <div className={`${blurred ? styles.blurred : ''} ${styles.main}`}>
          <div className={styles.mainContent}>
            {currentMealData.map(item => 
              <Meal meal={item} key={item.id}/>)}
          </div>
        </div>
        <Outlet />
      </>
    );
  }

  
}