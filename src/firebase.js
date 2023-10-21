import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAT3UcNeO7_PcqdBPT0UEXZ2OXpWVnR__E",
  authDomain: "nt-clear.firebaseapp.com",
  projectId: "nt-clear",
  storageBucket: "nt-clear.appspot.com",
  messagingSenderId: "961151227921",
  appId: "1:961151227921:web:d0857e6bf222ed4aca39b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;