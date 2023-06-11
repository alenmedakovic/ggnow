import React, { useContext, useEffect, useState } from "react";
import {
  getDocs,
  query,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  where,
  collectionGroup
} from "firebase/firestore";
import { storage, firestore } from "../firebase";

import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../firebase";
import CreateReply from "../utils/CreateReply.js";
import FetchReplies from "./FetchReplies";
import FetchReplyCount from "./FetchReplyCount";
import { ThemeContext } from "../utils/ThemeContext";
import "./fetchthreads.css";

const FetchThreads = () => { 
  const [threadList, setThreadList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(getAuth(app));
  const [likedThreads, setLikedThreads] = useState([]);
  const [repliesCount, setRepliesCount] = useState();

  const { isDarkMode } = useContext(ThemeContext);


  const fetchThreads = async () => {
    try {
      const threadsQuery = query(collection(firestore, "threads"));
      const threadsSnapshot = await getDocs(threadsQuery);
      const threads = threadsSnapshot.docs.map((doc) => {
        const data = doc.data();
        const { seconds, nanoseconds } = data.createdAt;
        const createdAt = new Date(seconds * 1000 + nanoseconds / 1000000); // Convert to JavaScript Date object

        return {
          id: doc.id,
          ...data,
          createdAt: createdAt,
        };
      });

      setIsLoading(false);
      setThreadList(threads);


    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  const fetchLikedThreads = async () => {
    if (user) {
      try {
        const likedThreadsRef = collection(firestore, "threads");
        const likedThreadsQuery = query(
          likedThreadsRef,
          where(`likes.${user.uid}`, "==", true)
        );
        const likedThreadsSnapshot = await getDocs(likedThreadsQuery);
  
        const likedThreads = likedThreadsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const { seconds, nanoseconds } = data.createdAt;
          const createdAt = new Date(seconds * 1000 + nanoseconds / 1000000);
  
          return {
            id: doc.id,
            ...data,
            createdAt: createdAt,
          };
        });
  
        setLikedThreads(likedThreads);
        console.log(likedThreads); 
      } catch (error) {
        console.error("Error fetching liked threads:", error);
      }
    }
  };
  

  const handleLike = async (threadId) => {
    if (user && user.uid) {
      // Update local state immediately
      setThreadList((prevThreads) => {
        return prevThreads.map((thread) => {
          if (thread.id === threadId) {
            const likes = Array.isArray(thread.likes) ? thread.likes : [];
            if (likes.includes(user.uid)) {
              return { ...thread, likes: likes.filter((id) => id !== user.uid) };
            } else {
              return { ...thread, likes: [...likes, user.uid] };
            }
          }
          return thread;
        });
      });
  
      try {
        // Update Firestore data
        const threadRef = doc(firestore, "threads", threadId);
        const threadDoc = await getDoc(threadRef);
  
        if (threadDoc.exists()) {
          const threadData = threadDoc.data();
          const threadLikes = Array.isArray(threadData.likes) ? threadData.likes : [];
  
          if (threadLikes.includes(user.uid)) {
            const updatedLikes = threadLikes.filter((id) => id !== user.uid);
            await updateDoc(threadRef, { likes: updatedLikes });
          } else {
            const updatedLikes = [...threadLikes, user.uid];
            await updateDoc(threadRef, { likes: updatedLikes });
          }
        }
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    }
  };
 

  useEffect(() => {
    fetchThreads();
    fetchLikedThreads();
}, []);

return (
  <div className="p-4">
    {isLoading ? (
      <p>Loading threads...</p>
    ) : (
      <div className="space-y-4 border-none">
        {threadList.map((thread) => {
          const isLiked = thread.likes && thread.likes.includes(user.uid);

          return (
            <div
              id="thread__item"
              key={thread.id}
              className="p-6 h-120 shadow-xl rounded-lg relative"
            >
              <h3 className="text-xl font-bold mb-2 w-1/3">{thread.title}</h3>
              <p className="p-2 w-1/2 overflow-auto h-40">
                {thread.description}
              </p>
              <p className="text-gray-500 text-sm mb-4 w-1/2">
                by: {user.displayName}
              </p>
              <p className="text-gray-400 text-sm italic font-extralight">
                {thread.createdAt.toLocaleDateString()}
              </p>
              <div className="relative">
                <div
                  id="media__container"
                  className="w-96 h-60 bottom-0 right-10 absolute"
                >
                  {thread.media ? (
                    thread.media.endsWith(".mov") ||
                    thread.media.endsWith(".avi") ||
                    thread.media.endsWith(".mp4") ? (
                      <video className="w-full h-full" controls>
                        <source src={thread.media} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        className="w-full h-full object-cover rounded"
                        src={thread.media}
                        alt="Media"
                      />
                    )
                  ) : (
                    <div className="flex flex-col bg-gray-500 border-gray-300 shadow-md items-center h-60 w-96 absolute top-10 justify-center">
                      <p className="text-gray-500">No media available</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-10 mt-6 flex relative">
                <CreateReply thread={thread} />
              </div>
              <div
                id="comments__container"
                className="flex-row p-2 mt-6 h-40 w-1/2"
              >
                <FetchReplies thread={thread} limit={2} />
              </div>
              <div
                id="reactions__container"
                className="bottom-20 w-64 h-16 justify-center text-center flex absolute"
              >
                <label
                  id="views__icon__label"
                  className="italic absolute top-16 w-20 h-8 justify-center text-center"
                >
                  1
                </label>
                <img
                  id="views__icon"
                  className="w-16 h-auto"
                  src="https://www.svgrepo.com/show/103061/eye.svg"
                />
                <label
                  id="likes__icon__label"
                  className="italic absolute top-16 w-20 h-8 justify-center text-center"
                >
                  {Object.keys(thread.likes || {}).length}
                </label>
                <button onClick={() => handleLike(thread.id)}>
                  <div class="mt-4">
                <svg id="likes__icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72"
                 stroke-width="2" stroke="black" fill={isLiked ? "red" : "none"}
                  class="bi bi-heart-fill" viewBox="0 0 25 25"
                  style={{
                    transform: `scale(${isLiked ? 1.2 : 1}) translateX(${isLiked ? '2px' : '0'})`,
                    transition: 'transform 0.3s',
                    // Add more custom styles for when the SVG is liked
                    // For example, change colors, add shadows, etc.
                  }}>
                     <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
                 </div>
                </button>
                <label
                  id="comments__icon__label"
                  className="italic w-16 h-auto overflow-hidden justify-center text-center absolute top-16"
                >
                  <FetchReplyCount thread={thread} />
                </label>
                <button>
                  <img
                    id="replies__icon"
                    className="w-14 h-auto"
                    src="https://www.svgrepo.com/show/498779/comment-text.svg"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

};

export default FetchThreads;
