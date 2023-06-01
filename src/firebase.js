// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCORrREZ7PfHlL43WACMQyIwvG9lzg8wwg",
  authDomain: "ggnow-519de.firebaseapp.com",
  projectId: "ggnow-519de",
  storageBucket: "ggnow-519de.appspot.com",
  messagingSenderId: "894679663915",
  appId: "1:894679663915:web:a756a31fc875e97bedb16e",
  measurementId: "G-N5SBNHGH5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, storage, app};