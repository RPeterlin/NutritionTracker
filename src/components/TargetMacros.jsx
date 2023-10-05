import React, { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import styles from '../styles/Profile.module.css';
import { Form } from 'react-router-dom';
import { tableHeaders } from '../utils';


function TargetMacros() {

  const [view, setView] = useState('normal');
  const { currentUserData } = useData();
  const targetMacros = currentUserData?.targetMacros;

  useEffect(() => {
    setView('normal');
  }, [targetMacros]);

  
  if (!targetMacros){
    return;
  }

  // Check if targetMacros were set by the user before
  const isSet = targetMacros.isSet;

  // If not, ask the user to set them
  if (view === 'normal' && !isSet){
    return (
      <div className={styles.targetContainer}>
        <div className={styles.unsetContainer}>
          <p className={styles.header}>It looks like you haven't set your target daily nutrition facts yet. Please set it in order to proceed.</p>
          <div className={styles.buttonContainer}>
            <button onClick={() => setView('edit')}>
              Set my daily macros
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'normal') {
    return (
      <div className={styles.targetContainer}>
        {/* <h1>Your daily target nutrition facts</h1> */}
        <h1>Your daily target nutrition facts</h1>
        <div className={styles.form}> 
          <table className={`${styles.macroTable} ${styles.infoView}`}>
            <thead>
              <tr className={styles.theadRow}>
                <th>Target value</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableHeaders).map((keyName, i) => 
                <TRow
                  key={i}
                  ind={keyName}
                  view={view}
                  amount={targetMacros.values[keyName]}>
                </TRow>
              )}
            </tbody>
          </table>
          <div className={styles.buttonContainer}> 
            <button className={styles.editButton} onClick={() => setView("edit")}>Edit target nutrition facts</button>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className={styles.targetContainer}>
        <h1>Edit your daily target nutrition facts</h1>
        <Form className={styles.form} method='post' replace> 
          <table className={`${styles.macroTable} ${styles.infoView}`}>
            <thead>
              <tr className={styles.theadRow}>
                <th>Target value</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableHeaders).map((keyName, i) => 
                <TRow
                  key={i} 
                  ind={keyName}
                  view={view} 
                  amount={targetMacros.values[keyName]}>
                </TRow>
              )}
            </tbody>
          </table>
          <div className={styles.buttonContainer}> 
            <button 
              className={styles.leftButton}
              name='button'
              value='save'
            >
              Save
            </button>
            <button className={styles.rightButton} onClick={() => setView("normal")}>Cancel</button>
          </div>
        </Form>
      </div>
    );
  }
}

function TRow(props){
  if (props.view === "normal"){
    return (
      <tr>
        <td>{tableHeaders[props.ind]}</td>
        <td className={styles.normalTD}>
          <div className={styles.inputDiv}>
            {props.amount + (props.ind === 'calories' ? " kcal" : "g")}
          </div>
        </td>
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
            placeholder={props.amount
              ?
              props.amount + (props.ind === 'calories' ? " kcal" : "g")
              :
              '-'
              }/>
        </td>
      </tr>
    );
  }
}

export default TargetMacros;