export default function mapErrorMessages(errorMessage){
  switch (errorMessage) {

    case 'Firebase: Password should be at least 6 characters (auth/weak-password).':
      return 'Password should be at least 6 characters.';

    case 'Firebase: Error (auth/email-already-in-use).':
      return 'Email already in use.';

    case 'Firebase: Error (auth/user-not-found).':
      return "User with provided email doesn't exist.";

    case 'Firebase: Error (auth/wrong-password).':
      return "Username and password don't match.";
    
    case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
      return "Too many login attempts. Try again later."
    
    default:
      return 'Unknown error occured';
  }
}

export const tableHeaders = {
  calories: 'Calories',
  tfat: 'Total fat',
  sfat: 'Saturated fat',
  carbs: 'Total carbohydrates',
  sugar: 'Sugar',
  protein: 'Protein',
};

export function numericInputCheck(data, exceptions){
  let invalid = null;
  Object.keys(data).map(keyName => {
    if (!exceptions.includes(keyName) && isNaN(data[keyName])){
      invalid = keyName;
    }
  });
  
  return invalid;
}
