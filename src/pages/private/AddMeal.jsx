import React from 'react'
import { Form, redirect, useActionData, useNavigate } from 'react-router-dom';
import styles from '../../styles/AddMeal.module.css';
import { tableHeaders } from '../../utils';


export async function action(request, addToLibrary){

  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  try {
    // Even though 'addToLibrary' is an asyn function, we are NOT using the 'await' since we want the redirect to happen before the addToLibrary finishes (and thus triggers useEffect in dataContext which in turn triggers state update and consequently re-render. Redirect has to happen before the entire app re-renders!!!).
    addToLibrary(data);
    return redirect('/dashboard');

  }
  catch (err) {
    return err.message;
  }
}


function AddMeal() {
  const errorMessage = useActionData();
  const navigate = useNavigate();

  return (
    <div className={styles.addWindow}>
      {errorMessage && <h3 className={styles.errorMsg}>{errorMessage}</h3>}

      <Form method='post' className={styles.addForm}>
        <FormRow name={'label'} txtField='Name' placeholder='Lasagna' req={true} />
        <FormRow name={'unit'} txtField='Unit' placeholder='Tray' req={true} />
        <FormRow name={'cat'} txtField='Category' placeholder='Breakfast, lunch...' />

        {Object.keys(tableHeaders).map(name => 
          <FormRow 
            key={name}
            name={name}
            txtField={tableHeaders[name]}
            placeholder={name === 'calories' ? '999 kcal' : '100g'}
            req={name === 'calories'} 
          />
        )}
        
        <div className={styles.formButtonContainer}>
          <button id={styles.addImageButton} type='button' disabled={true /* DO SOMETHING ABOUT THIS */} onClick={() => {navigate('/dashboard')}}>
            <span id={styles.addImgButtonTxt}>Add an image of your meal</span>
          </button>
          <button id={styles.submitButton} type='submit' >Submit</button>
          <button id={styles.cancelButton} type='button' onClick={() => navigate('/dashboard')} >Cancel</button>
        </div>
      </Form>
    </div>
  );
}


function FormRow({ name, txtField, placeholder, req=false }){
  return (
    <div className={styles.labelInput}>
      <label htmlFor={name}>
        {txtField} {req && <span className={styles.required}>(required)</span>}
      </label>
      <input type="text" name={name} placeholder={placeholder} />
    </div>
  );
}

export default AddMeal;