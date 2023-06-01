import React, { useState } from 'react';
import { signInUser, signOutUser, createUser } from "../handlers/handleAuth";

function Register() {
    const [ displayName, setDisplayName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");


    const handleCreateUser = () => {

        if (password !== confirmedPassword) {
            console.log("passwords do not match;", password, confirmedPassword)
            return;
        }

        createUser(email, password, displayName);
    }


  return (
    <div>
        <div class="bg-grey-lighter min-h-screen flex flex-col">
            <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 class="mb-8 text-3xl text-center">Sign up</h1>
                    <input 
                        type="text"
                        class="block border border-grey-light w-full p-3 rounded mb-4"
                        name="displayName"
                        placeholder="Username"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)} />
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
                    <input 
                        type="password"
                        class="block border border-grey-light w-full p-3 rounded mb-4"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)} />

                    <button
                        type="submit"
                        class="w-full text-center py-3 rounded bg-red-500 bg-green text-white hover:bg-green-dark focus:outline-none my-1"
                        onClick={handleCreateUser}
                    >Create Account</button>

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
                    Already have an account? 
                    <a class="no-underline border-b border-blue text-blue" href="../login/">
                        Log in
                    </a>.
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register
