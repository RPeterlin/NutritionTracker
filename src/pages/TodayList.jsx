import React, { useEffect, useState } from 'react';
import { Form, Link, redirect, useActionData, useLoaderData } from 'react-router-dom';
import styles from '../styles/TodayList.module.css';
import { useData } from '../contexts/DataContext';
import { tableHeaders, numericInputCheck } from '../utils';


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

  if (isNaN(newAmount)){
    return 'New amount has to be a number.';
  }

  try {
    await updateTodayList(id, newAmount)
    return null;
  }
  catch (err){
    return err.message;
  }
}

function TodayList() {

  const { currentUserData, currentMealData, clearTodayList } = useData();
  const errorMessage = useActionData();
  const todayListExists = currentUserData?.todayList;
  const todayList = [];

  if (!currentMealData || !todayListExists){
    return <div>Yes</div>;
  }
  currentMealData.map(meal => {
    if (currentUserData.todayList[meal.id]){
      todayList.push({'id': meal.id, 'meal': meal, 'count': currentUserData.todayList[meal.id]});
    }
  });


  let mealCount = 0;
  const todayListSum = {
    calories: 0,
    carbs: 0,
    protein: 0,
    sfat: 0,
    sugar: 0,
    tfat: 0,
  };

  // Generate total row
  todayList.map(item => {
    mealCount += 1;
    Object.keys(item.meal).map(keyName => {
      if (keyName === 'label' || keyName === 'cat' || keyName === 'unit'){
        return;
      }
      todayListSum[keyName] += Math.round(item.count * Number(item.meal[keyName]));
    });
  });

  // Get target macros
  const targetMacros = currentUserData.targetMacros.values;
  const isSet = currentUserData.targetMacros.isSet;
  // Subtract the two
  const leftToConsume = {};
  Object.keys(targetMacros).map(keyName => {
    leftToConsume[keyName] = Number(targetMacros[keyName] - todayListSum[keyName]);
  });

  if (!Object.keys(todayList).length){
    return <div className={styles.emptyList}>It seems your Today-list is empty. Go to <Link to='/dashboard' style={{textDecoration: 'underline'}}>dashboard</Link> to add some meals to it.</div>
  }

  return (
    <>
      <div className={styles.main}>
        {errorMessage && <h3>{errorMessage}</h3>}
        <table className={styles.todayTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Base unit</th>
              <th>Amount</th>
              <th>Calories</th>
              <th>Total fat</th>
              <th>Saturated fat</th>
              <th>Total carbs</th>
              <th>Sugar</th>
              <th>Protein</th>
            </tr>
          </thead>
          <tbody>
            {todayList.map((item, ind) => 
              <TRow 
                key={item.meal.id} 
                id={item.meal.id}
                meal={item.meal}
                count={item.count}
                lastRow={ind === todayList.length-1 ? true : false}
              />)
            }

            {/* SUM row */}
            <tr className={`${styles.sumUpRow} ${styles.extraRow}`}>
              <td colSpan={3}>Total</td>
              
              {/* Macros */}
              {Object.keys(tableHeaders).map(keyName => 
                  <td key={keyName}>{todayListSum[keyName]}</td>
                )
              }
              <td colSpan={2} className={styles.btnTd}>
                <button className={styles.clearBtn} onClick={async () => await clearTodayList()}>Clear TodayList</button>
              </td>
            </tr>
            
            {isSet
            ?
              <>
                {/* TARGET row */}
                <tr className={`${styles.targetRow} ${styles.extraRow}`}>
                  <td colSpan={3}>Your target</td>

                  {/* Macros */}
                  {Object.keys(tableHeaders).map(keyName => 
                      <td key={keyName}>{targetMacros[keyName]}</td>
                    )
                  }
                </tr>

                {/* SUBTRACTION row */}
                <tr className={`${styles.leftToConsumeRow} ${styles.extraRow}`}>
                  <td colSpan={3}>Left to consume</td>

                  {/* Macros */}
                  {Object.keys(tableHeaders).map(keyName => 
                      <td key={keyName} className={leftToConsume[keyName] < 0 ? styles.negative : styles.positive}>{leftToConsume[keyName]}</td>
                    )
                  }
                </tr>

                <tr className={styles.extraRow}>
                  <td colSpan={9}><span className={styles.positive}>Green numbers</span> indicate you still have room to consume the specific category, while <span className={styles.negative}>red numbers </span> indicate you've exceeded your target daily goal.
                  </td>
                </tr>
              </>
            :
            <tr className={`${styles.targetRow} ${styles.extraRow} ${styles.unsetRow}`}>
              <td colSpan={11}>You haven't set your target daily nutrition facts yet. Go to <Link to='/profile' style={{textDecoration: 'underline'}}>profile</Link> to set it up so it can be used in calculations.</td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </>
  );
}


function TRow({ id, meal, count, lastRow }){

  const { deleteFromTodayList } = useData();
  const [view, setView] = useState('normal');

  // When count updates, refresh the view
  useEffect(() => {
    setView('normal');
  }, [count]);

  return (
      <tr className={`${styles.contentRow} ${lastRow && styles.lastRow}`}>
        {/* Name, unit and amount */}
        <td>{meal.label}</td>
        <td>{meal.unit}</td>
        <td>
          {view === 'normal'
          ?
          <div>{count}</div>
          :
          <Form method='post' id='amountForm'>
            <input className={styles.amountInput} type='text' placeholder={count} name='amount'/>
          </Form>
          }
        </td>

        {/* Macros */}
        {Object.keys(tableHeaders).map(keyName => 
          <td key={keyName}>{meal[keyName]}</td>)}
        
        {/* Buttons */}
        <td className={styles.btnTd}>
          {view === 'normal'
          ?
            <button className={styles.todayDeleteBtn} onClick={async () => await deleteFromTodayList(id)}>Delete</button>
          :
             <button 
              className={styles.todaySaveBtn}
              form='amountForm' 
              type='submit' 
              name='buttonID' 
              value={id}
            >Save</button>
          }
        </td>
        <td className={styles.btnTd}>
          {(view === 'normal')
          ?
          <button className={styles.todayEditBtn} onClick={() => setView(true)}>Edit amount</button>
          :
            <button className={styles.todayCancelBtn} onClick={() => setView('normal')}>Cancel</button>
          }
        </td>
      </tr>
  );
}

export default TodayList