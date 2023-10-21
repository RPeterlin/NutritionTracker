import React, { useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import { Form, useActionData } from 'react-router-dom';

import image from '../assets/images/image0.jpg';
import { useData } from '../contexts/DataContext';
import { tableHeaders } from '../utils';


function Meal({ meal }){
  
  const [view, setView] = useState('normal');
  const [previousMeal, setPreviousMeal] = useState(meal);
  const err = useActionData();
  const [ignoreErr, setIgnoreErr] = useState(false);
  const { addToTodayList, deleteFromLibrary } = useData();

  // Could use useEffect for this, but the official documentation recommends to do it manually
  if (previousMeal !== meal) {
    setPreviousMeal(meal);
    setView('normal');
  }

  async function handleAdd(){
    const newMeal = {...meal};
    delete newMeal.image;
    delete newMeal.tag;
    await addToTodayList(newMeal);
    return null;
  }
  
  const  { errorMessage, errorID } = err ? err : {errorMessage: false, errorID: false};

  switch (view){
    case "normal":
      return (
        <div className={styles.meal}>
          <div className={styles.header}>
            <img src={image}></img> 
            <span className={styles.mealLabel}>{meal.label}</span>
          </div>
          <div className={styles.upperButtonContainer}>
            <button className={styles.addButton} onClick={handleAdd}>Add to my Today-list</button>
          </div>
          <div className={styles.lowerButtonContainer}>
            <button className={styles.infoButton} onClick={() => setView("info")}>Info</button>
            <button className={styles.editButton} onClick={() => {
              setView("edit");
              setIgnoreErr(true);
            }}>Edit</button>
          </div>
        </div>
      );
    case "info":
      return (
        <div className={styles.meal}>
          <div className={styles.header}>
            <table className={`${styles.macroTable} ${styles.infoView}`}>
              <thead>
                <tr className={styles.theadFirstRow}>
                  <th colSpan={2}>Nutrition facts</th>
                </tr>
                <tr className={styles.theadSecondRow}>
                  <th>Base unit</th>
                  <th>{meal.unit}</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableHeaders).map((keyName, i) => 
                  <TRow
                    key={i} 
                    ind={keyName}
                    view={view} 
                    amount={meal[keyName]}>
                  </TRow>
                )}
              </tbody>
            </table>
            <span className={styles.mealLabel}>{meal.label}</span>
          </div>
          <div className={styles.upperButtonContainer}> 
            <button className={styles.addButton}>Add to my Today-list</button>
          </div>
          <div className={styles.lowerButtonContainer}>
            <button className={styles.backButton} onClick={() => setView("normal")}>Back</button>
            <button className={styles.editButton} onClick={() => {
              setView("edit");
              setIgnoreErr(true);
            }}>Edit</button>
          </div>
        </div>
      );
    case "edit":
      return (
        <Form method='post' className={styles.meal}>
          <div className={styles.header}>
            <table className={`${styles.macroTable} ${styles.editView}`}>
             <thead>
                <tr className={styles.theadFirstRow}>
                  <th colSpan={2}>Nutrition facts</th>
                </tr>
                <tr className={styles.theadSecondRow}>
                  <th>Base unit</th>
                  <th>
                    <input 
                      name='unit'
                      className={`${styles.editViewInput} ${styles.unitInput}`}
                      type="text" 
                      maxLength={15}
                      placeholder={meal.unit}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableHeaders).map((keyName, i) => 
                <TRow
                  key={i} 
                  ind={keyName}
                  view={view} 
                  amount={meal[keyName]}>
                </TRow>
                )}
              </tbody>
            </table>
            {(errorID && errorID == meal.id && !ignoreErr) 
            ?
              <h3>{errorMessage}</h3>
            :
              <span className={styles.mealLabel}>{meal.label}</span>
            }
          </div>

          <div className={styles.upperButtonContainer}>
            <button 
              type='button' 
              className={styles.editImageButton}
              onClick={() => setView('normal') /* DO SOMETHING ABOUT THIS */}
            >
              Edit image
            </button>
            <button 
              type='button' 
              className={styles.deleteButton}
              onClick={() => deleteFromLibrary(meal.id)}
            >
              Delete
            </button>
          </div>

          <div className={styles.lowerButtonContainer}>
            <button 
              type='submit'
              name='mealID'
              value={meal.id} 
              className={styles.confirmButton}
              onClick={() => setIgnoreErr(false)}
            >
              Confirm
            </button>
            <button 
              type='button'
              className={styles.cancelButton} 
              onClick={() => setView("normal")}
            >
              Cancel
            </button>
          </div>
        </Form>
      );

    default:
      alert("Unknown meal view!");
  }
}

function TRow(props){
  if (props.view === 'info'){
    return (
      <tr>
        <td>{tableHeaders[props.ind]}</td>
        <td>{props.amount + (props.ind === 'calories' ? ' kcal' : 'g')}</td>
      </tr>
    );
  }
  else{
    return (
      <tr>
        <td>{tableHeaders[props.ind]}</td>
        <td>
          <input 
            name={props.ind}
            className={styles.editViewInput}
            type="text" 
            maxLength={5}
            placeholder={props.amount + (props.ind === 'calories' ? " kcal" : "g")}/>
        </td>
      </tr>
    );
  }
  
}

export default Meal;