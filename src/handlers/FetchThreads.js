import React, { useEffect, useState } from "react";
import { getDocs, query, collection, doc, getDoc, } from "firebase/firestore";
import { storage, firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from "../firebase";


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
    <div className="space-y-4 border-x-0 border-y-2 shadow-sm border-gray-300">
      {threadList.map((thread) => (
        <div key={thread.id} className="border-gray-300 border-2 p-6 h-80 shadow relative">
          <h3 className="text-xl font-bold mb-2 w-1/3">{thread.title}</h3>
          <p className="p-2 w-1/2 overflow-auto h-40">{thread.description}</p>
          <p className="text-gray-500 text-sm mb-4 w-1/2">by: {user.displayName}</p>
          <p className="text-gray-400 text-sm italic font-extralight">{thread.createdAt.toLocaleDateString()}</p>
          <div className="relative">
            <div className="w-96 h-60 bottom-0 right-10 absolute">
              {thread.media ? (
                thread.media.endsWith(".mov") ||
                thread.media.endsWith(".avi") ||
                thread.media.endsWith(".mp4") ? (
                  <video className="w-full h-full" controls>
                    <source src={thread.media} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    className="w-full h-full object-cover rounded border-1 border-black shadow-md hover:scale-105 transition-transform"
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
        </div>
      ))}
    </div>
  )}
</div>
 );
};

export default FetchThreads;
