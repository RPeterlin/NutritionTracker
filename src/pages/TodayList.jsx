import React, { useEffect, useState } from 'react';
import { Form, redirect, useLoaderData } from 'react-router-dom';
import styles from '../styles/TodayList.module.css';
import { useData } from '../contexts/DataContext';


export function loader(request, currentUser){

  if (!currentUser){
    return redirect(`/login?redirectTo=/today-list`);
  }
  return currentUser;
}

export async function action(request, updateTodayList){
  
  const formData = await request.formData();
  const id = formData.get('buttonID');
  const newAmount = formData.get('amount');

  if (!newAmount){
    return null;
  }

  await updateTodayList(id, newAmount)
  return null;
}

function TodayList() {

  const { currentUserData } = useData();
  const todayList = currentUserData?.todayList;

  if (!todayList){
    return <div>Yes</div>
  }

  return (
    <main>
      <table className={styles.todayTable}>
        <thead>
          <tr>
            <th>Name of the meal</th>
            <th>Base unit</th>
            <th>Amount</th>
            <th>Calories (kcal)</th>
            <th>Total fat</th>
            <th>Saturated fat</th>
            <th>Total carbs</th>
            <th>Sugar</th>
            <th>Protein</th>
          </tr>
        </thead>
        <tbody>
          {todayList && Object.keys(todayList).map(k => 
            <TRow 
              key={k} 
              id={k}
              meal={todayList[k].meal} 
              count={todayList[k].count}
            />
          )}
        </tbody>
      </table>
    </main>
  );
}

function TRow({ id, meal, count}){

  const { deleteFromTodayList } = useData();
  const [view, setView] = useState('normal');

  // When count updates, refresh the view
  useEffect(() => {
    setView('normal');
  }, [count]);

  return (
    <tr className={styles.contentRow}>
      <th>{meal.label}</th>
      <th>{meal.unit}</th>
      <th>{count}</th>
      <th>{meal.calories}</th>
      <th>{meal.tfat}</th>
      <th>{meal.sfat}</th>
      <th>{meal.carbs}</th>
      <th>{meal.sugar}</th>
      <th>{meal.protein}</th>
      <td className={styles.btnTd}>
        <button className={styles.todayDeleteBtn} onClick={async () => await deleteFromTodayList(id)}>Delete</button>
      </td>
      <td className={styles.btnTd}>
        {(view === 'normal')
        ?
        <button className={styles.todayEditBtn} onClick={() => setView(true)}>Edit unit</button>
        :
        <Form method='post'>
          <input type='text' placeholder='New amount' name='amount'/>
          <button type='submit' name='buttonID' value={id}>Save changes</button>
          <button onClick={() => setView('normal')}>Cancel</button>
        </Form>
        }
        
      </td>
    </tr>
  );
}

export default TodayList