// auth.js
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signOut,
         getAuth,
         onAuthStateChanged,
         updateProfile,
         } 
from 'firebase/auth';
import { auth } from "../firebase";


  export const createUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user);

      await updateProfile(user, {displayName});
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error creating user:', errorCode, errorMessage);
    }
  };


export const signInUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully!');
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully!');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
