import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Nav from "./Nav";
import "./home.css";
import CreateThread from '../utils/CreateThread';
import FetchThreads from "../handlers/FetchThreads";
import AdContainer from "../components/AdContainer";

function Home(user) {
    const navigate = useNavigate();

    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          // ...
        } else {
           // navigate("/login");
           console.log("user is no longer signed in.")
          // User is signed out
          // ...
        }
      });
    })

  return (
    <div className="mt-32 relative bg-white flex align-middle justify-center w-full">
    <Nav />
    <div className="w-full max-w-xl h-66 shadow-md flex bg-gray-50 border-2 border-gray-300 rounded">
      <CreateThread />
    </div>
    <div className="w-3/4 left-12 absolute h-infinite top-80">
        <FetchThreads />
    </div>
    <div className="ad__container fixed top-10">
        <AdContainer />
    </div>
  </div>
  )
}

export default Home
