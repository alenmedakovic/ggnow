import React, { useState } from 'react';
import { collection, doc, addDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase'; // Import the firestore object from your Firebase configuration

const CreateReply = ({ thread }) => {
  const [content, setContent] = useState('');

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const createReply = async () => {
    const threadId = thread.id
    try {
      await addDoc(collection(firestore, `threads/${threadId}/replies`), {
        content,
        uid: auth.currentUser.uid,
        createdAt: new Date(),
      });

      // Reset form field after successful reply creation
      setContent('');

      console.log('Reply created successfully!');
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <div class="w-full mt-12 flex items-center">
      <textarea
        class="w-1/2 h-11 rounded-2xl p-2 border-gray-300 border-2 resize-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Write your reply..."
      ></textarea>
      {content && (
      <button class="ml-2 p-2" onClick={createReply}><img class="h-6 w-auto" src="https://www.svgrepo.com/show/11740/check.svg" /></button>
      )}
    </div>
  );
};

export default CreateReply;
