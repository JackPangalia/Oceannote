// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUi2PGTQs2TQKmmoBdNTVk7PojZeE7sfo",
  authDomain: "oceannote-9fec5.firebaseapp.com",
  projectId: "oceannote-9fec5",
  storageBucket: "oceannote-9fec5.appspot.com",
  messagingSenderId: "132429297923",
  appId: "1:132429297923:web:4ad479c9dad8229e3dd136"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
  return app
}

export const db = getFirestore(app);