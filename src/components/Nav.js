import React, { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOutUser } from "../handlers/handleAuth";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app} from "../firebase";

function Nav() {
  const [user] = useAuthState(getAuth(app));
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [profilePhotoURL, setProfilePhotoURL] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsUserLoggedIn(true);
        fetchProfilePhoto(user);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  const handleSignOut = () => {
    signOutUser();
  };

  const fetchProfilePhoto = async (user) => {
    const storage = getStorage();

    const waitForUserUID = async () => {
      if (!user || !user.uid ) {
        console.log("No user UID, waiting...");
        await new Promise((resolve) => setTimeout(resolve, 200));
        await waitForUserUID();
      }
    };

    await waitForUserUID();

    console.log("userID now availible");

    const userUID = user.uid;
    // Define the storage path for the profile photo
    const profilePhotoPath = `users/${userUID}/media/profile/profile-photo.jpg`;
  
    try {
      const profilePhotoRef = ref(storage, profilePhotoPath);

      const profilePhotoDownloadURL = await getDownloadURL(profilePhotoRef);
  
      // Save the download URL in a variable or state
      setProfilePhotoURL(profilePhotoDownloadURL);
      // You can set the profilePhotoURL state or use it as needed
  
      // ...
    } catch (error) {
      console.error("Error fetching photos:", error);
    }  
  };

  return (
    <div class="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
      <div class="px-4">
        <div class="flex items-center justify-between">
          <div class="flex shrink-0">
            <a aria-current="page" class="flex items-center" href="/home">
              <img class="h-10 w-auto" src="https://www.svgrepo.com/show/510441/logo-reason.svg" alt="" />
              <p class="sr-only">website</p>
            </a>
          </div>
          <div class="absolute left-16">
          <input class="border-2 border-gray-300 rounded-xl w-1/2 h-8" type="text" />
          <button type="button">
            <img class="h-6 w-auto mb-1 px-2 inline-block" src="https://cdn.iconscout.com/icon/free/png-512/free-search-1768073-1502246.png?f=avif&w=512" />
          </button>
          </div>
          <div class="hidden md:flex md:items-center md:justify-center md:gap-5">
            <a aria-current="page"
              class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#">Topics</a>
            <a class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              href="#">Privacy</a>
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
                            <image href={profilePhotoURL} width="35" height="35" />
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
