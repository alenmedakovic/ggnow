import React, { useState, useEffect } from 'react';
import { signInUser, signOutUser } from '../handlers/handleAuth';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
    const navigate = useNavigate();
    const [ password, setPassword ] = useState("");
    const [ email, setEmail ] = useState("");

    function handleLogIn() {
        signInUser(email, password);
    }

    useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log("your user id:", uid);
          navigate("/home");
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    })


  return (
    <div>
        <div class="bg-grey-lighter min-h-screen flex flex-col">
            <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 class="mb-8 text-3xl text-center">Login</h1>
                    <input 
                        type="text"
                        class="block border border-grey-light w-full p-3 rounded mb-4"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <input 
                        type="password"
                        class="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        placeholder="Password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />

                    <button
                        type="submit"
                        class="w-full text-center py-3 rounded bg-red-500 bg-green text-white hover:bg-green-dark focus:outline-none my-1"
                        onClick={handleLogIn}
                    >Login</button>

                    <div class="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the 
                        <a class="px-1 no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Terms of Service 
                        </a> and 
                        <a class="px-1 no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </div>

                <div class="text-grey-dark mt-6">
                    Don't have an account? 
                    <a class="no-underline border-b border-blue text-blue" href="../login/">
                        Sign up
                    </a>.
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
