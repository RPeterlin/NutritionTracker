import React from 'react'
import { Form, Navigate, redirect, useActionData } from 'react-router-dom';
import styles from '../styles/AddMeal.module.css';
import { tableHeaders, numericInputCheck } from '../utils';


export function loader(request, currentUser){
  if (!currentUser){
    return redirect(`/login?redirectTo=/add-meal`);
  }
  return null;
}

export async function action(request, addToLibrary, rerender){
  const formData = await request.formData();
  let data = Object.fromEntries(formData);

  if (data.button === 'cancel'){
    return redirect('/dashboard');
  }
  else if (data.button === 'addImage'){
    // DO SOMETHING WITH THIS!!!!
    return redirect('/dashboard');
  }


  delete data.button;
  // Validate data
  if (!data.label || !data.unit || !data.calories){
    return 'Please fill the required fields';
  }
  // Set default values to optional fields
  Object.keys(data).forEach((key) => {
    if(data[key] === ''){
      data[key] = 0;
    }
  });

  // Check if fields are numeric
  const invalidKey = numericInputCheck(data, ['label', 'unit', 'cat']);
  if (invalidKey){
    return `"${tableHeaders[invalidKey]}" has to be a number.`;
  }
  try {
    await addToLibrary(data);
    const [forceRender, setForceRender] = rerender;
    // REDIRECT HAS TO HAPPEN BEFORE RE-RENDER GOES THROUGH !!!!!!!!!!!!!
    setTimeout(() => setForceRender(!forceRender), 10);
    return redirect('/dashboard');
  }
  catch (err) {
    return err.message;
  }
}


function AddMeal() {
  const errorMessage = useActionData();

  return (
    <div className={styles.addWindow}>
      {errorMessage && <h3 className={styles.errorMsg}>{errorMessage}</h3>}
      <Form method='post' className={styles.addForm}>
        <div className={styles.labelInput}>
          <label htmlFor="label">Name <span className={styles.required}>(required)</span></label>
          <input type="text" name="label" placeholder='Lasagna' />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="unit">Unit <span className={styles.required}>(required)</span></label>
          <input type="text" name="unit" placeholder="Tray" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="unit">Category </label>
          <input type="text" name="cat" placeholder="Breakfast, lunch..." />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="calories">Calories <span className={styles.required}>(required)</span></label>
          <input type="text" name="calories" placeholder="999 kcal" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="tfat">Total fat </label>
          <input type="text" name="tfat" placeholder="100g" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="sfat">Saturated fat </label>
          <input type="text" name="sfat" placeholder="100g" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="carbs">Total carbohydrates </label>
          <input type="text" name="carbs" placeholder="100g" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="sugar">Sugars </label>
          <input type="text" name="sugar" placeholder="100g" />
        </div>
        <div className={styles.labelInput}>
          <label htmlFor="protein">Protein </label>
          <input type="text" name="protein" placeholder="100g" />
        </div>
        
        <div className={styles.formButtonContainer}>
          <button id={styles.addImageButton} name='button' value='addImage'><span id={styles.addImgButtonTxt}>
            Add an image of your meal</span>
          </button>
          <button id={styles.submitButton} type='submit' name='button' value='submit'>Submit</button>
          <button id={styles.cancelButton} name='button' value='cancel'>Cancel</button>
        </div>
      </Form>
    </div>
  );
}

export default AddMeal;