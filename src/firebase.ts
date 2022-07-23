// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "XXXXX",
  authDomain: "XXXXX.firebaseapp.com",
  projectId: "XXXXX",
  storageBucket: "XXXXX.appspot.com",
  messagingSenderId: "XXXXX",
  appId: "XXXXX",
  measurementId: "XXXXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
const analytics = getAnalytics(app);
