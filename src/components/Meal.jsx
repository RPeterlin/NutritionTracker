import React, { useEffect, useState } from 'react';
import styles from '../styles/Dashboard.module.css';
import { Form, redirect } from 'react-router-dom';

import image from '../assets/images/image0.jpg';
import { useData } from '../contexts/DataContext';



export async function action(request, deleteElement, updateElement){
  const formData = await request.formData();
  const buttonInfo = formData.get('button');
  const [actionType, mealID] = buttonInfo.split(',');

  switch (actionType){

    case 'editImage':
      // TODO
      break;

    case 'delete':
      await deleteElement(mealID);
      return null;

    case 'confirm':
      const data = Object.fromEntries(formData);
      console.log(data);
      delete data.button;

      const filteredData = {};
      Object.keys(data).map(k => {
        if (data[k]){
          filteredData[k] = data[k]
        }
      })
      await updateElement(mealID, filteredData);
      break;

    default:
      console.log("Default");
  }
  return null;
}


function Meal({ meal }){
  
  const [view, setView] = useState("normal");
  const { addToTodayList } = useData();

  // Set view to normal if any of the listed properties changed
  useEffect(() => {
    setView('normal');
  }, [meal.calories, meal.tfat, meal.sfat, meal.carbs, meal.sugar, meal.protein, meal.unit]);

  async function handleAdd(){
    const newMeal = {...meal};
    delete newMeal.image;
    delete newMeal.tag;
    await addToTodayList(newMeal);
    return null;
  }

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
            <button className={styles.editButton} onClick={() => setView("edit")}>Edit</button>
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
                {macros.map((keyName, i) => 
                  <TRow
                    key={i} 
                    ind={i}
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
            <button className={styles.editButton} onClick={() => setView("edit")}>Edit</button>
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
                {macros.map((keyName, i) => 
                <TRow
                  key={i} 
                  ind={i}
                  view={view} 
                  amount={meal[keyName]}>
                </TRow>
                )}
              </tbody>
            </table>
            <span className={styles.mealLabel}>{meal.label}</span>
          </div>

          <div className={styles.upperButtonContainer}>
            <button 
              name='button' 
              value={['editImage', meal.id]}
              className={styles.editImageButton}
            >
              Edit image
            </button>
            <button 
              name='button' 
              value={['delete', meal.id]} 
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>

          <div className={styles.lowerButtonContainer}>
            <button 
              type='submit'
              name='button' 
              value={['confirm', meal.id]} 
              className={styles.confirmButton}
            >
              Confirm
            </button>
            <button 
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
  if (props.view === "info"){
    return (
      <tr>
        <td>{tableHeaders[props.ind]}</td>
        <td>{props.amount + (props.ind === 0 ? " kcal" : "g")}</td>
      </tr>
    );
  }
  else{
    return (
      <tr>
        <td>{tableHeaders[props.ind]}</td>
        <td>
          <input 
            name={macros[props.ind]}
            className={styles.editViewInput}
            type="text" 
            maxLength={5}
            placeholder={props.amount + (props.ind === 0 ? " kcal" : "g")}/>
        </td>
      </tr>
    );
  }
  
}

export default Meal;
const tableHeaders = ["Calories", "Total fat", "Saturated fat", "Total carbohydrates", "Sugar", "Protein"];
const macros = ['calories', 'tfat', 'sfat', 'carbs', 'sugar', 'protein'];