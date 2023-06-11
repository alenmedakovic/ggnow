import React, { useEffect, useState } from "react";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebase";
import { getAuth } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";
import "./fetchreplies.css";

const FetchReplies = ({ thread, limit, onTotalReplies }) => {
  const [replyList, setReplyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amountReplies, setAmountReplies] = useState(0);

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

        const repliesLength = repliesData.length;
        setAmountReplies(repliesLength);


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

  const handleClickOnReply = () => {
    const selectedReply = thread.id;
    console.log(selectedReply);
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading replies...</p>
      ) : (
        <ul id="ul__replies">
          {replyList.map((reply, index) => (
            <li id="li__replies" key={reply.id}>
              <a className="cursor-pointer align-middle" onClick={() => handleClickOnReply(thread)}>
              {reply.photoURL && <button> <img id="user__photo" src={reply.photoURL} alt="Profile Photo" /> </button>}
              <p>{reply.content}</p>
              </a>
            </li>
          ))}  
        </ul>
      )}
    </div>
  );
};

export default FetchReplies;
