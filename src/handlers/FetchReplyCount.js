import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../firebase";
import { doc } from "firebase/firestore";

const ReplyCount = ({ thread }) => {
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    const threadRef = doc(firestore, "threads", thread.id);
    const unsubscribe = onSnapshot(collection(threadRef, "replies"), (snapshot) => {
      const count = snapshot.size;
      setReplyCount(count);
    });

    return () => unsubscribe();
  }, [thread]);

  return <p>{replyCount}</p>;
};

export default ReplyCount;
