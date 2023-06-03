import React, { useEffect, useState } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firestore } from "../firebase";
import { getAuth } from "firebase/auth";
import "./fetchreplies.css";

const FetchReplies = ({ thread, limit }) => {
  const [replyList, setReplyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const threadId = thread.id;
    const auth = getAuth();
    const storage = getStorage();
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const repliesRef = collection(
          firestore,
          "threads",
          threadId || "",
          "replies"
        );
        const repliesSnapshot = await getDocs(repliesRef);
        const repliesData = [];
        for (const docSnap of repliesSnapshot.docs) {
          const replyData = docSnap.data();
          const userRef = doc(firestore, "users", replyData.uid);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
          const profilePhotoPath = `users/${replyData.uid}/media/profile/profile-photo.jpg`;
          const profilePhotoUrl = await getDownloadURL(ref(storage, profilePhotoPath));
          const reply = {
            id: docSnap.id,
            content: replyData.content,
            uid: replyData.uid,
            photoURL: profilePhotoUrl,
          };
          repliesData.push(reply);
        }

        const limitedReplies =
          limit && limit > 0 ? repliesData.slice(0, limit) : repliesData;

        setReplyList(limitedReplies);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching replies...", error);
      }
    };

    fetchReplies();
  }, [thread.id]);

  return (
    <div>
      {isLoading ? (
        <p>Loading replies...</p>
      ) : (
        <ul>
          {replyList.map((reply, index) => (
            <li key={reply.id}>
              {reply.photoURL && <button> <img id="user__photo" src={reply.photoURL} alt="Profile Photo" /> </button>}
              <p>{reply.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchReplies;
