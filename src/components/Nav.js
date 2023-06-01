import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOutUser } from "../handlers/handleAuth";

function Nav() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser();
  };

  return (
    <div class="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
      <div class="px-4">
        <div class="flex items-center justify-between">
          <div class="flex shrink-0">
            <a aria-current="page" class="flex items-center" href="/home">
              <img class="h-10 w-auto" src="https://www.svgrepo.com/show/510441/logo-reason.svg" alt="" />
              <p class="sr-only">website title</p>
            </a>
          </div>
          <div class="hidden md:flex md:items-center md:justify-center md:gap-5">
            <a aria-current="page"
              class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#">How it works</a>
            <a class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#">Pricing</a>
          </div>
          <div class="flex items-center justify-end gap-3">
            {isUserLoggedIn ? (
              <button
                class="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            ) : (
              <a
                class="hidden items-center justify-center rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-blue-300 sm:inline-flex"
                href="/login"
              >
                Sign in
              </a>
            )}
            <a href="/account">
                <svg class="profile-photo" width="35" height="35">
                    <defs>
                        <pattern id="profile-pattern" width="100%" height="100%">
                            <image href="https://i.imgur.com/kyFJLvY.jpeg" width="35" height="35" />
                         </pattern>
                 </defs>
                  <circle cx="18" cy="18" r="18" fill="url(#profile-pattern)" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
