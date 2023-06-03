import React, { useEffect, useState } from "react";
import { getDocs, query, collection, doc, getDoc, } from "firebase/firestore";
import { storage, firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from "../firebase";
import CreateReply from "../utils/CreateReply.js";
import FetchReplies from "./FetchReplies";
import LikeAnimation from "../animations/LikeAnimation";
import "./fetchthreads.css";



const FetchThreads = () => {
  const [threadList, setThreadList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(getAuth(app));

  

  useEffect(() => {
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

    fetchThreads();
  }, []);

  return (
    <div className="p-4">
  {isLoading ? (
    <p>Loading threads...</p>
  ) : (
    <div className="space-y-4 border-none">
      {threadList.map((thread) => (
        <div id="thread__item" key={thread.id} className="p-6 h-120 shadow-xl rounded-lg relative">
          <h3 className="text-xl font-bold mb-2 w-1/3">{thread.title}</h3>
          <p className="p-2 w-1/2 overflow-auto h-40">{thread.description}</p>
          <p className="text-gray-500 text-sm mb-4 w-1/2">by: {user.displayName}</p>
          <p className="text-gray-400 text-sm italic font-extralight">{thread.createdAt.toLocaleDateString()}</p>
          <div className="relative">
            <div id="media__container" className="w-96 h-60 bottom-0 right-10 absolute">
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
          <div class="w-full h-10 flex relative">
                <CreateReply thread={thread} />
          </div>
          <div id="comments__container" class="flex-row p-2 mt-14 h-40 w-1/2">
            <FetchReplies thread={thread} limit={2} />
          </div>
          <div id="reactions__container" class="bottom-20 w-64 h-16 justify-center text-center flex absolute">
            <label id="views__icon__label" class="italic absolute top-16 w-20 h-8 justify-center text-center">
              23240
            </label>
              <img class="w-16 h-auto p-2" src="https://www.svgrepo.com/show/103061/eye.svg" />
              <label id="likes__icon__label" class="italic absolute top-16 w-20 h-8 justify-center text-center">
                1000
              </label>
              <button>
              <img class="w-16 h-auto p-2 mx-10" src="https://i.pinimg.com/564x/06/61/19/0661199855c9b3ac85019f135445668f.jpg" />
              </button>
              <label id="comments__icon__label" class="italic w-20 h-8 overflow-hidden justify-center text-center absolute top-16">33
              </label>
              <button>
              <img class="w-14 h-auto p-2 ml-6" src="https://www.svgrepo.com/show/498779/comment-text.svg" />
              </button>
            </div>
        </div>
      ))}
    </div>
  )}
</div>
 );
};

export default FetchThreads;
